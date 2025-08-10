import { AIStrategy } from "./AIStrategy";
import { RandomAI } from "./RandomAI";
import { BasicHeuristicAI } from "./BasicHeuristicAI";
import { MinimaxAI } from "./MinimaxAI";

/**
 * Factory class for creating AI strategy instances
 */
export class AIFactory {
  /**
   * Get all available AI strategies
   * @returns Array of AI strategy instances
   */
  static getAllStrategies(): AIStrategy[] {
    return [
      new RandomAI(),
      new BasicHeuristicAI(),
      new MinimaxAI(2), // Depth 2 - Easy
      new MinimaxAI(3), // Depth 3 - Medium
      new MinimaxAI(4), // Depth 4 - Hard (might be slow on some devices)
    ];
  }

  /**
   * Get an AI strategy by name
   * @param name The name of the strategy to get
   * @returns The requested strategy or RandomAI if not found
   */
  static getStrategyByName(name: string): AIStrategy {
    const strategies = this.getAllStrategies();
    const strategy = strategies.find(s => s.getName() === name);
    return strategy || new RandomAI(); // Default to RandomAI if not found
  }

  /**
   * Get the default AI strategy
   * @returns The default strategy (RandomAI)
   */
  static getDefaultStrategy(): AIStrategy {
    return new RandomAI();
  }
}
