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
		//this.opponentAttackedSquares = this.getOpponentAttackedSquares(board, turn);
		//this.kingSquare = this.getKingSquare(board, turn);
	}

	// availableSquares = [];
	// attackedSquares = [];

	kingMoves = [[1, 0], [1, -1], [1, 1], [0, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];

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
				return this.knightAvailableSquares(square);

			case `w_pawn`:
				return this.pawnAvailableSquares(square);

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
				return this.pawnAvailableSquares(square);

		}

	}

	// PIECE METHODS :

	kingAvailableSquares(square) {

		const availableSquares = [];

		const opponentAttackedSquares = this.getOpponentAttackedSquares(this.board);

		for (const [rowMove, colMove] of this.kingMoves) {
			const targetRow = square[0] + rowMove;
			const targetCol = square[1] + colMove;

			if (this.squareIsWithinBoard(targetRow, targetCol)) {
				const targetSquare = this.board[targetRow][targetCol];

				if (!opponentAttackedSquares.includes(targetSquare)) {

					// if the square does not have one of players pieces and it is not under attack
					// it is available (it is 0 or an  undefended opponent piece)
					if (!this.playerPieces.includes(targetSquare)) {
						availableSquares.push([targetRow, targetCol]);
					}
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

			if (this.squareIsWithinBoard(targetRow, targetCol)) {
				// in case that we only want the attacked squares we do not need 
				// to check if the target square is empty or if its has a piece in it

				attackedSquares.push([targetRow, targetCol]);
			}
		}

		return attackedSquares;
	}

	rookAvailableSquares(square) {
		console.log(`Rook squares`);
		return [];
	}

	bishopAvailableSquares(square) {
		console.log(`Bishop squares`);
		return [];
	}

	knightAvailableSquares(square) {
		console.log(`Knight squares`);
		return [];
	}

	pawnAvailableSquares(square) {
		console.log(`Pawn squares`);
		return [];
	}

	queenAvailableSquares(square) {
		console.log(`Queen squares`);
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

	getPlayerPieces(turn) {
		return turn === 1 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [-1, -2, -3, -4, -5, -6, -7, -8, -9];
	}

	squareIsWithinBoard(row, col) {
		return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
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