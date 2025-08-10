import React from "react";
import { AIStrategy, AIFactory } from "../ai";
import "./AISelector.css";

interface AISelectorProps {
  currentStrategy: AIStrategy;
  onStrategyChange: (strategy: AIStrategy) => void;
}

/**
 * Component for selecting an AI strategy
 */
const AISelector: React.FC<AISelectorProps> = ({
  currentStrategy,
  onStrategyChange,
}) => {
  const strategies = AIFactory.getAllStrategies();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategyName = event.target.value;
    const selectedStrategy = AIFactory.getStrategyByName(selectedStrategyName);
    onStrategyChange(selectedStrategy);
  };

  return (
    <div className="ai-selector">
      <label htmlFor="ai-strategy">Computer Difficulty:</label>
      <select
        id="ai-strategy"
        value={currentStrategy.getName()}
        onChange={handleChange}
      >
        {strategies.map((strategy) => (
          <option key={strategy.getName()} value={strategy.getName()}>
            {strategy.getName()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AISelector;
