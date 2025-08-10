# Chess Web App with AI

A React-based chess application with multiple AI strategies, built as a playground for testing development with Cline and various LLM models.

## Project Overview

This project is a web-based chess game where users can play against different AI opponents with varying levels of difficulty. It was developed incrementally using Cline (an AI coding assistant) to demonstrate how LLMs can assist in building complex applications.

### AI Strategies Implemented

1. **Random AI**
   - Makes completely random moves
   - Serves as a baseline for comparison

2. **Basic Heuristic AI**
   - Evaluates moves based on chess principles:
     - Material counting (Queen=9, Rook=5, Bishop/Knight=3, Pawn=1)
     - Center control
     - Piece development
     - King safety

3. **Minimax AI**
   - Implements the Minimax algorithm with alpha-beta pruning
   - Available at multiple difficulty levels (search depths 2-4)
   - Looks ahead several moves to find the best option

### Key Features

- **Modular AI System**: Easily extensible with new AI strategies
- **Interactive UI**: Clean interface with real-time feedback
- **Move Reasoning**: Option to display the AI's thought process
- **Multiple Difficulty Levels**: From beginner to advanced

## Development Process

This project was built incrementally in phases:

1. **Phase 1A**: Infrastructure setup with strategy pattern
2. **Phase 1B**: Basic heuristic evaluation implementation
3. **Phase 1C**: Move reasoning display and debugging features
4. **Phase 2**: Minimax algorithm with alpha-beta pruning

## LLM Development Notes

This repository serves as a playground for exploring how LLMs like Cline can assist in software development. The entire project was built with guidance from AI, demonstrating:

- How complex algorithms can be implemented with AI assistance
- The effectiveness of incremental development with LLM guidance
- Patterns for creating modular, extensible code with AI help

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder, optimized for best performance.

## Technologies Used

- React
- TypeScript
- chess.js (for chess logic)
- react-chessboard (for the UI)
