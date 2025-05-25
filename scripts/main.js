'use strict';

import { Clock } from "./clock.js";
import { Game } from "./game.js";

let clock = null;
let game = null;

const screenElements = {
	startScreen: document.getElementById("start-screen"),
	gameContainer: document.getElementById("game-container"),
	timeOptionsScreen: document.getElementById("time-options-screen"),
	endGameMessage: document.getElementById("end-game-message"),
};

const buttons = {
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
	hideElement(screenElements.startScreen);
	hideElement(screenElements.gameContainer);
	showElement(screenElements.timeOptionsScreen);
}

function handleExit() {
	showFlex(screenElements.startScreen);
	hideElement(screenElements.gameContainer);
	hideElement(screenElements.endGameMessage);
	clock?.stopClocks();
}

function startGameWithTime(timeOptionButton) {
	const [minutes, increment] = timeOptionButton.dataset.time.split("|").map(Number);

	hideElement(screenElements.timeOptionsScreen);
	showElement(screenElements.gameContainer);

	clock = new Clock(minutes, increment);
	game = new Game(clock);
	game.startGame();
}

function init() {
	buttons.startButton.addEventListener("click", showTimeControlOptions);
	buttons.exitButton.addEventListener("click", handleExit);
	buttons.restartButton.addEventListener("click", () => game?.restartGame());
	buttons.goBackButton.addEventListener("click", () => game?.goBackPosition());
	buttons.rotateBoardButton.addEventListener("click", () => game?.rotateBoard());

	buttons.timeOptionButtons.forEach(timeOptionButton => {
		timeOptionButton.addEventListener("click", () => startGameWithTime(timeOptionButton));
	});
}

init();
