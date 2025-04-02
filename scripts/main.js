import { Game } from "./game.js";

const game = new Game();

game.startGame();

document.getElementById("restart-button").addEventListener("click", () => {
    game.restartGame();
});
