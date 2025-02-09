'use strict'

export const PIECE_MAP = {
	'1': `w_pawn`,
	'2': `w_knight`,
	'3': `w_bishop`,
	'4': `w_rook`,
	'5': `w_rook`,
	'6': `w_rook`,
	'7': `w_king`,
	'8': `w_queen`,
	'-1': `b_pawn`,
	'-2': `b_knight`,
	'-3': `b_bishop`,
	'-4': `b_rook`,
	'-5': `b_rook`,
	'-6': `b_rook`,
	'-7': `b_king`,
	'-8': `b_queen`
};

export class Pieces {

	constructor(turn) {
		this.turn = turn;
		this.playerPieces = this.getPlayerPieces(turn);
		this.opponentPieces = this.getPlayerPieces(-turn);
	}

	kingMoves = [
		[0, 1], [1, 0], [-1, -1], [-1, 1],
		[-1, 0], [1, -1], [1, 1], [0, -1]
	];
	queenMoves = [
		[1, 1], [1, -1], [-1, 1], [-1, -1],
		[1, 0], [0, 1], [-1, 0], [0, -1]
	];
	rookMoves = [
		[1, 0], [0, 1], [-1, 0], [0, -1]
	];
	bishopMoves = [
		[1, 1], [1, -1], [-1, 1], [-1, -1]
	];
	knightMoves = [
		[2, 1], [2, -1], [-2, 1], [-2, -1],
		[1, 2], [1, -2], [-1, 2], [-1, -2]
	];

	getPieceAvailableMoves(board, piece, square, getAttackedSquares) {

		switch (piece) {

			// WHITE PIECES
			case `w_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(board, square);
				} else {
					return this.kingAvailableSquares(board, square);
				}

			case `w_queen`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `queen`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `queen`);
				}

			case `w_rook`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `rook`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `rook`);
				}

			case `w_bishop`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `bishop`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `bishop`);
				}

			case `w_knight`:
				if (getAttackedSquares) {
					return this.knightAttackedSquares(board, square);
				} else {
					return this.knightAvailableSquares(board, square);
				}


			case `w_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(board, square);
				} else {
					return this.pawnAvailableSquares(board, square);
				}

			// BLACK PIECES
			case `b_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(board, square);
				} else {
					return this.kingAvailableSquares(board, square);
				}

			case `b_queen`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `queen`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `queen`);
				}

			case `b_rook`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `rook`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `rook`);
				}

			case `b_bishop`:
				if (getAttackedSquares) {
					return this.queenRookBishopAttackedSquares(board, square, `bishop`);
				} else {
					return this.queenRookBishopAvailableSquares(board, square, `bishop`);
				}

			case `b_knight`:
				if (getAttackedSquares) {
					return this.knightAttackedSquares(board, square);
				} else {
					return this.knightAvailableSquares(board, square);
				}

			case `b_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(board, square);
				} else {
					return this.pawnAvailableSquares(board, square);
				}
		}

	}

	// PIECE METHODS :

	kingAvailableSquares(board, square) {

		const availableSquares = [];
		const [row, col] = square;

		for (const [rowMove, colMove] of this.kingMoves) {
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

		return availableSquares;
	}

	kingAttackedSquares(board, square) {

		const attackedSquares = [];

		for (const [rowMove, colMove] of this.kingMoves) {
			const targetRow = square[0] + rowMove;
			const targetCol = square[1] + colMove;

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

		for (const [rowMove, colMove] of this.knightMoves) {
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

		for (const [rowMove, colMove] of this.knightMoves) {
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

		const isInitialRow = (row === 1 && this.turn === -1) || (row === 6 && this.turn === 1);
		const forwardMove = row - this.turn;
		const doubleForwardMove = row - this.turn * 2;

		// First push
		if (isInitialRow && board[doubleForwardMove]?.[col] === 0 && board[forwardMove]?.[col] === 0) {
			addSquareIfValid(doubleForwardMove, col, true);
		}

		// Normal push
		addSquareIfValid(forwardMove, col, board[forwardMove]?.[col] === 0);

		// Capture
		[-1, 1].forEach(offset => {
			const targetCol = col + offset;
			addSquareIfValid(forwardMove, targetCol, this.opponentPieces.includes(board[forwardMove]?.[targetCol]));
		});

		return availableSquares;
	}

	pawnAttackedSquares(board, square) {

		const attackedSquares = [];

		for (const colMove of [-1, 1]) {
			const targetRow = square[0] + this.turn;
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

		switch (piece) {
			case `queen`:
				return this.queenMoves;
			case `rook`:
				return this.rookMoves;
			case `bishop`:
				return this.bishopMoves;
		}
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



	getOpponentAttackedSquares(board) {

		const opponentAttackedSquares = [];

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const posiblePiece = board[row][col];

				if (this.opponentPieces.includes(posiblePiece)) {

					opponentAttackedSquares.push(this.getPieceAvailableMoves(board, PIECE_MAP[posiblePiece.toString()], [row, col], true));

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
		return turn === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [-1, -2, -3, -4, -5, -6, -7, -8, -9];
	}

	// In case any move is made we delete the available en passant squares because they only last one turn
	deleteEnPassantSquares(board) {

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