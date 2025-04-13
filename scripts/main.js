import { Game } from "./game.js";

const game = new Game();

game.startGame();

document.getElementById("restart-button").addEventListener("click", () => {
    game.restartGame();
});

document.getElementById("go-back-button").addEventListener("click", () => {
    game.goBackPosition();
});

document.getElementById("rotate-board-button").addEventListener("click", () => {
    game.rotateBoard();
});
