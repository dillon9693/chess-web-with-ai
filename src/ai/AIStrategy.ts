import { Chess } from "chess.js";

/**
 * Interface for all chess AI strategies
 * Each strategy must implement a getMove method that returns a valid chess move
 */
export interface AIStrategy {
  /**
   * Get the next move for the AI
   * @param game The current chess game state
   * @returns A valid move in algebraic notation (e.g., "e4", "Nf3") or null if no moves are available
   */
  getMove(game: Chess): string | null;

  /**
   * Get the name of the AI strategy
   * @returns The display name of the strategy
   */
  getName(): string;
}
