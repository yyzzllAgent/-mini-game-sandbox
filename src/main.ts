import "./style.css";
import { createBoard, hasWon, isGameOver, move, spawnTile } from "./game";
import type { Board, Direction } from "./game";

const rng: () => number = () => Math.random();

let board: Board = [];
let score = 0;
let over = false;

function render(): void {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  app.textContent = "";

  const header = document.createElement("header");
  const scoreEl = document.createElement("p");
  scoreEl.textContent = `Score: ${score}`;

  const newGameBtn = document.createElement("button");
  newGameBtn.type = "button";
  newGameBtn.textContent = "New game";
  newGameBtn.addEventListener("click", start);

  header.append(scoreEl, newGameBtn);

  const grid = document.createElement("div");
  grid.className = "grid";

  for (const value of board) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = value === 0 ? "" : String(value);
    grid.append(cell);
  }

  const status = document.createElement("p");
  status.className = "status";
  if (over) {
    status.textContent = hasWon(board) ? "You win!" : "Game over";
  } else {
    status.textContent = "Use the arrow keys to play";
  }

  app.append(header, grid, status);
}

function start(): void {
  board = createBoard(rng);
  score = 0;
  over = false;
  render();
}

function handleKey(event: KeyboardEvent): void {
  if (over) {
    return;
  }
  const directions: Record<string, Direction> = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
  };
  const dir = directions[event.key];
  if (!dir) {
    return;
  }

  const result = move(board, dir);
  if (!result.moved) {
    return;
  }

  board = spawnTile(result.board, rng);
  score += result.gained;

  if (isGameOver(board) || hasWon(board)) {
    over = true;
  }
  render();
}

start();
window.addEventListener("keydown", handleKey);
