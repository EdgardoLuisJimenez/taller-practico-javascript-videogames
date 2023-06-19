/**
 * @type {HTMLCanvasElement};
 */
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

let canvasSize;
let elementsSize;

const playerPosition = {
  x: undefined,
  y: undefined,
};

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  let canvasSize;

  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.75;
  } else {
    canvasSize = window.innerHeight * 0.75;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  game.clearRect(0, 0, canvas.width, canvas.height);
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[0];
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const positionX = elementsSize * (colIndex + 1);
      const positionY = elementsSize * (rowIndex + 1);
      game.fillText(emoji, positionX, positionY);

      if (!playerPosition.x && col == "O") {
        playerPosition.x = positionX;
        playerPosition.y = positionY;
      }
    });
  });

  movePlayer();
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);
window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    moveUp(event.key);
  } else if (event.key == "ArrowLeft") {
    moveLeft(event.key);
  } else if (event.key == "ArrowRight") {
    moveRight(event.key);
  } else if (event.key == "ArrowDown") {
    moveDown(event.key);
  }
});

function moveUp(key) {
  console.log(`Pressed: ${key}`);
  playerPosition.y -= elementsSize;
  console.log({ playerPosition });
  startGame();
}
function moveLeft(key) {
  console.log(`Pressed: ${key}`);
  playerPosition.x -= elementsSize;
  console.log({ playerPosition });
  startGame();
}
function moveRight(key) {
  console.log(`Pressed: ${key}`);
  playerPosition.x += elementsSize;
  console.log({ playerPosition });
  startGame();
}
function moveDown(key) {
  console.log(`Pressed: ${key}`);
  playerPosition.y += elementsSize;
  console.log({ playerPosition });
  startGame();
}
