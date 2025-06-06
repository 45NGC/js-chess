'use strict';

import { MOVES, PIECE_MAP, EN_PASSANT_SQUARE } from "./constants.js";

export class Pieces {

	constructor(turn, rotatedBoard) {
		this.turn = turn;
		this.rotatedBoard = rotatedBoard;
		this.playerPieces = this.getPlayerPieces(turn);
		this.opponentPieces = this.getPlayerPieces(-turn);

		// Pawn logic:
		this.whitePawnInitialRow = rotatedBoard ? 1 : 6;
		this.blackPawnInitialRow = rotatedBoard ? 6 : 1;
		this.turnChanger = rotatedBoard ? -1 : 1;

		// Castling logic:
		this.rookColumnShort = rotatedBoard ? 0 : 7;
		this.rookColumnLong = rotatedBoard ? 7 : 0;

		this.shortCastlingSquaresToCheck = rotatedBoard
			? { square1: 2, square2: 1 }
			: { square1: 5, square2: 6 };

		this.longCastlingSquaresToCheck = rotatedBoard
			? { square1: 6, square2: 5, square3: 4 }
			: { square1: 1, square2: 2, square3: 3 };
	}

	//TODO: Refactor this function to have less parameters (create an object that contains squareImageId and square):
	// Object 				-> moveInfo{board, squareImageId, square, castlingRights, getAttackedSquares}
	// refactored function 	-> getPieceAvailableMoves(moveInfo)
	getPieceAvailableMoves(board, squareImageId, square, castlingRights, getAttackedSquares) {

		switch (squareImageId) {

			// WHITE PIECES
			case `white_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(board, square);
				} else {
					return this.kingAvailableSquares(board, square, castlingRights);
				}

			case `white_queen`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `queen`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `queen`);
				}

			case `white_rook`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `rook`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `rook`);
				}

			case `white_bishop`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `bishop`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `bishop`);
				}

			case `white_knight`:
				if (getAttackedSquares) {
					return this.knightAttackedSquares(board, square);
				} else {
					return this.knightAvailableSquares(board, square);
				}


			case `white_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(board, square);
				} else {
					return this.pawnAvailableSquares(board, square);
				}

			// BLACK PIECES
			case `black_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(board, square);
				} else {
					return this.kingAvailableSquares(board, square, castlingRights);
				}

			case `black_queen`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `queen`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `queen`);
				}

			case `black_rook`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `rook`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `rook`);
				}

			case `black_bishop`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `bishop`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `bishop`);
				}

			case `black_knight`:
				if (getAttackedSquares) {
					return this.knightAttackedSquares(board, square);
				} else {
					return this.knightAvailableSquares(board, square);
				}

			case `black_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(board, square);
				} else {
					return this.pawnAvailableSquares(board, square);
				}
		}

	}

	// PIECE METHODS :

	kingAvailableSquares(board, square, castlingRights) {

		const availableSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(`king`);

		// NORMAL MOVE
		for (const [rowMove, colMove] of pieceMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			const targetSquare = board[targetRow]?.[targetCol];

			if (targetSquare !== undefined && !this.isKingInCheckAfterMove(board, row, col, targetRow, targetCol)) {

				// if the square does not have one of players pieces and it is not under attack
				// it is available (it is 0 or an  undefended opponent piece)
				if (!this.playerPieces.includes(targetSquare)) {
					availableSquares.push([targetRow, targetCol]);
				}
			}
		}

		// CASTLING
		if (!this.isKingInCheck(board)) {
			const color = board[row][col] > 0 ? "white" : "black";

			if (castlingRights[color].short && board[row][this.rookColumnShort] === (color === "white" ? 4 : -4)) {
				if (
					board[row][this.shortCastlingSquaresToCheck.square1] === 0 &&
					board[row][this.shortCastlingSquaresToCheck.square2] === 0 &&
					!this.isKingInCheckAfterMove(board, row, col, row, this.shortCastlingSquaresToCheck.square1) &&
					!this.isKingInCheckAfterMove(board, row, col, row, this.shortCastlingSquaresToCheck.square2)
				) {
					availableSquares.push([row, this.shortCastlingSquaresToCheck.square2]);
				}
			}

			if (castlingRights[color].long && board[row][this.rookColumnLong] === (color === "white" ? 5 : -5)) {
				if (
					board[row][this.longCastlingSquaresToCheck.square1] === 0 &&
					board[row][this.longCastlingSquaresToCheck.square2] === 0 &&
					board[row][this.longCastlingSquaresToCheck.square3] === 0 &&
					!this.isKingInCheckAfterMove(board, row, col, row, this.longCastlingSquaresToCheck.square2) &&
					!this.isKingInCheckAfterMove(board, row, col, row, this.longCastlingSquaresToCheck.square3)
				) {
					availableSquares.push([row, this.longCastlingSquaresToCheck.square2]);
				}
			}

		}

		return availableSquares;
	}

	kingAttackedSquares(board, square) {

		const attackedSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(`king`);

		for (const [rowMove, colMove] of pieceMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			// in case that we only want the attacked squares we do not need 
			// to check if the target square is empty or if its has a piece in it
			if (board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	knightAvailableSquares(board, square) {

		const availableSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(`knight`);

		for (const [rowMove, colMove] of pieceMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			const targetSquare = board[targetRow]?.[targetCol];

			if (targetSquare !== undefined) {

				if (!this.playerPieces.includes(targetSquare)) {
					if (!this.isKingInCheckAfterMove(board, row, col, targetRow, targetCol)) {
						availableSquares.push([targetRow, targetCol]);
					}
				}
			}
		}

		return availableSquares;
	}

	knightAttackedSquares(board, square) {

		const attackedSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(`knight`);

		for (const [rowMove, colMove] of pieceMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			if (board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	pawnAvailableSquares(board, square) {

		const availableSquares = [];
		const [row, col] = square;

		// Helper function to check and add a square if it is valid
		const addSquareIfValid = (targetRow, targetCol, condition) => {
			if (board[targetRow]?.[targetCol] !== undefined && condition) {
				if (!this.isKingInCheckAfterMove(board, row, col, targetRow, targetCol)) {
					availableSquares.push([targetRow, targetCol]);
				}
			}
		};

		const isInitialRow = (row === this.blackPawnInitialRow && this.turn === -1) || (row === this.whitePawnInitialRow && this.turn === 1);
		const forwardMove = row - (this.turn * this.turnChanger);
		const doubleForwardMove = row - (this.turn * this.turnChanger) * 2;

		// First push
		if (isInitialRow && board[doubleForwardMove]?.[col] === 0 && board[forwardMove]?.[col] === 0) {
			addSquareIfValid(doubleForwardMove, col, true);
		}

		// Normal push
		addSquareIfValid(forwardMove, col, board[forwardMove]?.[col] === 0);

		// Capture
		[-1, 1].forEach(offset => {
			const targetCol = col + offset;
			addSquareIfValid(forwardMove, targetCol, this.opponentPieces.includes(board[forwardMove]?.[targetCol]) || board[forwardMove]?.[targetCol] == EN_PASSANT_SQUARE);
		});

		return availableSquares;
	}

	pawnAttackedSquares(board, square) {

		const attackedSquares = [];

		for (const colMove of [-1, 1]) {
			const targetRow = square[0] + (this.turn * this.turnChanger);
			const targetCol = square[1] + colMove;

			if (board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	queenRookBishopAvailableSquares(board, square, piece) {

		const availableSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(piece);

		for (let [rowMove, colMove] of pieceMoves) {
			let targetRow = row + rowMove;
			let targetCol = col + colMove;

			while (true) {
				const targetSquare = board[targetRow]?.[targetCol];

				// If the square is out of the board or contains one of the player pieces the loop stops
				if (targetSquare === undefined || this.playerPieces.includes(targetSquare)) {
					break;
				}

				// Check if the player king is under attack after the move
				if (!this.isKingInCheckAfterMove(board, row, col, targetRow, targetCol)) {
					availableSquares.push([targetRow, targetCol]);
				}

				// If the last square we added contains an opponent piece the loop stops
				if (this.opponentPieces.includes(targetSquare)) {
					break;
				}

				targetRow += rowMove;
				targetCol += colMove;
			}
		}

		return availableSquares;
	}

	queenRookBishopAttackedSquares(board, square, piece) {

		const attackedSquares = [];
		const [row, col] = square;
		const pieceMoves = this.selectMovement(piece);

		for (let [rowMove, colMove] of pieceMoves) {
			let targetRow = row + rowMove;
			let targetCol = col + colMove;

			while (true) {
				const targetSquare = board[targetRow]?.[targetCol];

				if (targetSquare === undefined) {
					break;
				}

				attackedSquares.push([targetRow, targetCol]);

				if (this.playerPieces.includes(targetSquare) || this.opponentPieces.includes(targetSquare)) {
					break;
				}

				targetRow += rowMove;
				targetCol += colMove;
			}
		}

		return attackedSquares;
	}

	selectMovement(piece) {
		return MOVES[piece];
	}



	// SUPPORT METHODS :

	getKingSquare(board) {

		const king = this.turn === 1 ? 7 : -7;

		for (let row = 0; row < board.length; row++) {

			for (let col = 0; col < board[row].length; col++) {

				if (board[row][col] === king) {
					return [row, col];
				}
			}
		}
	}

	isKingInCheckAfterMove(board, fromRow, fromCol, toRow, toCol) {
		const simulatedBoard = board.map(row => [...row]);

		// Make the move on the simulated board
		simulatedBoard[toRow][toCol] = simulatedBoard[fromRow][fromCol];
		simulatedBoard[fromRow][fromCol] = 0;


		const [kingRow, kingCol] = this.getKingSquare(simulatedBoard);
		const opponentAttackedSquares = this.getOpponentAttackedSquares(simulatedBoard);

		// If the king is under attack after the move it returns true
		return this.isSquareAttackedByOpponent(kingRow, kingCol, opponentAttackedSquares);
	}

	isKingInCheck(board) {

		const [kingRow, kingCol] = this.getKingSquare(board);
		const opponentAttackedSquares = this.getOpponentAttackedSquares(board);

		// If the king is under attack it returns true
		return this.isSquareAttackedByOpponent(kingRow, kingCol, opponentAttackedSquares);
	}



	getOpponentAttackedSquares(board) {

		const opponentAttackedSquares = [];

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const posiblePiece = board[row][col];

				if (this.opponentPieces.includes(posiblePiece) && posiblePiece !== EN_PASSANT_SQUARE) {

					opponentAttackedSquares.push(this.getPieceAvailableMoves(board, PIECE_MAP[posiblePiece.toString()], [row, col], undefined, true));

				}
			}
		}

		return opponentAttackedSquares;
	}

	isSquareAttackedByOpponent(row, col, opponentAttackedSquares) {
		return opponentAttackedSquares.some(attackedSquares =>
			attackedSquares.some(([attackedRow, attackedCol]) =>
				attackedRow === row && attackedCol === col
			)
		);
	}

	getPlayerPieces(turn) {
		return turn === 1 ? [1, 2, 3, 4, 5, 6, 7, 8] : [-1, -2, -3, -4, -5, -6, -7, -8];
	}

	// Retrieves the key corresponding to a given value in the provided map
	getKeyByValue(map, value) {
		for (const [key, val] of Object.entries(map)) {
			if (val === value) {
				return parseInt(key, 10);
			}
		}
		return null;
	}
}