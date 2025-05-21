'use strict';

import { Pieces } from "./pieces.js";
import { EN_PASSANT_SQUARE, END_TIME, MOVE_CAPTURE, MOVE_CHECK, MOVE_CHECKMATE, MOVE_DRAW, MOVE_NORMAL, PIECE_MAP, CASTLING_PIECES } from "./constants.js";
import { MOVE_SOUND, CAPTURE_SOUND, CHECK_SOUND, END_SOUND } from './sounds.js';

export class Game {
	constructor(minutes, increment) {
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
		// 	[0, 0, 0, 0, 0, 0, 0, -7],
		// 	[4, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 7, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 4, -1, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 0, 0, 0, 0],
		// ];

		this.positionHistory = {
			positions: [],
			turns: [],
			castlingRights: []
		};


		this.availableSquares = [];
		this.selectedPieceSquare = [];

		// While the user performs a promotion the rotate-board button must be disabled
		// because if the user presses the button while the promotion menu is active it
		// does not work how it should
		this.disableRotateBoardButton = false;

		this.disableGoBackPositionButton = false;

		this.rotatedBoard = false;

		this.castlingRights = {
			white: { short: true, long: true },
			black: { short: true, long: true }
		};

		this.timeControl = minutes;
		this.incrementTime = increment;
		this.blackTime = minutes * 60;
		this.whiteTime = minutes * 60;

		this.endGame = false;
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
		this.updateClocks();
		this.startClock();
	}

