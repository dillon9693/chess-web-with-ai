import React, { useState, useEffect, useRef } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { AIStrategy, AIFactory } from "../ai";
import { MoveEvaluation } from "../utils/evaluation";
import { getOpeningInfo } from "../utils/openingBook";
import AISelector from "./AISelector";
import MoveReasoning from "./MoveReasoning";
import "./Chessboard.css";

// Create a component with any props to bypass TypeScript checking
const Chessboard = ReactChessboard as any;

interface ChessboardComponentProps {}

// Using any type for the Chessboard props to bypass TypeScript checking
// This is a temporary solution until we can properly type the Chessboard component
const ChessboardComponent: React.FC<ChessboardComponentProps> = (props) => {
  // Use a ref to prevent stale closures
  const gameRef = useRef<Chess>(new Chess());
  const game = gameRef.current;

  // Initialize the chess instance with the starting position
  const [chessPosition, setChessPosition] = useState(game.fen());
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [aiStrategy, setAIStrategy] = useState<AIStrategy>(AIFactory.getDefaultStrategy());
  const [lastEvaluation, setLastEvaluation] = useState<MoveEvaluation | null>(null);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [currentOpening, setCurrentOpening] = useState<{ name: string; description?: string } | null>(null);

  // Function to make a computer move using the selected AI strategy
  const makeMove = () => {
    // If the game is over, do nothing
    if (game.isGameOver()) {
      setGameOver(true);
      return;
    }

    // Get the next move from the AI strategy
    const nextMove = aiStrategy.getMove(game);

    // Get the evaluation data from the AI strategy
    const evaluation = aiStrategy.getLastEvaluation();
    setLastEvaluation(evaluation);

    // Make the move
    if (nextMove) {
      game.move(nextMove);
      // Update the game state
      setChessPosition(game.fen());
    }
  };

  // Function to handle piece movement by the player
  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) => {
    console.log("onDrop called", sourceSquare, targetSquare);

    try {
      game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
      });

      // Update the game state with the new position
      setChessPosition(game.fen());

      // Clear any error message when a valid move is made
      if (errorMessage) {
        setErrorMessage("");
      }

      // Make a computer move after a short delay
      setTimeout(makeMove, 300);

      return true;
    } catch (error) {
      // Display error message to the user
      setErrorMessage("Invalid move! Please try again.");
      console.error("Error making move:", error);

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return false;
    }
  };

  // Check for game over conditions and update status
  useEffect(() => {
    let statusText = "";

    if (game.isGameOver()) {
      setGameOver(true);

      if (game.isCheckmate()) {
        statusText = `Checkmate! ${
          game.turn() === "w" ? "Black" : "White"
        } wins!`;
      } else if (game.isDraw()) {
        statusText = "Game ended in a draw!";
        if (game.isStalemate()) {
          statusText = "Game ended in stalemate!";
        } else if (game.isThreefoldRepetition()) {
          statusText = "Game ended in draw by repetition!";
        } else if (game.isInsufficientMaterial()) {
          statusText = "Game ended in draw due to insufficient material!";
        }
      }
    } else {
      // Game is ongoing
      statusText = `${game.turn() === "w" ? "White" : "Black"} to move`;

      if (game.isCheck()) {
        statusText += " (Check!)";
      }
    }

    setStatus(statusText);

    // Update the current opening information
    setCurrentOpening(getOpeningInfo(game));
  }, [chessPosition]); // Update when the position changes

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "chessboard",
    boardStyle: {
      borderRadius: "4px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className="chessboard-container">
      <div className="game-status">{status}</div>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      {currentOpening && (
        <div className="opening-info">
          <span className="opening-name">{currentOpening.name}</span>
          {currentOpening.description && (
            <span className="opening-description">{currentOpening.description}</span>
          )}
        </div>
      )}
      <AISelector
        currentStrategy={aiStrategy}
        onStrategyChange={setAIStrategy}
      />
      <div className="debug-controls">
        <button
          className="toggle-reasoning"
          onClick={() => setShowReasoning(!showReasoning)}
        >
          {showReasoning ? "Hide AI Reasoning" : "Show AI Reasoning"}
        </button>
      </div>
      <Chessboard options={chessboardOptions} />
      <MoveReasoning
        lastEvaluation={lastEvaluation}
        isVisible={showReasoning}
      />
      {gameOver && (
        <button
          className="reset-button"
          onClick={() => {
            // Reset the game object
            gameRef.current = new Chess();
            // Update the position state
            setChessPosition(gameRef.current.fen());
            setGameOver(false);
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default ChessboardComponent;
