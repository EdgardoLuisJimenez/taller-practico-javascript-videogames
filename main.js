document.addEventListener("DOMContentLoaded", () => {
  let gameContainer = document.createElement("div");
  gameContainer.className = "game-container";

  let canvas = document.createElement("canvas");
  canvas.id = "game";
  gameContainer.appendChild(canvas);

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




  let mapsScript = document.createElement("script");
  mapsScript.src = "./maps.js";
  body.appendChild(mapsScript);

  let gameScript = document.createElement("script");
  gameScript.src = "./game.js";
  body.appendChild(gameScript);
});
