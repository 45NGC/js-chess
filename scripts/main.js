'use strict';

import { Clock } from "./clock.js";
import { Game } from "./game.js";

let clock = null;
let game = null;

const elements = {
	startScreen: document.getElementById("start-screen"),
	gameContainer: document.getElementById("game-container"),
	timeOptionsScreen: document.getElementById("time-options-screen"),
	endGameMessage: document.getElementById("end-game-message"),
	startButton: document.getElementById("start-button"),
	exitButton: document.getElementById("exit-button"),
	restartButton: document.getElementById("restart-button"),
	goBackButton: document.getElementById("go-back-button"),
	rotateBoardButton: document.getElementById("rotate-board-button"),
	timeOptionButtons: document.querySelectorAll(".time-option"),
};

function showElement(element) {
	element.style.display = "block";
}

function hideElement(element) {
	element.style.display = "none";
}

function showFlex(element) {
	element.style.display = "flex";
}

function showTimeControlOptions() {
	hideElement(elements.startScreen);
	hideElement(elements.gameContainer);
	showElement(elements.timeOptionsScreen);
}

function handleExit() {
	showFlex(elements.startScreen);
	hideElement(elements.gameContainer);
	hideElement(elements.endGameMessage);
	clock?.stopClocks();
}

function startGameWithTime(button) {
	const [minutes, increment] = button.dataset.time.split("|").map(Number);

	hideElement(elements.timeOptionsScreen);
	showElement(elements.gameContainer);

	clock = new Clock(minutes, increment);
	game = new Game(clock);
	game.startGame();
}

function init() {
	elements.startButton.addEventListener("click", showTimeControlOptions);
	elements.exitButton.addEventListener("click", handleExit);
	elements.restartButton.addEventListener("click", () => game?.restartGame());
	elements.goBackButton.addEventListener("click", () => game?.goBackPosition());
	elements.rotateBoardButton.addEventListener("click", () => game?.rotateBoard());

	elements.timeOptionButtons.forEach(button => {
		button.addEventListener("click", () => startGameWithTime(button));
	});
}

init();
