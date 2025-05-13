import { Game } from "./game.js";


document.getElementById("start-button").addEventListener("click", () => {
	showTimeControlOptions();
});

document.getElementById("exit-button").addEventListener("click", () => {
	document.getElementById("start-screen").style.display = "flex";
	document.getElementById("game-container").style.display = "none";
	document.getElementById('end-game-message').style.display = "none";

	window.game?.stopClocks();
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

document.querySelectorAll(".time-option").forEach(button => {
	button.addEventListener("click", () => {
		const [minutes, increment] = button.dataset.time.split("|").map(Number);
		
		document.getElementById("time-options-screen").style.display = "none";
		document.getElementById("game-container").style.display = "block";

		window.game = new Game(minutes, increment);
		window.game.startGame();
	});
});


function showTimeControlOptions(){
	document.getElementById("start-screen").style.display = "none";
	document.getElementById("game-container").style.display = "none";
	document.getElementById("time-options-screen").style.display = "block";
}
