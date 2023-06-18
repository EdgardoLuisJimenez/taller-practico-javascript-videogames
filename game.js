/**
 * @type {HTMLCanvasElement};
 */
const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

let canvasSize;
let elementsSize;

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

  const map = maps[2];
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log(mapRowCols);

  for (let row = 1; row <= 10; row++) {
    for (let column = 1; column <= 10; column++) {
      // Parameters(text, xAxis, yAxis)
      game.fillText(
        emojis[mapRowCols[row - 1][column - 1]],
        elementsSize * row + 10,
        elementsSize * column - 10
      );
    }
  }
}
