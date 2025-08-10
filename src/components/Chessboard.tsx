import React, { useState, useEffect, useRef } from "react";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { Chess } from "chess.js";

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

  // Function to make a random computer move
  const makeRandomMove = () => {
    // Get all possible moves
    const possibleMoves = game.moves();

    // If the game is over, do nothing
    if (game.isGameOver()) {
      setGameOver(true);
      return;
    }

    // Choose a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];

    // Make the move
    game.move(move);

    // Update the game state
    setChessPosition(game.fen());
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

      // Make a computer move after a short delay
      setTimeout(makeRandomMove, 300);

      return true;
    } catch (error) {
      // TODO add message indicating bad move
      console.error("Error making move:", error);
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
      <Chessboard options={chessboardOptions} />
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
