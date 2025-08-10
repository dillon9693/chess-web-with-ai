import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";
import { MoveEvaluation } from "../utils/evaluation";
import { getOpeningBookMove, getOpeningInfo } from "../utils/openingBook";

/**
 * AI that uses an opening book for the first several moves
 * and then falls back to another strategy
 */
export class OpeningBookAI implements AIStrategy {
  private fallbackStrategy: AIStrategy;
  private lastEvaluation: MoveEvaluation | null = null;

  /**
   * Create a new OpeningBookAI
   * @param fallbackStrategy The strategy to use when out of the opening book
   */
  constructor(fallbackStrategy: AIStrategy) {
    this.fallbackStrategy = fallbackStrategy;
  }

  /**
   * Get the next move using the opening book if possible,
   * otherwise fall back to the fallback strategy
   * @param game The current chess game state
   * @returns A valid move in algebraic notation or null if no moves are available
   */
  getMove(game: Chess): string | null {
    // Try to find a move in the opening book
    const bookMove = getOpeningBookMove(game);

    if (bookMove) {
      // We found a move in the opening book
      const openingInfo = getOpeningInfo(game);

      // Create an evaluation for the move
      this.lastEvaluation = {
        move: bookMove,
        score: 0, // Opening book moves don't have a score
        reasons: [
          `Opening book move from: ${openingInfo?.name || "Unknown opening"}`,
          openingInfo?.description || "Following established opening theory"
        ]
      };

      return bookMove;
    }

    // If we're out of the opening book, use the fallback strategy
    const move = this.fallbackStrategy.getMove(game);

    // Get the evaluation from the fallback strategy
    this.lastEvaluation = this.fallbackStrategy.getLastEvaluation();

    // If we have an evaluation, add a note that we're out of the opening book
    if (this.lastEvaluation) {
      this.lastEvaluation.reasons.unshift("Out of opening book, using fallback strategy");
    }

    return move;
  }

  /**
   * Get the name of this AI strategy
   * @returns The display name
   */
  getName(): string {
    return `Opening Book + ${this.fallbackStrategy.getName()}`;
  }

  /**
   * Get the evaluation data for the last move
   * @returns The detailed evaluation data or null if not available
   */
  getLastEvaluation(): MoveEvaluation | null {
    return this.lastEvaluation;
  }
}
