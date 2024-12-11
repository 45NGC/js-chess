export class Piece {
	constructor(name, color) {
		this.name = name;
		this.color = color; // "white" or "black"
	}

	isValidMove(start, end, board) {
		// General piece logic
		return false;
	}
}

export class Pawn extends Piece {
	constructor(color) {
		super("Pawn", color);
	}

	isValidMove(start, end, board) {
		// Pawn movement logic
		return true;
	}
}
