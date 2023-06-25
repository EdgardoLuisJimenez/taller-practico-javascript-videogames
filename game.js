/**
 * @type {HTMLCanvasElement};
 */
document.addEventListener("DOMContentLoaded", () => {
  initialLayout();
});

function initialLayout() {
  let welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcome";

  let welcomeText1 = document.createElement("p");
  welcomeText1.textContent = "Welcome";
  welcomeDiv.appendChild(welcomeText1);

  let welcomeText2 = document.createElement("p");
  welcomeText2.textContent = "I hope you have fun with this game";
  welcomeDiv.appendChild(welcomeText2);

  let buttonContainer = document.createElement("div");
  buttonContainer.id = "game-over--button";

  let playGameButton = document.createElement("button");
  playGameButton.id = "play-game";
  playGameButton.textContent = "Play Game";
  buttonContainer.appendChild(playGameButton);

  welcomeDiv.appendChild(buttonContainer);

  document.body.appendChild(welcomeDiv);

  playGameButton.addEventListener("click", () => {
    while (welcomeDiv.firstChild) {
      welcomeDiv.firstChild.remove();
    }
    welcomeDiv.remove();
    loadGame();
  });
}

function loadGame() {
  let gameContainer = document.createElement("div");
  gameContainer.className = "game-container";

  let canvasDiv = document.createElement("canvas");
  canvasDiv.id = "game";
  gameContainer.appendChild(canvasDiv);

  let btnContainer = document.createElement("div");
  btnContainer.className = "btns";
  gameContainer.appendChild(btnContainer);

  let upBtn = document.createElement("button");
  upBtn.id = "up";
  upBtn.innerText = "Arriba";
  btnContainer.appendChild(upBtn);

  let leftBtn = document.createElement("button");
  leftBtn.id = "left";
  leftBtn.innerText = "Izquierda";
  btnContainer.appendChild(leftBtn);

  let rightBtn = document.createElement("button");
  rightBtn.id = "right";
  rightBtn.innerText = "Derecha";
  btnContainer.appendChild(rightBtn);

  let downBtn = document.createElement("button");
  downBtn.id = "down";
  downBtn.innerText = "abajo";
  btnContainer.appendChild(downBtn);

  let messagesContainer = document.createElement("div");
  messagesContainer.className = "messages";
  gameContainer.appendChild(messagesContainer);

  let livesP = document.createElement("p");
  livesP.innerHTML = 'Vidas: <span id="lives"></span>';
  messagesContainer.appendChild(livesP);

  let timeP = document.createElement("p");
  timeP.innerHTML = 'Tiempo: ⏰<span id="time"></span>';
  messagesContainer.appendChild(timeP);

  let recordP = document.createElement("p");
  recordP.innerHTML = 'Record: 🏁<span id="record"></span>';
  messagesContainer.appendChild(recordP);

  let resultP = document.createElement("p");
  resultP.id = "result";
  messagesContainer.appendChild(resultP);

  let body = document.querySelector("body");
  body.appendChild(gameContainer);

  loadInteractivityOfTheGame();
}

function loadInteractivityOfTheGame() {
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
  let level;
  let lives;
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
  let timeInterval;
  let enemyPositions = [];

  const playerPosition = {
    x: undefined,
    y: undefined,
  };

  const emojis = {
    "-": " ",
    O: "🚪",
    X: "💣",
    I: "🎁",
    PLAYER: "💀",
    BOMB_COLLISION: "🔥",
    GAME_OVER: "👎",
    WIN: "🏆",
    HEART: "❤️",
  };

  const maps = [];
  maps.push(`
    IXXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    -XXXXXXXXX
    OXXXXXXXXX
  `);
  maps.push(`
    O--XXXXXXX
    X--XXXXXXX
    XX----XXXX
    X--XX-XXXX
    X-XXX--XXX
    X-XXXX-XXX
    XX--XX--XX
    XX--XXX-XX
    XXXX---IXX
    XXXXXXXXXX
    `);
  maps.push(`
    I-----XXXX
    XXXXX-XXXX
    XX----XXXX
    XX-XXXXXXX
    XX-----XXX
    XXXXXX-XXX
    XX-----XXX
    XX-XXXXXXX
    XX-----OXX
    XXXXXXXXXX
  `);
  const giftPosition = {
    x: undefined,
    y: undefined,
  };

  setCanvasSize();

  window.addEventListener("load", setCanvasSize);
  window.addEventListener("resize", setCanvasSize);

  function setCanvasSize() {
    console.log("Entro al canvasSize");
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
    loadVariableInitialization();
    startGame();
  }

  function loadAddEventListener() {
    btnUp.addEventListener("click", moveUp);
    btnLeft.addEventListener("click", moveLeft);
    btnRight.addEventListener("click", moveRight);
    btnDown.addEventListener("click", moveDown);
    window.addEventListener("keydown", handleKeyDown);
  }

  function loadVariableInitialization() {
    level = 0;
    lives = 3;
  }

  function fixNumber(number) {
    return Math.ceil(number.toFixed(5));
  }

  function positionPlayer() {
    if (
      (positionDoor.x != oldCanvasSize.x ||
        positionDoor.y != oldCanvasSize.y) &&
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

  function startGame() {
    loadAddEventListener();
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

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    if (lives <= 0) {
      level = 0;
      lives = 3;
      timeStart = undefined;

      // Llamada a la funcion
      showGameOver();
      return;
    }

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
    setTimeout(() => {
      removeAllLabelsDOM();
    }, 2000);
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
  function handleKeyDown(event) {
    if (event.key == "ArrowUp") {
      moveUp(event.key);
    } else if (event.key == "ArrowLeft") {
      moveLeft(event.key);
    } else if (event.key == "ArrowRight") {
      moveRight(event.key);
    } else if (event.key == "ArrowDown") {
      moveDown(event.key);
    }
  }

  function showGameOver() {
    // Game Over
    let gameOver = document.createElement("div");
    gameOver.id = "game-over";

    let gameOverText = document.createElement("p");
    gameOverText.textContent = "Game over";
    gameOver.appendChild(gameOverText);

    let playAgainText = document.createElement("p");
    playAgainText.textContent = "Play Again?";
    gameOver.appendChild(playAgainText);

    let buttonContainer = document.createElement("div");
    buttonContainer.id = "game-over--button";

    let yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    buttonContainer.appendChild(yesButton);

    let noButton = document.createElement("button");
    noButton.textContent = "No";
    buttonContainer.appendChild(noButton);

    gameOver.appendChild(buttonContainer);

    document.body.appendChild(gameOver);

    btnUp.removeEventListener("click", moveUp);
    btnLeft.removeEventListener("click", moveLeft);
    btnRight.removeEventListener("click", moveRight);
    btnDown.removeEventListener("click", moveDown);

    window.removeEventListener("keydown", handleKeyDown);

    yesButton.addEventListener("click", () => {
      while (gameOver.firstChild) {
        gameOver.firstChild.remove();
      }
      gameOver.remove();
      startGame();
    });

    noButton.addEventListener("click", () => {
      removeAllLabelsDOM();
      initialLayout();
    });
  }
  function removeAllLabelsDOM() {
    const rootElement = document.body;
    while (rootElement.firstChild) {
      rootElement.firstChild.remove();
    }
  }
}
