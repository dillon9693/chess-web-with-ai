import React from "react";
import { MoveEvaluation } from "../utils/evaluation";
import "./MoveReasoning.css";

interface MoveReasoningProps {
  lastEvaluation: MoveEvaluation | null;
  isVisible: boolean;
}

/**
 * Component to display the reasoning behind the AI's last move
 */
const MoveReasoning: React.FC<MoveReasoningProps> = ({
  lastEvaluation,
  isVisible,
}) => {
  if (!isVisible || !lastEvaluation) {
    return null;
  }

  return (
    <div className="move-reasoning">
      <h3>AI Move Analysis</h3>
      <div className="move-info">
        <div className="move-name">
          <strong>Move:</strong> {lastEvaluation.move}
        </div>
        <div className="move-score">
          <strong>Score:</strong> {lastEvaluation.score.toFixed(1)}
        </div>
      </div>
      <div className="reasoning-list">
        <strong>Reasoning:</strong>
        {lastEvaluation.reasons.length > 0 ? (
          <ul>
            {lastEvaluation.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p>No specific reasons provided.</p>
        )}
      </div>
    </div>
  );
};

export default MoveReasoning;
