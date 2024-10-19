/* eslint-disable react/prop-types */
import "./App.css";
import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  let status;
  const boardRows = [];

  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((squares) => squares)) {
    // Kiểm tra nếu tất cả ô đều được đánh dấu
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const renderSquare = (i) => (
    <Square
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      highlight={winningLine.includes(i)}
    />
  );

  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      squaresInRow.push(renderSquare(row * 3 + col));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>

      <div>{boardRows}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null), // Trạng thái của 9 ô
      location: { row: -1, col: -1 }, // Vị trí của ô được cập nhật
    },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const row = Math.floor(i / 3); // -1 vì move = 0 là game start
    const col = i % 3;

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: { row, col } },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  console.log("locationMove " + location);

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move} (${squares.location.row}, ${squares.location.col})`;
    } else {
      description = "Go to game start";
    }

    if (move === currentMove) {
      return (
        <li key={move} style={{ marginTop: "5px", marginBottom: "5px" }}>
          <span className="move">{description}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button className="move" onClick={() => jumpTo(move)}>
            {description}
          </button>
        </li>
      );
    }
  });

  // Sắp xếp moves dựa trên giá trị isAscending
  if (!isAscending) {
    moves = moves.reverse();
  }

  // Hàm để bật/tắt trạng thái sắp xếp
  function toggleSortOrder() {
    setIsAscending(!isAscending); // Đảo ngược giá trị của isAscending
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        <div className="game-sort">
          <button className="sort" onClick={toggleSortOrder}>
            {isAscending ? "Sort Descending" : "Sort Ascending"}
          </button>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}
