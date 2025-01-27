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

	constructor(board, turn) {
		this.board = board;
		this.turn = turn;
		this.playerPieces = this.getPlayerPieces(turn);
		this.opponentPieces = this.getPlayerPieces(-turn);
	}

	kingMoves = [
		[0, 1], [1, 0], [-1, -1], [-1, 1],
		[-1, 0], [1, -1], [1, 1], [0, -1]
	];
	knightMoves = [
		[2, 1], [2, -1], [-2, 1], [-2, -1],
		[1, 2], [1, -2], [-1, 2], [-1, -2]
	];

	getPieceAvailableMoves(piece, square, getAttackedSquares) {

		switch (piece) {

			// WHITE PIECES
			case `w_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(square);
				} else {
					return this.kingAvailableSquares(square);
				}

			case `w_queen`:
				return this.queenAvailableSquares(square);

			case `w_rook`:
				return this.rookAvailableSquares(square);

			case `w_bishop`:
				return this.bishopAvailableSquares(square);

			case `w_knight`:
				if (getAttackedSquares) {
					return this.pawnAvailableSquares(square);
				} else {
					return this.knightAvailableSquares(square);
				}


			case `w_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(square);
				} else {
					return this.pawnAvailableSquares(square);
				}

			// BLACK PIECES
			case `b_king`:
				if (getAttackedSquares) {
					return this.kingAttackedSquares(square);
				} else {
					return this.kingAvailableSquares(square);
				}

			case `b_queen`:
				return this.queenAvailableSquares(square);

			case `b_rook`:
				return this.rookAvailableSquares(square);

			case `b_bishop`:
				return this.bishopAvailableSquares(square);

			case `b_knight`:
				return this.knightAvailableSquares(square);

			case `b_pawn`:
				if (getAttackedSquares) {
					return this.pawnAttackedSquares(square);
				} else {
					return this.pawnAvailableSquares(square);
				}
		}

	}

	// PIECE METHODS :

	kingAvailableSquares(square) {

		const availableSquares = [];
		const opponentAttackedSquares = this.getOpponentAttackedSquares(this.board);

		for (const [rowMove, colMove] of this.kingMoves) {
			const targetRow = square[0] + rowMove;
			const targetCol = square[1] + colMove;

			const targetSquare = this.board[targetRow]?.[targetCol];

			if (targetSquare !== undefined && !this.isSquareAttackedByOpponent(targetRow, targetCol, opponentAttackedSquares)) {

				// if the square does not have one of players pieces and it is not under attack
				// it is available (it is 0 or an  undefended opponent piece)
				if (!this.playerPieces.includes(targetSquare)) {
					availableSquares.push([targetRow, targetCol]);
				}
			}
		}

		return availableSquares;
	}

	kingAttackedSquares(square) {

		const attackedSquares = [];

		for (const [rowMove, colMove] of this.kingMoves) {
			const targetRow = square[0] + rowMove;
			const targetCol = square[1] + colMove;

			// in case that we only want the attacked squares we do not need 
			// to check if the target square is empty or if its has a piece in it
			if (this.board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	rookAvailableSquares(square) {
		//console.log(`Rook squares`);
		return [];
	}

	bishopAvailableSquares(square) {
		//console.log(`Bishop squares`);
		return [];
	}

	knightAvailableSquares(square) {

		const availableSquares = [];
		const [row, col] = square;

		for (const [rowMove, colMove] of this.knightMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			const targetSquare = this.board[targetRow]?.[targetCol];

			if (targetSquare !== undefined) {

				if (!this.playerPieces.includes(targetSquare)) {
					availableSquares.push([targetRow, targetCol]);
				}
			}
		}

		return availableSquares;
	}

	knightAttackedSquares(square) {

		const attackedSquares = [];
		const [row, col] = square;

		for (const [rowMove, colMove] of this.knightMoves) {
			const targetRow = row + rowMove;
			const targetCol = col + colMove;

			if (this.board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;

	}

	pawnAvailableSquares(square) {
		const availableSquares = [];
		const [row, col] = square;

		// Helper function to check and add a square if it is valid
		const addSquareIfValid = (targetRow, targetCol, condition) => {
			if (this.board[targetRow]?.[targetCol] !== undefined && condition) {
				availableSquares.push([targetRow, targetCol]);
			}
		};

		const isInitialRow = (row === 1 && this.turn === -1) || (row === 6 && this.turn === 1);
		const forwardMove = row - this.turn;
		const doubleForwardMove = row - this.turn * 2;

		// First push
		if (isInitialRow && this.board[doubleForwardMove]?.[col] === 0) {
			addSquareIfValid(doubleForwardMove, col, true);
		}

		// Normal push
		addSquareIfValid(forwardMove, col, this.board[forwardMove]?.[col] === 0);

		// Capture
		[-1, 1].forEach(offset => {
			const targetCol = col + offset;
			addSquareIfValid(forwardMove, targetCol, this.opponentPieces.includes(this.board[forwardMove]?.[targetCol]));
		});

		return availableSquares;
	}

	pawnAttackedSquares(square) {
		const attackedSquares = [];

		for (const colMove of [-1, 1]) {
			const targetRow = square[0] + this.turn;
			const targetCol = square[1] + colMove;

			if (this.board[targetRow]?.[targetCol] !== undefined) {
				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	queenAvailableSquares(square) {
		//console.log(`Queen squares`);
		return [];
	}




	// SUPPORT METHODS :

	getKingSquare(board, turn) {

		const king = turn === 1 ? 7 : -7;

		for (let row = 0; row < board.length; row++) {

			for (let col = 0; col < board[row].length; col++) {

				if (board[row][col] === king) {
					return [row, col];
				}
			}
		}
	}

	isKingOnCheck(board, turn) {

	}

	getOpponentAttackedSquares(board) {

		const opponentAttackedSquares = [];

		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				const posiblePiece = board[row][col];

				if (this.opponentPieces.includes(posiblePiece)) {

					opponentAttackedSquares.push(this.getPieceAvailableMoves(PIECE_MAP[posiblePiece.toString()], [row, col], true));

				}
			}
		}
		console.log(opponentAttackedSquares);
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