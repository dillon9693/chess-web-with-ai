import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";

/**
 * AI that makes completely random moves
 * This is the simplest possible AI implementation
 */
export class RandomAI implements AIStrategy {
  /**
   * Get a random move from the list of possible moves
   * @param game The current chess game state
   * @returns A random valid move or null if no moves are available
   */
  getMove(game: Chess): string | null {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null; // No moves available

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[randomIndex];
  }

  /**
   * Get the name of this AI strategy
   * @returns The display name
   */
  getName(): string {
    return "Random";
  }
}