	renderBoard() {
		const cells = document.querySelectorAll(".cell");
		cells.forEach(cell => {
			cell.innerHTML = '<div class="overlayYellow">';
		});

		for (let row = 0; row < this.board.length; row++) {
			for (let col = 0; col < this.board[row].length; col++) {
				const piece = this.board[row][col];
				if (piece !== 0 && piece !== EN_PASSANT_SQUARE) {
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



	// CLOCK FUNCTIONS :
	startClock() {
		clearInterval(this.intervalId);

		this.intervalId = setInterval(() => {
			if (this.turn === 1) {
				if (this.whiteTime > 0) {
					this.whiteTime--;
				} else {
					clearInterval(this.intervalId);
					this.makeMoveSound(END_TIME);
					this.showEndGameMessage(END_TIME);
				}
			} else {
				if (this.blackTime > 0) {
					this.blackTime--;
				} else {
					clearInterval(this.intervalId);
					this.makeMoveSound(END_TIME);
					this.showEndGameMessage(END_TIME);
				}
			}
			this.updateClocks();
		}, 1000);
	}

	updateClocks() {
		document.getElementById('black-clock').textContent = this.formatTime(this.blackTime);
		document.getElementById('white-clock').textContent = this.formatTime(this.whiteTime);
	}

	stopClocks() {
		clearInterval(this.intervalId);
	}

	rotateClocks(setInitialPosition = false) {
		const clockContainer = document.querySelector('.chess-clock');
		const whiteClock = document.getElementById('white-clock');
		const blackClock = document.getElementById('black-clock');

		if (whiteClock && blackClock && clockContainer) {

			if (setInitialPosition) {
				clockContainer.insertBefore(blackClock, whiteClock);
			} else {

				if (clockContainer.firstElementChild === blackClock) {
					clockContainer.insertBefore(whiteClock, blackClock);
				} else {
					clockContainer.insertBefore(blackClock, whiteClock);
				}
			}
		}
	}

	addIncrementTime() {
		if (this.turn === 1) {
			this.whiteTime += this.incrementTime;
		} else {
			this.blackTime += this.incrementTime;
		}
	}

	formatTime(seconds) {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	}



	// BUTTON FUNCTIONS :
	restartGame() {
		console.log(`CHESS GAME RESETED`);

		this.hideEndGameMessage();

		// In case the promotion menu is active when the user presses
		// the restar-button we must close it
		this.closePawnPromotionMenu();

		this.rotateClocks(true);

		this.turn = 1;

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

		this.positionHistory = {
			positions: [],
			turns: [],
			castlingRights: []
		};

		this.availableSquares = [];
		this.selectedPieceSquare = [];
		this.disableRotateBoardButton = false;
		this.disableGoBackPositionButton = false;
		this.rotatedBoard = false;

		this.castlingRights = {
			white: { short: true, long: true },
			black: { short: true, long: true }
		};

		this.blackTime = this.timeControl * 60;
		this.whiteTime = this.timeControl * 60;
		this.intervalId;

		this.endGame = false;

		this.updateClocks();
		this.startClock();
		this.renderBoard();
	}

	goBackPosition() {
		if (!this.disableGoBackPositionButton) {

			// In case the promotion menu is active when the user presses
			// the go-back-button we must close it
			this.closePawnPromotionMenu();

			this.hideEndGameMessage();

			const lastIndex = this.positionHistory.positions.length - 1;

			if (lastIndex < 0) {
				console.warn("YOU CAN NOT UNDO MORE MOVES");
			} else {
				const lastState = this.getPreviousPosition();
				this.board = lastState.board.map(row => [...row]);
				this.turn = lastState.turn;
				this.castlingRights = lastState.castlingRights;
				this.renderBoard();
			}
		}
	}

	rotateBoard() {

		if (!this.disableRotateBoardButton) {

			console.log("BOARD ROTATED");

			const size = this.board.length;
			const rotateBoardMatrix = (matrix) => {
				const newMatrix = [];
				for (let row = 0; row < size; row++) {
					newMatrix[row] = [];
					for (let col = 0; col < size; col++) {
						newMatrix[row][col] = matrix[size - 1 - row][size - 1 - col];
					}
				}
				return newMatrix;
			};

			this.board = rotateBoardMatrix(this.board);

			// Rotate all positions of the positionHistory object:
			this.positionHistory.positions = this.positionHistory.positions.map(pos => rotateBoardMatrix(pos));

			this.rotateClocks();
			this.rotatedBoard = !this.rotatedBoard;
			this.renderBoard();

		} else {
			console.log("CAN NOT USE THIS BUTTON WHILE A PAWN PROMOTION IS IN PROCESS");
		}
	}

	getPreviousPosition() {

		// only to allow one retreat:
		// return this.positionHistory.positions[this.positionHistory.positions.length - 1];

		const board = this.positionHistory.positions.pop();
		const turn = this.positionHistory.turns.pop();
		const castlingRights = this.positionHistory.castlingRights.pop();

		return { board, turn, castlingRights };
	}



	// MOUSE FUNCTIONS :
	handleMouseOver(event) {
		const squareId = event.currentTarget.id;
		//console.log(`Square ID: ${squareId}`);
	}

	handleMouseClick(event) {

		if (!this.endGame) {

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

				const pieces = new Pieces(this.turn, this.rotatedBoard);
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
	}



	// GAME FUNCTIONS :
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
					const pieces = new Pieces(turn, this.rotatedBoard);

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

		this.positionHistory.positions.push(this.board.map(row => [...row]));
		this.positionHistory.turns.push(this.turn);

		// Save a copy of the current castling rights to the history, so future
		// changes to 'castlingRights' do not affect previously stored data
		this.positionHistory.castlingRights.push({ ...this.castlingRights });

		this.hideElements('.lastMoveMark');

		const [pieceRow, pieceCol] = this.selectedPieceSquare;
		const [goToRow, goToCol] = goToSquare;
		const piece = this.board[pieceRow][pieceCol];
		const goToSquareValue = this.board[goToRow][goToCol];

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
			this.promotePawn(goToRow, goToCol, pieceRow, pieceCol, goToSquareValue, piece, moveType);
			return;
		}

		moveType = this.getGameStateWithMoveType(moveType);
		this.makeMoveSound(moveType);

		// End game control:
		if (moveType === MOVE_CHECKMATE || moveType === MOVE_DRAW) {
			this.showEndGameMessage(moveType)
		}
		this.addIncrementTime();
		this.switchTurn();
	}

	// Determines if the move is a capture
	determineMoveType(goToRow, goToCol) {
		return this.board[goToRow][goToCol] !== 0 ? 1 : 0;
	}

	isCastling(piece, pieceCol, goToCol) {
		return (piece === 7 || piece === -7) && Math.abs(goToCol - pieceCol) === 2;
	}

	performCastling(goToRow, goToCol, piece) {
		const rookValue = piece > 0 ? 4 : -4;

		const castlingMoves = this.rotatedBoard
			? {
				1: { rookColFrom: 0, rookColTo: 2 }, // SHORT
				5: { rookColFrom: 7, rookColTo: 4 }  // LONG
			}
			: {
				6: { rookColFrom: 7, rookColTo: 5 }, // SHORT
				2: { rookColFrom: 0, rookColTo: 3 }  // LONG
			};

		const move = castlingMoves[goToCol];
		if (move) {
			this.board[goToRow][move.rookColTo] = rookValue;
			this.board[goToRow][move.rookColFrom] = 0;
		}
	}

	checkCastlingRights(movingPiece) {

		// If the king moves we loose both castling rights
		if (movingPiece === 7) this.castlingRights.white = { short: false, long: false };
		if (movingPiece === -7) this.castlingRights.black = { short: false, long: false };

		// If the long rook moves we loose long castling
		if (movingPiece === 5) this.castlingRights.white.long = false;
		if (movingPiece === -5) this.castlingRights.black.long = false;

		// If the short rook moves we loose short castling
		if (movingPiece === 4) this.castlingRights.white.short = false;
		if (movingPiece === -4) this.castlingRights.black.short = false;

	}

	promotePawn(goToRow, goToCol, previousRow, previousCol, goToSquareValue, piece, moveType) {
		const color = piece > 0 ? "white" : "black";
		const choices = [
			{ name: "Queen", value: 8, img: `assets/pieces/${color}/${color}_queen.png` },
			{ name: "Rook", value: 6, img: `assets/pieces/${color}/${color}_rook.png` },
			{ name: "Bishop", value: 3, img: `assets/pieces/${color}/${color}_bishop.png` },
			{ name: "Knight", value: 2, img: `assets/pieces/${color}/${color}_knight.png` }
		];

		this.disableRotateBoardButton = true;

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

		cancelButton.onmouseover = () => cancelButton.classList.add("hover");
		cancelButton.onmouseout = () => cancelButton.classList.remove("hover");

		cancelButton.onclick = () => {
			document.body.removeChild(promotionDiv);
			this.board[goToRow][goToCol] = goToSquareValue;
			this.board[previousRow][previousCol] = piece > 0 ? 1 : -1;
			this.disableRotateBoardButton = false;

			// Take the position of the position history:
			this.positionHistory.positions.pop();
			this.positionHistory.turns.pop();
			this.positionHistory.castlingRights.pop();
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

			btn.onmouseover = () => btn.classList.add("hover");
			btn.onmouseout = () => btn.classList.remove("hover");

			btn.onclick = () => {
				this.board[goToRow][goToCol] = piece > 0 ? choice.value : -choice.value;
				document.body.removeChild(promotionDiv);

				moveType = this.getGameStateWithMoveType(moveType);
				this.makeMoveSound(moveType);

				// End game control:
				if (moveType === MOVE_CHECKMATE || moveType === MOVE_DRAW) {
					this.showEndGameMessage(moveType)
				}

				this.disableRotateBoardButton = false;
				this.switchTurn();
				this.renderBoard();
			};

			promotionDiv.appendChild(btn);
		});

		document.body.appendChild(promotionDiv);
	}

	closePawnPromotionMenu() {
		const promotionMenu = document.getElementById("promotion-menu");
		if (promotionMenu) {
			document.body.removeChild(promotionMenu);
		}
	}

	executeMove(pieceRow, pieceCol, goToRow, goToCol) {
		if (this.board[goToRow][goToCol] === EN_PASSANT_SQUARE) {
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
			this.board[enPassantRow][goToCol] = EN_PASSANT_SQUARE;
		}
	}

	deleteEnPassantSquares() {
		for (let i = 0; i < this.board.length; i++) {
			for (let j = 0; j < this.board[i].length; j++) {
				if (this.board[i][j] === EN_PASSANT_SQUARE) {
					this.board[i][j] = 0;
				}
			}
		}
	}

	// Checks the state of the game and changes the moveType variable if necessary
	getGameStateWithMoveType(previousMoveType) {
		const moves = this.getAllAvailableMoves(this.board, this.turn * -1);
		const opponentPieces = new Pieces(this.turn * -1, this.rotatedBoard);
		const inCheck = opponentPieces.isKingInCheck(this.board);

		if (Object.keys(moves).length === 0) {
			if (inCheck) {
				return MOVE_CHECKMATE;
			} else {
				return MOVE_DRAW;
			}
		}

		if (inCheck) return MOVE_CHECK;

		return previousMoveType;
	}

	makeMoveSound(moveType) {

		switch (moveType) {
			case MOVE_NORMAL:
				MOVE_SOUND.play();
				break;

			case MOVE_CAPTURE:
				CAPTURE_SOUND.play();
				break;

			case MOVE_CHECK:
				CHECK_SOUND.play();
				break;

			case MOVE_CHECKMATE:
			case MOVE_DRAW:
			case END_TIME:
				END_SOUND.play();
				break;
		}
	}

	hideEndGameMessage() {
		const endGameMessage = document.getElementById('end-game-message');
		endGameMessage.classList.add('hidden')
	}

	showEndGameMessage(moveType) {
		this.endGame = true;
		this.disableGoBackPositionButton = true;
		const endGameMessage = document.getElementById('end-game-message');
		this.stopClocks();

		switch (moveType) {
			case MOVE_CHECKMATE:
				endGameMessage.textContent = this.turn === 1 ? `WHITE WON` : `BLACK WON`;
				break;
			case MOVE_DRAW:
				endGameMessage.textContent = `DRAW`;
				break;
			case END_TIME:
				endGameMessage.textContent = this.turn === 1 ? `BLACK WON` : `WHITE WON`;
				break;
		}

		endGameMessage.classList.remove('hidden');
	}

	switchTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}

}
