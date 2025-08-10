import { Chess } from "chess.js";

/**
 * Interface for an opening book entry
 */
export interface OpeningBookEntry {
  name: string;
  moves: string[];
  description?: string;
}

/**
 * Database of common chess openings
 * Each opening contains a sequence of moves in standard algebraic notation
 */
export const OPENING_BOOK: OpeningBookEntry[] = [
  {
    name: "Italian Game",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    description: "One of the oldest openings, focusing on controlling the center and developing pieces quickly."
  },
  {
    name: "Ruy Lopez (Spanish Opening)",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    description: "A popular opening that puts pressure on Black's knight and prepares for castling."
  },
  {
    name: "Sicilian Defense",
    moves: ["e4", "c5"],
    description: "A highly aggressive defense that immediately fights for the center with a flank pawn."
  },
  {
    name: "French Defense",
    moves: ["e4", "e6", "d4", "d5"],
    description: "A solid defense where Black establishes a strong pawn center."
  },
  {
    name: "Queen's Gambit",
    moves: ["d4", "d5", "c4"],
    description: "A classic opening where White offers a pawn to gain control of the center."
  },
  {
    name: "Queen's Gambit Accepted",
    moves: ["d4", "d5", "c4", "dxc4"],
    description: "Black accepts the gambit pawn, planning to hold onto it or return it for development."
  },
  {
    name: "Queen's Gambit Declined",
    moves: ["d4", "d5", "c4", "e6"],
    description: "Black declines the gambit and establishes a solid pawn structure."
  },
  {
    name: "King's Indian Defense",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7"],
    description: "A hypermodern defense where Black allows White to build a strong center, planning to attack it later."
  },
  {
    name: "English Opening",
    moves: ["c4"],
    description: "A flexible opening that can transpose into many different setups."
  },
  {
    name: "Caro-Kann Defense",
    moves: ["e4", "c6"],
    description: "A solid defense that prepares to challenge White's center with d5."
  },
  {
    name: "Scandinavian Defense",
    moves: ["e4", "d5"],
    description: "An immediate challenge to White's e4 pawn."
  },
  {
    name: "Pirc Defense",
    moves: ["e4", "d6", "d4", "Nf6", "Nc3", "g6"],
    description: "A hypermodern defense that allows White to build a strong center before counterattacking."
  },
  {
    name: "Alekhine's Defense",
    moves: ["e4", "Nf6"],
    description: "A provocative defense that tempts White's pawns forward to be attacked later."
  },
  {
    name: "Dutch Defense",
    moves: ["d4", "f5"],
    description: "An aggressive defense that immediately fights for the e4 square."
  },
  {
    name: "London System",
    moves: ["d4", "d5", "Bf4"],
    description: "A solid system opening that develops the bishop early and prepares for e3 and c3."
  }
];

/**
 * Find the next move from the opening book based on the current position
 * @param game The current chess game state
 * @returns The next move from the opening book or null if not found
 */
export function getOpeningBookMove(game: Chess): string | null {
  // Get the move history
  const history = game.history();

  // Check each opening in the book
  for (const opening of OPENING_BOOK) {
    // Check if the current move sequence matches the opening
    let matchesOpening = true;
    for (let i = 0; i < history.length; i++) {
      if (i >= opening.moves.length || history[i] !== opening.moves[i]) {
        matchesOpening = false;
        break;
      }
    }

    // If we match an opening and there's a next move available
    if (matchesOpening && history.length < opening.moves.length) {
      const nextMove = opening.moves[history.length];

      // Verify the move is legal in the current position
      const legalMoves = game.moves();
      if (legalMoves.includes(nextMove)) {
        return nextMove;
      }
    }
  }

  return null; // No matching opening found
}

/**
 * Get the name of the current opening being played
 * @param game The current chess game state
 * @returns The name of the opening or null if not found
 */
export function getOpeningName(game: Chess): string | null {
  const history = game.history();

  // Find the longest matching opening
  let bestMatch: OpeningBookEntry | null = null;
  let bestMatchLength = 0;

  for (const opening of OPENING_BOOK) {
    let matchLength = 0;
    for (let i = 0; i < Math.min(history.length, opening.moves.length); i++) {
      if (history[i] === opening.moves[i]) {
        matchLength++;
      } else {
        break;
      }
    }

    if (matchLength > bestMatchLength) {
      bestMatch = opening;
      bestMatchLength = matchLength;
    }
  }

  return bestMatch && bestMatchLength > 0 ? bestMatch.name : null;
}

/**
 * Get information about the current opening
 * @param game The current chess game state
 * @returns Information about the opening or null if not found
 */
export function getOpeningInfo(game: Chess): { name: string; description?: string } | null {
  const history = game.history();

  // Find the longest matching opening
  let bestMatch: OpeningBookEntry | null = null;
  let bestMatchLength = 0;

  for (const opening of OPENING_BOOK) {
    let matchLength = 0;
    for (let i = 0; i < Math.min(history.length, opening.moves.length); i++) {
      if (history[i] === opening.moves[i]) {
        matchLength++;
      } else {
        break;
      }
    }

    if (matchLength > bestMatchLength) {
      bestMatch = opening;
      bestMatchLength = matchLength;
    }
  }

  return bestMatch && bestMatchLength > 0
    ? { name: bestMatch.name, description: bestMatch.description }
    : null;
}
