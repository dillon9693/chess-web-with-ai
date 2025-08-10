import { Chess, Square } from "chess.js";

/**
 * Piece values for material evaluation
 */
export const PIECE_VALUES = {
  p: 1,   // pawn
  n: 3,   // knight
  b: 3,   // bishop
  r: 5,   // rook
  q: 9,   // queen
  k: 0,   // king (not counted in material evaluation)
};

/**
 * Central squares for center control evaluation
 */
export const CENTER_SQUARES = ["d4", "d5", "e4", "e5"];
export const EXTENDED_CENTER = [
  "c3", "c4", "c5", "c6",
  "d3", "d4", "d5", "d6",
  "e3", "e4", "e5", "e6",
  "f3", "f4", "f5", "f6",
];

/**
 * Starting squares for piece development evaluation
 */
export const STARTING_SQUARES = {
  w: {
    n: ["b1", "g1"], // knights
    b: ["c1", "f1"], // bishops
  },
  b: {
    n: ["b8", "g8"], // knights
    b: ["c8", "f8"], // bishops
  },
};

/**
 * Interface for move evaluation results
 */
export interface MoveEvaluation {
  move: string;
  score: number;
  reasons: string[];
}

/**
 * Evaluate material balance for the current position
 * @param game Chess game instance
 * @returns Material balance score (positive is good for current player)
 */
export function evaluateMaterial(game: Chess): number {
  const board = game.board();
  let score = 0;

  // Current player's color
  const currentPlayer = game.turn();

  // Evaluate material balance
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceType = piece.type.toLowerCase() as keyof typeof PIECE_VALUES;
        const pieceValue = PIECE_VALUES[pieceType];
        // Add value for current player's pieces, subtract for opponent's
        score += piece.color === currentPlayer ? pieceValue : -pieceValue;
      }
    }
  }

  return score;
}

/**
 * Evaluate center control for the current position
 * @param game Chess game instance
 * @returns Center control score (positive is good for current player)
 */
export function evaluateCenterControl(game: Chess): number {
  const board = game.board();
  let score = 0;

  // Current player's color
  const currentPlayer = game.turn();

  // Check control of center squares
  for (const square of CENTER_SQUARES) {
    // Convert algebraic notation to row/col
    const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(square[1]);

    // Check if piece is on this square
    const piece = board[row][col];
    if (piece) {
      // Add points for having pieces in the center
      score += piece.color === currentPlayer ? 0.5 : -0.5;
    }

    // Check attacks on this square (simplified)
    const squareObj = square as Square;
    const attacks = game.moves({ square: squareObj, verbose: true });
    for (const attack of attacks) {
      score += attack.color === currentPlayer ? 0.3 : -0.3;
    }
  }

  return score;
}

/**
 * Evaluate piece development (knights and bishops out of starting position)
 * @param game Chess game instance
 * @returns Development score (positive is good for current player)
 */
export function evaluateDevelopment(game: Chess): number {
  const board = game.board();
  let score = 0;

  // Current player's color
  const currentPlayer = game.turn();
  const opponent = currentPlayer === 'w' ? 'b' : 'w';

  // Check if knights and bishops have moved from starting squares
  for (const pieceType of ['n', 'b'] as const) {
    for (const startSquare of STARTING_SQUARES[currentPlayer][pieceType]) {
      // Convert algebraic notation to row/col
      const col = startSquare.charCodeAt(0) - 'a'.charCodeAt(0);
      const row = 8 - parseInt(startSquare[1]);

      // Check if the piece is still on its starting square
      const piece = board[row][col];
      if (!piece || piece.type.toLowerCase() !== pieceType || piece.color !== currentPlayer) {
        // Piece has moved from starting square, good for development
        score += 0.5;
      }
    }

    // Check opponent's development too
    for (const startSquare of STARTING_SQUARES[opponent][pieceType]) {
      const col = startSquare.charCodeAt(0) - 'a'.charCodeAt(0);
      const row = 8 - parseInt(startSquare[1]);

      const piece = board[row][col];
      if (!piece || piece.type.toLowerCase() !== pieceType || piece.color !== opponent) {
        // Opponent's piece has moved from starting square, bad for us
        score -= 0.5;
      }
    }
  }

  return score;
}

/**
 * Evaluate king safety based on checks, checkmates, and exposed king
 * @param game Chess game instance
 * @returns King safety score (positive is good for current player)
 */
export function evaluateKingSafety(game: Chess): number {
  let score = 0;

  // Current player's color
  const currentPlayer = game.turn();

  // Check if the current player is in check
  if (game.isCheck()) {
    score -= 2.0; // Being in check is bad
  }

  // Check if the opponent is in check (after we make a move)
  // We'll check this by examining all our possible moves
  const checkMoves = game.moves({ verbose: true });
  for (const move of checkMoves) {
    const tempGame = new Chess(game.fen());
    tempGame.move(move);
    if (tempGame.isCheck()) {
      score += 0.5; // Giving check is good
      break; // One check is enough to know we can deliver check
    }
  }

  // Check for checkmate possibilities
  if (game.isCheckmate()) {
    score = -1000; // Being checkmated is very bad
  }

  // Check for checkmate in one move
  const mateMoves = game.moves({ verbose: true });
  for (const move of mateMoves) {
    const tempGame = new Chess(game.fen());
    tempGame.move(move);
    if (tempGame.isCheckmate()) {
      score = 1000; // Checkmate in one move is very good
    }
  }

  return score;
}

/**
 * Evaluate a chess position using multiple heuristics
 * @param game Chess game instance
 * @returns Overall evaluation score (positive is good for current player)
 */
export function evaluatePosition(game: Chess): number {
  // Combine all evaluation functions with weights
  const materialScore = evaluateMaterial(game) * 1.0;
  const centerScore = evaluateCenterControl(game) * 0.3;
  const developmentScore = evaluateDevelopment(game) * 0.5;
  const kingSafetyScore = evaluateKingSafety(game) * 2.0;

  return materialScore + centerScore + developmentScore + kingSafetyScore;
}

/**
 * Evaluate all possible moves and return them with scores
 * @param game Chess game instance
 * @returns Array of moves with their evaluations
 */
export function evaluateMoves(game: Chess): MoveEvaluation[] {
  const possibleMoves = game.moves();
  const evaluations: MoveEvaluation[] = [];

  for (const move of possibleMoves) {
    // Make the move on a cloned game
    const tempGame = new Chess(game.fen());
    tempGame.move(move);

    // Evaluate the resulting position
    const materialScore = evaluateMaterial(tempGame);
    const centerScore = evaluateCenterControl(tempGame);
    const developmentScore = evaluateDevelopment(tempGame);
    const kingSafetyScore = evaluateKingSafety(tempGame);

    // Calculate total score
    const totalScore =
      materialScore * 1.0 +
      centerScore * 0.3 +
      developmentScore * 0.5 +
      kingSafetyScore * 2.0;

    // Create reasons array for debugging
    const reasons = [];
    if (materialScore !== 0) reasons.push(`Material: ${materialScore.toFixed(1)}`);
    if (centerScore !== 0) reasons.push(`Center control: ${centerScore.toFixed(1)}`);
    if (developmentScore !== 0) reasons.push(`Development: ${developmentScore.toFixed(1)}`);
    if (kingSafetyScore !== 0) reasons.push(`King safety: ${kingSafetyScore.toFixed(1)}`);

    // Add to evaluations array
    evaluations.push({
      move,
      score: totalScore,
      reasons,
    });
  }

  // Sort evaluations by score (highest first)
  evaluations.sort((a, b) => b.score - a.score);

  return evaluations;
}
