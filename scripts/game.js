export class Game {
	constructor() {
		this.board = [];
		this.pieces = [];
		this.turn = "white";
	}

	// Shows a transparent yellow square over the square the curor is in
	handleMouseOver(event) {
		const overlay = event.target.querySelector('.overlay');
		if (overlay) {
			overlay.style.display = 'block';

			const squareId = event.currentTarget.id;
			console.log(`Square ID: ${squareId}`);
		}
	}

	// Once the cursor is not in the square, the transparent square disappears
	handleMouseOut(event) {
		const overlay = event.target.querySelector('.overlay');
		if (overlay) {
			overlay.style.display = 'none';
		}
	}

	startGame() {
		console.log(`CHESS GAME STARTED`);
		const divs = document.querySelectorAll('.cell');

		// Add the events to all the board squares
		divs.forEach(div => {
			div.addEventListener('mouseover', this.handleMouseOver.bind(this));
			div.addEventListener('mouseout', this.handleMouseOut.bind(this));
		});
	}

	handleMove(start, end) {

	}

	switchTurn() {
		this.turn = this.turn === "white" ? "black" : "white";
	}
}
