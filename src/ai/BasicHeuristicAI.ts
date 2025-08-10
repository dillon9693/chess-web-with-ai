import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";

/**
 * AI that uses basic chess heuristics to evaluate moves
 * This AI considers material value, center control, piece development, and king safety
 */
export class BasicHeuristicAI implements AIStrategy {
  /**
   * Get the best move based on basic chess heuristics
   * @param game The current chess game state
   * @returns The best move according to heuristic evaluation or null if no moves are available
   */
  getMove(game: Chess): string | null {
    // This is a placeholder implementation that just makes random moves
    // We'll replace this with actual heuristic evaluation in a later step
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
    return "Basic Heuristic";
  }
}
