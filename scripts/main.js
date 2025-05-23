'use strict';

import { Clock } from "./clock.js";
import { Game } from "./game.js";

let clock = null;
let game = null;

document.getElementById("start-button").addEventListener("click", () => {
	showTimeControlOptions();
});

document.getElementById("exit-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "flex";
	document.getElementById("game-container").style.display = "none";
	document.getElementById('end-game-message').style.display = "none";

	clock.stopClocks();
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

document.querySelectorAll(".time-option").forEach(button => {
	button.addEventListener("click", () => {
		const [minutes, increment] = button.dataset.time.split("|").map(Number);
		
		document.getElementById("time-options-screen").style.display = "none";
		document.getElementById("game-container").style.display = "block";

		clock = new Clock(minutes, increment);

		game = new Game(clock);
		game.startGame();
	});
});


function showTimeControlOptions(){
	document.getElementById("start-screen").style.display = "none";
	document.getElementById("game-container").style.display = "none";
	document.getElementById("time-options-screen").style.display = "block";
}
