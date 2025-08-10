import React from 'react';
import './App.css';
import ChessboardComponent from './components/Chessboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Chess App</h1>
        <div className="chessboard-wrapper">
          <ChessboardComponent boardWidth={450} />
        </div>
        <p className="instructions">
          Play chess against the computer by dragging and dropping pieces.
        </p>
      </header>
    </div>
  );
}

export default App;
