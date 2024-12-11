
export class Game {
	constructor() {
		this.board = [];
		this.pieces = [];
		this.turn = "white";
	}

	startGame() {
		// Add initial pieces
		// 
		this.board = [];
	}

	handleMove(start, end) {

	}

	switchTurn() {
		this.turn = this.turn === "white" ? "black" : "white";
	}
}
