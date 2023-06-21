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
let level = 0;
let lives = 3;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const gitftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  let canvasSize;

  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.75;
  } else {
    canvasSize = window.innerHeight * 0.75;
  }
  canvasSize = Math.floor(canvasSize);

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;

  startGame();
}

function startGame() {
  game.clearRect(0, 0, canvas.width, canvas.height);
  enemyPositions = [];

  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const positionX = elementsSize * (colIndex + 1);
      const positionY = elementsSize * (rowIndex + 1);
      game.fillText(emoji, positionX, positionY);

      if (!playerPosition.x && !playerPosition.y && col == "O") {
        playerPosition.x = positionX;
        playerPosition.y = positionY;
      } else if (col == "I") {
        gitftPosition.x = positionX;
        gitftPosition.y = positionY;
      } else if (col == "X") {
        enemyPositions.push({
          x: positionX,
          y: positionY,
        });
      }
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollissionX =
    playerPosition.x.toFixed(3) == gitftPosition.x.toFixed(3);
  const giftCollissionY =
    playerPosition.y.toFixed(3) == gitftPosition.y.toFixed(3);
  const giftCollission = giftCollissionX && giftCollissionY;

  if (giftCollission) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find((enemy) => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log("Subistes de nivel");
  level++;
  startGame();
}

function levelFail() {
  console.log('CHocastes contra un enemigo!!');
  lives--;
  if (lives <= 0){
    level = 0;
    lives = 3;
  }

  
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log("Terminastes el juego!!");
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
  if (Math.ceil(playerPosition.y - elementsSize) < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft(key) {
  console.log(`Pressed: ${key}`);
  if (Math.ceil(playerPosition.x - elementsSize) < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight(key) {
  console.log(`Pressed: ${key}`);
  if (Math.ceil(playerPosition.x + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown(key) {
  console.log(`Pressed: ${key}`);
  if (Math.ceil(playerPosition.y + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
