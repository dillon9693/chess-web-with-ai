import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";
import { MoveEvaluation } from "../utils/evaluation";

/**
 * AI that makes completely random moves
 * This is the simplest possible AI implementation
 */
export class RandomAI implements AIStrategy {
  // Random AI doesn't have detailed evaluations
  private lastMove: string | null = null;
  /**
   * Get a random move from the list of possible moves
   * @param game The current chess game state
   * @returns A random valid move or null if no moves are available
   */
  getMove(game: Chess): string | null {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null; // No moves available

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    this.lastMove = possibleMoves[randomIndex];
    return this.lastMove;
  }

  /**
   * Get the name of this AI strategy
   * @returns The display name
   */
  getName(): string {
    return "Random";
  }

  /**
   * Get the evaluation data for the last move
   * For random AI, we just return a simple evaluation with no detailed reasoning
   * @returns A simple evaluation object or null
   */
  getLastEvaluation(): MoveEvaluation | null {
    if (!this.lastMove) return null;

    return {
      move: this.lastMove,
      score: 0, // Random AI doesn't score moves
      reasons: ["Random move selection"]
    };
  }
}
