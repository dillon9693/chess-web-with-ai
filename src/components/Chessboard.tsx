import React, { useState } from 'react';
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

  // Function to handle piece movement
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
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

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="chessboard-container">
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
    </div>
  );
};

export default ChessboardComponent;
