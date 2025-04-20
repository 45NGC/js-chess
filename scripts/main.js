import { Game } from "./game.js";

const game = new Game();

document.getElementById("start-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "none";
	document.getElementById("game-container").style.display = "block";

	game.startGame();
});

document.getElementById("exit-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "flex";
	document.getElementById("game-container").style.display = "none";

	game.restartGame();
});

document.getElementById("restart-button").addEventListener("click", () => {
    game.restartGame();
});

document.getElementById("go-back-button").addEventListener("click", () => {
    game.goBackPosition();
});

document.getElementById("rotate-board-button").addEventListener("click", () => {
    game.rotateBoard();
});
