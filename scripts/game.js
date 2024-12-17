export class Game {
	constructor() {
		this.turn = 1;
	}

	handleMouseOver(event) {
		const squareId = event.currentTarget.id;
		//console.log(`Square ID: ${squareId}`);
	}

	handleMouseClick(event) {
		const squareId = event.currentTarget.id;
		const square = document.getElementById(squareId)
		const squareImage = square.getElementsByTagName('img')

		console.log(`Square ID: ${squareId}`);

		// Check if the clicked square has a piece in it
		if (squareImage.length > 0) {

			console.log(`There is a piece in this square`);

			const squareImageId = squareImage[0].getAttribute('id');

			const availableMoves = this.getAvailableMoves(squareImageId);
			console.log(availableMoves);
		}
	}

	startGame() {
		console.log(`CHESS GAME STARTED`);
		const divs = document.querySelectorAll('.cell');

		// Add the events to all the board squares
		divs.forEach(div => {
			div.addEventListener('mouseover', this.handleMouseOver.bind(this));
			div.addEventListener('click', this.handleMouseClick.bind(this));
		});
	}

	getAvailableMoves(piece) {
		switch (piece) {

			case `w-king`:
				console.log(`White king available moves :`);
				break;


			case `b-king`:
				console.log(`Black king available moves :`);
				break;

		}

	}

	switchTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}
}
