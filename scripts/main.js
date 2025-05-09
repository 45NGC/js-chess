import { Game } from "./game.js";


document.getElementById("start-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "none";
	document.getElementById("game-container").style.display = "block";
	
	//TODO: add multiple time control options for the user to choose
	// Example:
	// const time = showTimeControlOptions()
	// window.game = new Game(time[0], time[1])
	window.game = new Game(5, 10)
	window.game.startGame();
});

document.getElementById("exit-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "flex";
	document.getElementById("game-container").style.display = "none";

	window.game?.restartGame();
});

document.getElementById("restart-button").addEventListener("click", () => {
    window.game?.restartGame();
});

document.getElementById("go-back-button").addEventListener("click", () => {
    window.game?.goBackPosition();
});

document.getElementById("rotate-board-button").addEventListener("click", () => {
    window.game?.rotateBoard();
});
