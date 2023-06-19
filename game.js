/**
 * @type {HTMLCanvasElement};
 */
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

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

      if (col == "O") {
        playerPosition.x = positionX;
        playerPosition.y = positionY;
        console.log({ playerPosition });
      }
    });
  });

  movePlayer();
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function move(key) {
  console.log(`Pressed: ${key}`);
}

const moveByKey = (event) => {
  if (event.key == "ArrowUp") {
    move("up");
    playerPosition.y -= elementsSize;
    startGame();
  } else if (event.key == "ArrowLeft") move("left");
  else if (event.key == "ArrowRight") move("right");
  else if (event.key == "ArrowDown") move("down");
};

window.addEventListener("keydown", moveByKey);
