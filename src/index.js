import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.classes}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, row, col)}
        classes={this.props.winner.includes(i) ? "square winner" : "square"}
      />
    );
  }

  createBoard() {
    let newBoard = [];
    let idCounter = 0;

    for (var i = 0; i < 3; i++) {
      let rows = [];

      for (var j = 0; j < 3; j++) {
        rows = rows.concat(this.renderSquare(idCounter, i + 1, j + 1));
        idCounter++;
      }

      newBoard = newBoard.concat(<div className="board-row">{rows}</div>);
    }

    return newBoard;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      activeIndex: 0,
      reverseOrder: false,
    };
  }

  handleClick(i, row, col) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: row,
        col: col,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      activeIndex: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      activeIndex: step,
    });
  }

  toggleOrder() {
    this.setState({
      reverseOrder: !this.state.reverseOrder,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const location = step.row && step.col ?
        '(' + step.row + '/' + step.col + ')' : '';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={
              this.state.activeIndex === move ? 'active' : ''
            }
          >{desc}</button>
          <label>{location}</label>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, row, col) => this.handleClick(i, row, col)}
            winner={winner ? winner[1] : [null]}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              className="toggle"
              onClick={() => this.toggleOrder()}>
              {this.state.reverseOrder ? "Sort descending" : "Sort ascending"}
              </button>
          </div>
          <ol>{this.state.reverseOrder ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
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
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
