import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";
import { MoveEvaluation, evaluatePosition } from "../utils/evaluation";

/**
 * AI that uses the Minimax algorithm with alpha-beta pruning
 * This AI looks ahead several moves to find the best move
 */
export class MinimaxAI implements AIStrategy {
  private depth: number;
  private lastEvaluation: MoveEvaluation | null = null;

  /**
   * Create a new MinimaxAI with the specified search depth
   * @param depth How many moves to look ahead (higher = stronger but slower)
   */
  constructor(depth: number = 3) {
    this.depth = depth;
  }

  /**
   * Get the best move using the Minimax algorithm with alpha-beta pruning
   * @param game The current chess game state
   * @returns The best move according to Minimax evaluation or null if no moves are available
   */
  getMove(game: Chess): string | null {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null; // No moves available

    let bestMove: string | null = null;
    let bestScore = -Infinity;
    const isMaximizing = true; // Root is always maximizing
    const alpha = -Infinity;
    const beta = Infinity;
    const startTime = Date.now();
    const reasons: string[] = [];

    // Evaluate each possible move
    for (const move of possibleMoves) {
      // Make the move on a cloned game
      const tempGame = new Chess(game.fen());
      tempGame.move(move);

      // Get the score for this move using minimax
      const score = this.minimax(tempGame, this.depth - 1, alpha, beta, !isMaximizing);

      // Track the best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // Calculate thinking time
    const endTime = Date.now();
    const thinkingTime = (endTime - startTime) / 1000;

    // Add reasons for the move
    reasons.push(`Minimax search with depth ${this.depth}`);
    reasons.push(`Evaluated position score: ${bestScore.toFixed(1)}`);
    reasons.push(`Thinking time: ${thinkingTime.toFixed(2)}s`);

    // Store the evaluation for debugging
    if (bestMove) {
      this.lastEvaluation = {
        move: bestMove,
        score: bestScore,
        reasons
      };
    }

    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   * @param game The current game state
   * @param depth How many more levels to search
   * @param alpha Alpha value for pruning
   * @param beta Beta value for pruning
   * @param isMaximizing Whether this is a maximizing node
   * @returns The best score for this position
   */
  private minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    // Base case: reached maximum depth or game over
    if (depth === 0 || game.isGameOver()) {
      return this.evaluateBoard(game);
    }

    const possibleMoves = game.moves();

    if (isMaximizing) {
      // Maximizing player (us)
      let bestScore = -Infinity;
      for (const move of possibleMoves) {
        // Make the move on a cloned game
        const tempGame = new Chess(game.fen());
        tempGame.move(move);

        // Recursively evaluate this position
        const score = this.minimax(tempGame, depth - 1, alpha, beta, false);
        bestScore = Math.max(score, bestScore);

        // Alpha-beta pruning
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) {
          break; // Beta cutoff
        }
      }
      return bestScore;
    } else {
      // Minimizing player (opponent)
      let bestScore = Infinity;
      for (const move of possibleMoves) {
        // Make the move on a cloned game
        const tempGame = new Chess(game.fen());
        tempGame.move(move);

        // Recursively evaluate this position
        const score = this.minimax(tempGame, depth - 1, alpha, beta, true);
        bestScore = Math.min(score, bestScore);

        // Alpha-beta pruning
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break; // Alpha cutoff
        }
      }
      return bestScore;
    }
  }

  /**
   * Evaluate a board position
   * @param game The game state to evaluate
   * @returns A score for the position (positive is good for current player)
   */
  private evaluateBoard(game: Chess): number {
    // Use our existing evaluation function
    return evaluatePosition(game);
  }

  /**
   * Get the name of this AI strategy
   * @returns The display name
   */
  getName(): string {
    return `Minimax (Depth ${this.depth})`;
  }

  /**
   * Get the evaluation data for the last move
   * @returns The detailed evaluation data or null if not available
   */
  getLastEvaluation(): MoveEvaluation | null {
    return this.lastEvaluation;
  }
}
