const Player = (name, marker) => {
  return { name, marker };
};

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // row wins
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // column wins
    [0, 4, 8], [2, 4, 6]             // diagonal wins
  ];

  const getBoard = () => board;

  // Returns true if the mark was placed, false if the spot was taken.
  const placeMark = (index, marker) => {
    if (board[index] !== "") return false;
    board[index] = marker;
    return true;
  };

    const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  // Returns "X" or "O" if there's a winner, otherwise null
  const checkWinner = () => {
    for (const [a, b, c] of winConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isFull = () => board.every(cell => cell !== "");

  return { getBoard, placeMark, resetBoard, checkWinner, isFull };
})();

const DisplayController = (() => {
  // DOM references
  const cells       = document.querySelectorAll(".cell");
  const statusText  = document.querySelector("#status-text");
  const restartBtn  = document.querySelector("#restart-btn");
  const startBtn    = document.querySelector("#start-btn");
  const p1Input     = document.querySelector("#p1-name");
  const p2Input     = document.querySelector("#p2-name");

  // --- Event listeners (attached once, on module creation) ---
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => GameController.playRound(index));
  });

  startBtn.addEventListener("click", () => {
    GameController.start(getPlayerName(p1Input, "Player 1"),
                         getPlayerName(p2Input, "Player 2"));
  });

  restartBtn.addEventListener("click", () => {
    GameController.start(getPlayerName(p1Input, "Player 1"),
                         getPlayerName(p2Input, "Player 2"));
  });

   const getPlayerName = (input, fallback) => {
    const value = input.value.trim();
    return value === "" ? fallback : value;
  };

    const render = () => {
    const board = gameBoard.getBoard();
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
    });
  };

  const setStatus = (message) => {
    statusText.textContent = message;
  };

    const clearBoard = () => {
    cells.forEach(cell => (cell.textContent = ""));
  };

  return { render, setStatus, clearBoard };
})();

const GameController = (() => {
  let player1;
  let player2;
  let activePlayer;
  let gameOver;

  const start = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    activePlayer = player1;
    gameOver = false;

    gameBoard.resetBoard();
    DisplayController.render();
    DisplayController.setStatus(`${activePlayer.name}'s turn`);
  };

  const playRound = (index) => {
    // Guard: game hasn't started yet, or game is over
    if (!activePlayer || gameOver) return;

    // Guard: spot already taken (placeMark returns false)
    if (!gameBoard.placeMark(index, activePlayer.marker)) return;

    DisplayController.render();

    const winner = gameBoard.checkWinner();
    if (winner) {
      DisplayController.setStatus(`${activePlayer.name} wins!`);
      gameOver = true;
      return;
    }

    if (gameBoard.isFull()) {
      DisplayController.setStatus("It's a draw!");
      gameOver = true;
      return;
    }

    // Swap turns
    activePlayer = activePlayer === player1 ? player2 : player1;
    DisplayController.setStatus(`${activePlayer.name}'s turn`);
  };

  return { start, playRound };
})();

DisplayController.setStatus("Enter names and press Start");