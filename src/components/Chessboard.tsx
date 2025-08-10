import React, { useState, useEffect } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Create a component with any props to bypass TypeScript checking
const Chessboard = ReactChessboard as any;

interface ChessboardComponentProps {
  boardWidth?: number;
}

// Using any type for the Chessboard props to bypass TypeScript checking
// This is a temporary solution until we can properly type the Chessboard component
const ChessboardComponent: React.FC<ChessboardComponentProps> = ({ boardWidth = 500 }) => {
  // Initialize the chess instance with the starting position
  const [game, setGame] = useState<Chess>(new Chess());
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  // Function to make a random computer move
  const makeRandomMove = () => {
    // Get all possible moves
    const possibleMoves = game.moves();

    // If the game is over, do nothing
    if (possibleMoves.length === 0 || game.isGameOver() || gameOver) {
      setGameOver(true);
      return;
    }

    // Choose a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];

    // Make the move
    game.move(move);

    // Update the game state
    setGame(new Chess(game.fen()));
  };

  // Function to handle piece movement by the player
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      // If the game is over, don't allow moves
      if (gameOver || game.isGameOver()) {
        setGameOver(true);
        return false;
      }

      // Attempt to make the move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      });

      // If the move is invalid, return false to reset the piece position
      if (move === null) return false;

      // Update the game state
      setGame(new Chess(game.fen()));

      // Make a computer move after a short delay
      setTimeout(makeRandomMove, 300);

      return true;
    } catch (error) {
      return false;
    }
  };

  // Check for game over conditions and update status
  useEffect(() => {
    let statusText = '';

    if (game.isGameOver()) {
      setGameOver(true);

      if (game.isCheckmate()) {
        statusText = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
      } else if (game.isDraw()) {
        statusText = 'Game ended in a draw!';
        if (game.isStalemate()) {
          statusText = 'Game ended in stalemate!';
        } else if (game.isThreefoldRepetition()) {
          statusText = 'Game ended in draw by repetition!';
        } else if (game.isInsufficientMaterial()) {
          statusText = 'Game ended in draw due to insufficient material!';
        }
      }
    } else {
      // Game is ongoing
      statusText = `${game.turn() === 'w' ? 'White' : 'Black'} to move`;

      if (game.isCheck()) {
        statusText += ' (Check!)';
      }
    }

    setStatus(statusText);
  }, [game]);

  return (
    <div className="chessboard-container">
      <div className="game-status">{status}</div>
      <Chessboard
        boardWidth={boardWidth}
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
        // @ts-ignore - Ignoring TypeScript errors for Chessboard props
      />
      {gameOver && (
        <button
          className="reset-button"
          onClick={() => {
            setGame(new Chess());
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
