import { Game } from "./game.js";

const game = new Game();

document.getElementById("restart").addEventListener("click", () => {
	game.startGame();
});

game.startGame();
