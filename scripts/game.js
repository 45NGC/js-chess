'use strict'

import { Pieces, PIECE_MAP, CASTLING_PIECES } from "./pieces.js";

const MOVE_SOUND = new Audio('assets/sound/move.mp3');
const CAPTURE_SOUND = new Audio('assets/sound/capture.mp3');


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
		// En passant squares   = 9
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

		// this.board = [
		// 	[-5, -2, -3, -8, -7, -3, -2, -4],
		// 	[-1, -1, -1, -1, -1, -1, -1, -1],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[1, 1, 1, 1, 1, 1, 1, 1],
		// 	[5, 2, 3, 8, 7, 3, 2, 4],
		// ];

		this.board = [
			[0, 0, 0, 0, 0, 0, 0, -7],
			[4, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 7, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 4, -1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		];

		this.availableSquares = [];
		this.selectedPieceSquare = [];

		this.castlingRights = {
			white: { short: true, long: true },
			black: { short: true, long: true }
		};
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
				if (piece !== 0 && piece !== 9) {
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
				const pieceAvailableMoves = pieces.getPieceAvailableMoves(this.board, squareImageId, this.selectedPieceSquare, this.castlingRights, false);

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
		const moves = [];

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const piece = board[row][col];

				if (piece !== 0 && Math.sign(piece) === turn) {
					const pieceType = PIECE_MAP[piece.toString()];
					const pieces = new Pieces(turn);

					if (pieceType) {
						const availableMoves = pieces.getPieceAvailableMoves(board, pieceType, [row, col], this.castlingRights, false);

						availableMoves.forEach(move => {
							moves.push({ from: [row, col], to: move });
						});
					}
				}
			}
		}

		return moves;
	}

	movePiece(goToSquare) {
		this.hideElements('.lastMoveMark');

		const [pieceRow, pieceCol] = this.selectedPieceSquare;
		const [goToRow, goToCol] = goToSquare;
		const piece = this.board[pieceRow][pieceCol];

		let moveType = this.determineMoveType(goToRow, goToCol);

		if (this.isCastling(piece, pieceCol, goToCol)) {
			this.performCastling(goToRow, goToCol, piece);
		}

		if (CASTLING_PIECES.includes(piece)) {
			this.checkCastlingRights(piece);
		}

		this.executeMove(pieceRow, pieceCol, goToRow, goToCol);
		this.markLastMove(pieceRow, pieceCol, goToRow, goToCol);
		this.handleEnPassant(pieceRow, goToRow, goToCol);

		// Check if the move is a pawn promotion
		if (Math.abs(piece) === 1 && (goToRow === 0 || goToRow === 7)) {
			this.promotePawn(goToRow, goToCol, piece, moveType);
			return;
		}

		moveType = this.getGameStateWithMoveType(moveType);
		this.makeMoveSound(moveType);
		this.switchTurn();
	}


	determineMoveType(goToRow, goToCol) {
		return this.board[goToRow][goToCol] !== 0 ? 1 : 0;
	}

	isCastling(piece, pieceCol, goToCol) {
		return (piece === 7 || piece === -7) && Math.abs(goToCol - pieceCol) === 2;
	}

	performCastling(goToRow, goToCol, piece) {
		if (goToCol === 6) {
			this.board[goToRow][5] = piece > 0 ? 4 : -4;
			this.board[goToRow][7] = 0;
		}
		if (goToCol === 2) {
			this.board[goToRow][3] = piece > 0 ? 4 : -4;
			this.board[goToRow][0] = 0;
		}
	}

	checkCastlingRights(movingPiece) {

		const pieceCol = this.selectedPieceSquare[1];

		// If the king moves we loose both castling rights
		if (movingPiece === 7) this.castlingRights.white = { short: false, long: false };
		if (movingPiece === -7) this.castlingRights.black = { short: false, long: false };

		// If the long rook moves we loose long castling
		if (movingPiece === 5 && pieceCol === 0) this.castlingRights.white.long = false;
		if (movingPiece === -5 && pieceCol === 0) this.castlingRights.black.long = false;

		// If the short rook moves we loose short castling
		if (movingPiece === 4 && pieceCol === 7) this.castlingRights.white.short = false;
		if (movingPiece === -4 && pieceCol === 7) this.castlingRights.black.short = false;

	}

	promotePawn(row, col, piece, moveType) {
		const color = piece > 0 ? "white" : "black";
		const choices = [
			{ name: "Queen", value: 8, img: `assets/pieces/${color}/${color}_queen.png` },
			{ name: "Rook", value: 6, img: `assets/pieces/${color}/${color}_rook.png` },
			{ name: "Bishop", value: 3, img: `assets/pieces/${color}/${color}_bishop.png` },
			{ name: "Knight", value: 2, img: `assets/pieces/${color}/${color}_knight.png` }
		];


		//TODO: Put the menu code in another file
		//TODO: Add animations to the menu options
		
		const existingMenu = document.getElementById("promotion-menu");
		if (existingMenu) {
			document.body.removeChild(existingMenu);
		}

		const promotionDiv = document.createElement("div");
		promotionDiv.id = "promotion-menu";
		promotionDiv.classList.add("promotion-menu");

		const headerDiv = document.createElement("div");
		headerDiv.classList.add("promotion-header");

		const cancelButton = document.createElement("button");
		cancelButton.innerText = "✖";
		cancelButton.classList.add("cancel-btn");
		cancelButton.onclick = () => {
			document.body.removeChild(promotionDiv);
			this.board[row][col] = 0;
			this.board[row-(-piece)][col] = piece > 0 ? 1 : -1;
			this.renderBoard();
		};

		headerDiv.appendChild(cancelButton);
		promotionDiv.appendChild(headerDiv);

		choices.forEach(choice => {
			const btn = document.createElement("button");
			btn.classList.add("promotion-option");

			const img = document.createElement("img");
			img.src = choice.img;
			img.alt = choice.name;
			img.classList.add("promotion-img");

			btn.appendChild(img);

			btn.onclick = () => {
				this.board[row][col] = piece > 0 ? choice.value : -choice.value;
				document.body.removeChild(promotionDiv);

				moveType = this.getGameStateWithMoveType(moveType);
				this.makeMoveSound(moveType);
				this.switchTurn();
				this.renderBoard();
			};

			promotionDiv.appendChild(btn);
		});

		document.body.appendChild(promotionDiv);
	}



	executeMove(pieceRow, pieceCol, goToRow, goToCol) {
		if (this.board[goToRow][goToCol] === 9) {
			this.board[pieceRow][goToCol] = 0;
		}
		this.board[goToRow][goToCol] = this.board[pieceRow][pieceCol];
		this.board[pieceRow][pieceCol] = 0;
		this.availableSquares = [];
		this.renderBoard();
	}

	markLastMove(pieceRow, pieceCol, goToRow, goToCol) {
		const goToCell = document.getElementById(`square-${goToRow}-${goToCol}`);
		const pieceCell = document.getElementById(`square-${pieceRow}-${pieceCol}`);
		if (goToCell) this.addElementToCell(goToCell, 'lastMoveMark');
		if (pieceCell) this.addElementToCell(pieceCell, 'lastMoveMark');
	}

	handleEnPassant(pieceRow, goToRow, goToCol) {
		this.deleteEnPassantSquares();
		if (Math.abs(this.board[goToRow][goToCol]) === 1 && Math.abs(goToRow - pieceRow) === 2) {
			const enPassantRow = (pieceRow + goToRow) / 2;
			this.board[enPassantRow][goToCol] = 9;
		}
	}

	deleteEnPassantSquares() {
		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board[i].length; j++) {
				if (this.board[i][j] === 9) {
					this.board[i][j] = 0;
				}
			}
		}
	}

	// Checks the state of the game and changes the moveType variable if necessary
	getGameStateWithMoveType(previousMoveType) {
		const moves = this.getAllAvailableMoves(this.board, this.turn * -1);
		const opponentPieces = new Pieces(this.turn * -1);
		const inCheck = opponentPieces.isKingInCheck(this.board);

		if (Object.keys(moves).length === 0) {
			if (inCheck) {
				return 3;
			} else {
				return 4;
			}
		}

		if (inCheck) return 2;

		return previousMoveType;
	}

	//TODO: Add check, mate and draw sounds
	makeMoveSound(moveType) {
		switch (moveType) {

			case 0:
				MOVE_SOUND.play();
				break;

			case 1:
				CAPTURE_SOUND.play();
				break;

			case 2:
				console.log(`CHECK SOUND`);
				break;

			case 3:
				console.log(`MATE SOUND`);
				break;

			case 4:
				console.log(`DRAW SOUND`);
				break;
		}

	}

	switchTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}
}
