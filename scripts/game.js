'use strict'

import { Pieces } from "./pieces.js";

const PIECE_MAP = {
	'1': `w_pawn.png`,
	'2': `w_knight.png`,
	'3': `w_bishop.png`,
	'4': `w_rook.png`,
	'5': `w_rook.png`,
	'6': `w_rook.png`,
	'7': `w_king.png`,
	'8': `w_queen.png`,
	'-1': `b_pawn.png`,
	'-2': `b_knight.png`,
	'-3': `b_bishop.png`,
	'-4': `b_rook.png`,
	'-5': `b_rook.png`,
	'-6': `b_rook.png`,
	'-7': `b_king.png`,
	'-8': `b_queen.png`
};

export class Game {
	constructor() {
		this.turn = 1;

		// PIECES :
		// Pawn 				= 1 / -1
		// Knight 				= 2 / -2
		// Bishop 				= 3 / -3
		// Rook 				= 4 / -4	5 / -5	(short-castle	long-castle)  6/-6 (promoted rook)
		// King 				= 7 / -7
		// Queen				= 8 / -8
		// En passant squares   = 9 / -9
		//
		// Example of board after a pawn push :
		//
		// 	[-5, -2, -3, -8, -7, -3, -2, -4],
		// 	[-1, -1, -1, -1, -1, -1, -1, -1],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 1, 0, 0],
		// 	[0, 0, 0, 0, 0, 9, 0, 0],
		// 	[1, 1, 1, 1, 1, 0, 1, 1],
		// 	[5, 2, 3, 8, 7, 3, 2, 4],

		this.board = [
			[-5, -2, -3, -8, -7, -3, -2, -4],
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0],
			[1, 1, 1, 1, 0, 1, 1, 1],
			[5, 2, 3, 0, 7, 0, 2, 4],
		];
	}

	startGame() {
		console.log(`CHESS GAME STARTED`);
		const divs = document.querySelectorAll('.cell');

		// Add the events to all the board squares
		divs.forEach(div => {
			div.addEventListener('mouseover', this.handleMouseOver.bind(this));
			div.addEventListener('click', this.handleMouseClick.bind(this));
		});

		this.renderBoard();
	}

	renderBoard() {
		const cells = document.querySelectorAll(".cell");
		cells.forEach(cell => {
			cell.innerHTML = '<div class="overlay"></div>';
		});

		for (let row = 0; row < this.board.length; row++) {
			for (let col = 0; col < this.board[row].length; col++) {
				const piece = this.board[row][col];
				if (piece !== 0) {
					const pieceImage = PIECE_MAP[piece.toString()];
					const cellId = `square-${row}-${col}`;
					const cell = document.getElementById(cellId);

					if (cell) {
						const img = document.createElement("img");
						img.src = `assets/pieces/${piece > 0 ? "white" : "black"}/${pieceImage}`;
						img.alt = `Piece: ${piece}`;
						img.id = `${pieceImage.slice(0, -4)}`;
						cell.appendChild(img);
					}
				}
			}
		}
	}

	handleMouseOver(event) {
		const squareId = event.currentTarget.id;
		//console.log(`Square ID: ${squareId}`);
	}

	handleMouseClick(event) {

		// hide active overlays and circles

		this.hideElements(`.circle`);
		this.hideElements(`.overlay`);

		// show an overlay over the targeted square
		const clickedSquare = event.currentTarget;
		const squareOverlay = clickedSquare.querySelector('.overlay');

		if (squareOverlay) {
			squareOverlay.style.display = 'block';
		}

		// Check if the clicked square has a piece in it
		const squareImage = clickedSquare.querySelector('img');
		if (squareImage) {

			const squareImageId = squareImage.getAttribute('id');
			const pieceAvailableMoves = this.getPieceAvailableMoves(squareImageId, false);
			// const pieceAttackedSquares = this.getPieceAvailableMoves(squareImageId, true);
			// console.log(`Piece available moves :`);
			console.log(pieceAvailableMoves);
			// console.log(`Piece attacked squares :`);
			// console.log(pieceAttackedSquares);

			this.showAvailableSquares(pieceAvailableMoves);

		}
	}

	showAvailableSquares(coordinatesArray) {

		coordinatesArray.forEach(([row, col]) => {

			const cellId = `square-${row}-${col}`;
			const cell = document.getElementById(cellId);

			if (cell) {

				// delete all posible previous circles
				cell.querySelectorAll('.circle').forEach(circle => circle.remove());

				const circle = document.createElement('div');
				circle.classList.add('circle');

				cell.appendChild(circle);

			} else {
				console.warn(`square not found ID: ${cellId}`);
			}
		});
	}

	hideElements(selector) {

		const elements = document.querySelectorAll(selector);

		elements.forEach(element => {
			element.style.display = 'none';
		});
	}


	getPieceAvailableMoves(piece, getAttackedSquares) {

		const pieces = new Pieces(this.turn, this.board);

		if (this.turn === 1) {
			switch (piece) {

				// WHITE PIECES
				case `w_king`:
					return pieces.kingAvailableSquares(getAttackedSquares);

				case `w_queen`:
					return pieces.queenAvailableSquares(getAttackedSquares);

				case `w_rook`:
					return pieces.rookAvailableSquares(getAttackedSquares);

				case `w_bishop`:
					return pieces.bishopAvailableSquares(getAttackedSquares);

				case `w_knight`:
					return pieces.knightAvailableSquares(getAttackedSquares);

				case `w_pawn`:
					return pieces.pawnAvailableSquares(getAttackedSquares);
			}

		} else {
			switch (piece) {

				// BLACK PIECES
				case `b_king`:
					return pieces.kingAvailableSquares(getAttackedSquares);

				case `b_queen`:
					return pieces.queenAvailableSquares(getAttackedSquares);

				case `b_rook`:
					return pieces.rookAvailableSquares(getAttackedSquares);

				case `b_bishop`:
					return pieces.bishopAvailableSquares(getAttackedSquares);

				case `b_knight`:
					return pieces.knightAvailableSquares(getAttackedSquares);

				case `b_pawn`:
					return pieces.pawnAvailableSquares(getAttackedSquares);
			}
		}

	}

	getAllAvailableMoves(board, turn) {

	}

	switchTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}
}
