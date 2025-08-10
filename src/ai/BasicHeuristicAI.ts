import { Chess } from "chess.js";
import { AIStrategy } from "./AIStrategy";
import { evaluateMoves, MoveEvaluation } from "../utils/evaluation";

/**
 * AI that uses basic chess heuristics to evaluate moves
 * This AI considers material value, center control, piece development, and king safety
 */
export class BasicHeuristicAI implements AIStrategy {
  // Store the last evaluation for debugging
  private lastEvaluation: MoveEvaluation | null = null;
  /**
   * Get the best move based on basic chess heuristics
   * @param game The current chess game instance
   * @returns The best move according to heuristic evaluation or null if no moves are available
   */
  getMove(game: Chess): string | null {
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return null; // No moves available

    // Evaluate all possible moves
    const evaluatedMoves: MoveEvaluation[] = evaluateMoves(game);

    // If there are evaluated moves, return the one with the highest score
    if (evaluatedMoves.length > 0) {
      // Log the top 3 moves for debugging (if available)
      const topMoves = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
      console.log("Top moves:", topMoves.map(m =>
        `${m.move} (${m.score.toFixed(1)}) - ${m.reasons.join(", ")}`
      ));

      // Store the best move evaluation for debugging
      this.lastEvaluation = evaluatedMoves[0];

      return evaluatedMoves[0].move;
    }

    // Fallback to random move if evaluation fails
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

  /**
   * Get the evaluation data for the last move
   * @returns The detailed evaluation data or null if not available
   */
  getLastEvaluation(): MoveEvaluation | null {
    return this.lastEvaluation;
  }
}
