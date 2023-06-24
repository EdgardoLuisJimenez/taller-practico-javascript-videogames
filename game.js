/**
 * @type {HTMLCanvasElement};
 */
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let oldCanvasSize = {
  canvasSize: undefined,
  x: undefined,
  y: undefined,
};
let positionDoor = {
  x: undefined,
  y: undefined,
};

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function fixNumber(number) {
  return Math.ceil(number.toFixed(5));
}

function positionPlayer() {
  if (
    (positionDoor.x != oldCanvasSize.x || positionDoor.y != oldCanvasSize.y) &&
    canvasSize != undefined
  ) {
    playerPosition.x =
      (oldCanvasSize.x * canvasSize) / oldCanvasSize.canvasSize;
    playerPosition.y =
      (oldCanvasSize.y * canvasSize) / oldCanvasSize.canvasSize;

    playerPosition.x = playerPosition.x;
    playerPosition.y = playerPosition.y;
  }
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize = fixNumber(canvasSize);

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;

  positionPlayer();
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

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  showLives();

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      let positionX = elementsSize * (colIndex + 1);
      let positionY = elementsSize * (rowIndex + 1);

      positionX = positionX;
      positionY = positionY;
      game.fillText(emoji, positionX, positionY);

      if (!playerPosition.x && !playerPosition.y && col == "O") {
        playerPosition.x = positionX;
        playerPosition.y = positionY;
        positionDoor.x = positionX;
        positionDoor.y = positionY;
      } else if (col == "I") {
        giftPosition.x = positionX;
        giftPosition.y = positionY;
      } else if (col == "X") {
        enemyPositions.push({
          x: positionX,
          y: positionY,
        });
      }
    });
  });

  oldCanvasSize.canvasSize = canvasSize;
  oldCanvasSize.x = playerPosition.x;
  oldCanvasSize.y = playerPosition.y;

  movePlayer();
}

function movePlayer() {
  const giftCollissionX =
    playerPosition.x.toFixed(0) == giftPosition.x.toFixed(0);
  const giftCollissionY =
    playerPosition.y.toFixed(0) == giftPosition.y.toFixed(0);
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
  console.log("Chocastes contra un enemigo!!");
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log("Terminastes el juego!!");
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem("record_time");
  const playerTime = formatTime(Date.now() - timeStart);

  if (recordTime) {
    if (recordTime > playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Superastes el record!!!!";
    } else {
      pResult.innerHTML = "Lo siento, no superastes el records :(";
    }
  } else {
    localStorage.setItem("record_time", playerTime);
    pResult.innerHTML =
      "Primera vez? Muy bien, pero ahora trata de superar tu tiempo";
  }
}

function showLives() {
  spanLives.innerHTML = emojis["HEART"].repeat(lives);
}

function formatTime(ms) {
  const cs = parseInt(ms / 10) % 100; // Centisegundos
  const seg = parseInt(ms / 1000) % 60; // Segundos
  const min = parseInt(ms / 60000) % 60; // Minutos
  const hr = parseInt(ms / 3600000) % 24; // Horas
  const csStr = `0${cs}`.slice(-2);
  const segStr = `0${seg}`.slice(-2);
  const minStr = `0${min}`.slice(-2);
  const hrStr = `0${hr}`.slice(-2);
  return `${hrStr}:${minStr}:${segStr}:${csStr}`;
}

function showTime() {
  spanTime.innerHTML = formatTime(Date.now() - timeStart);
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
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
  if (fixNumber(playerPosition.y - elementsSize) < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft(key) {
  console.log(`Pressed: ${key}`);
  if (fixNumber(playerPosition.x - elementsSize) < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight(key) {
  console.log(`Pressed: ${key}`);
  if (fixNumber(playerPosition.x + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown(key) {
  console.log(`Pressed: ${key}`);
  if (fixNumber(playerPosition.y + elementsSize) > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}
