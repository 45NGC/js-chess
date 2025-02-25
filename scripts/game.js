'use strict'

import { Pieces, PIECE_MAP } from "./pieces.js";

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
			[0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[5, 2, 3, 8, 7, 3, 2, 4],
		];

		// this.board = [
		// 	[0, -3, 0, 0, 0, 0, 0, 3],
		// 	[0, 0, 0, 0, -7, 0, 0, 0],
		// 	[0, 0, 0, 0, -4, 0, 0, 0],
		// 	[0, 0, 0, 0, 3, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 7, 0, 0],
		// 	[0, 4, 4, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, -4, 0, 0],
		// ];

		this.availableSquares = [];
		this.selectedPieceSquare = [];
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
			cell.innerHTML = '<div class="overlayYellow">';
		});

		for (let row = 0; row < this.board.length; row++) {
			for (let col = 0; col < this.board[row].length; col++) {
				const piece = this.board[row][col];
				if (piece !== 0) {
					const pieceImage = PIECE_MAP[piece.toString()] + `.png`;
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

		const clickedSquare = event.currentTarget;

		// check if the square is an available square
		if (this.availableSquares.includes(clickedSquare.id)) {

			// In case that the square is available we make the move
			const goToSquare = clickedSquare.id.match(/\d+/g).map(Number);
			this.movePiece(goToSquare);

		} else {
			this.availableSquares = [];
		}

		// hide active overlays and circles
		this.hideElements(`.circle`);
		this.hideElements(`.overlayRed`);

		document.querySelectorAll('.overlayYellow').forEach(overlay => {
			overlay.style.display = 'none';
		});

		// show an overlay over the targeted square
		const yellowSquareOverlay = clickedSquare.querySelector('.overlayYellow');

		if (yellowSquareOverlay) {
			yellowSquareOverlay.style.display = 'block';
		}

		// Check if the clicked square has a piece in it
		const squareImage = clickedSquare.querySelector('img');
		if (squareImage) {

			const pieces = new Pieces(this.turn);
			const squareImageId = squareImage.getAttribute('id');

			// Only calls 'getPieceAvailableMoves' if the selected piece is of the corresponding color
			// (if turn = 1 only white pieces can move and if turn = -1 only the black pieces can move)
			if (pieces.playerPieces.includes(pieces.getKeyByValue(PIECE_MAP, squareImageId))) {

				this.selectedPieceSquare = clickedSquare.id.match(/\d+/g).map(Number);
				const pieceAvailableMoves = pieces.getPieceAvailableMoves(this.board, squareImageId, this.selectedPieceSquare, false);

				this.showAvailableSquares(pieceAvailableMoves);
			}

		}
	}

	showAvailableSquares(coordinatesArray) {

		coordinatesArray.forEach(([row, col]) => {

			const cellId = `square-${row}-${col}`;
			const cell = document.getElementById(cellId);

			this.availableSquares.push(cellId);

			if (cell) {

				// delete all posible previous circles and squares
				cell.querySelectorAll('.circle').forEach(circle => circle.remove());
				cell.querySelectorAll('.overlayRed').forEach(overlayRed => overlayRed.remove());

				if (this.board[row][col] != 0) {
					this.addElementToCell(cell, 'overlayRed');
				} else {
					this.addElementToCell(cell, 'circle');
				}

			} else {
				console.warn(`square not found ID: ${cellId}`);
			}
		});
	}

	addElementToCell(cell, elementType) {
		const element = document.createElement('div');

		element.classList.add(elementType);
		cell.appendChild(element);
	}


	hideElements(selector) {
		const elements = document.querySelectorAll(selector);
		elements.forEach(element => element.remove());
	}


	getAllAvailableMoves(board, turn) {

	}

	movePiece(goToSquare) {
		// delete previous 'last move' mark
		this.hideElements('.lastMoveMark');

		const [pieceRow, pieceCol] = this.selectedPieceSquare;
		const [goToRow, goToCol] = goToSquare;

		this.board[goToRow][goToCol] = this.board[pieceRow][pieceCol];
		this.board[pieceRow][pieceCol] = 0;

		this.availableSquares = [];

		this.renderBoard();

		// Add 'last move' mark
		const goToCell = document.getElementById(`square-${goToRow}-${goToCol}`);
		const pieceCell = document.getElementById(`square-${pieceRow}-${pieceCol}`);

		if (goToCell) this.addElementToCell(goToCell, 'lastMoveMark');
		if (pieceCell) this.addElementToCell(pieceCell, 'lastMoveMark');

		this.switchTurn();
	}


	switchTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}
}
