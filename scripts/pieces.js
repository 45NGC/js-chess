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

	availableSquares = [];
	kingMoves = [[1, 0], [1, -1], [1, 1], [0, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1]]

	getPieceAvailableMoves(piece, square, getAttackedSquares) {

		switch (piece) {

			// WHITE PIECES
			case `w_king`:
				return this.kingAvailableSquares(square, getAttackedSquares);

			case `w_queen`:
				return this.queenAvailableSquares(square, getAttackedSquares);

			case `w_rook`:
				return this.rookAvailableSquares(square, getAttackedSquares);

			case `w_bishop`:
				return this.bishopAvailableSquares(square, getAttackedSquares);

			case `w_knight`:
				return this.knightAvailableSquares(square, getAttackedSquares);

			case `w_pawn`:
				return this.pawnAvailableSquares(square, getAttackedSquares);

			// BLACK PIECES
			case `b_king`:
				return this.kingAvailableSquares(square, getAttackedSquares);

			case `b_queen`:
				return this.queenAvailableSquares(square, getAttackedSquares);

			case `b_rook`:
				return this.rookAvailableSquares(square, getAttackedSquares);

			case `b_bishop`:
				return this.bishopAvailableSquares(square, getAttackedSquares);

			case `b_knight`:
				return this.knightAvailableSquares(square, getAttackedSquares);

			case `b_pawn`:
				return this.pawnAvailableSquares(square, getAttackedSquares);

		}

	}

	// PIECE METHODS :

	kingAvailableSquares(square, getAttackedSquares) {

		if (!getAttackedSquares) {
			const opponentAttackedSquares = this.getOpponentAttackedSquares(this.board);

			for (const [rowMove, colMove] of this.kingMoves) {
				const targetRow = square[0] + rowMove;
				const targetCol = square[1] + colMove;

				if (this.squareIsWithinBoard(targetRow, targetCol)) {
					const targetSquare = this.board[targetRow][targetCol];

					// if the square does not have one of players pieces it is available (it is 0 or an opponent piece)
					if (!opponentAttackedSquares.includes(targetSquare)) {

						if (!this.playerPieces.includes(targetSquare)) {
							this.availableSquares.push([targetRow, targetCol]);
						}
					}

				}
			}
		} else {

			for (const [rowMove, colMove] of this.kingMoves) {
				const targetRow = square[0] + rowMove;
				const targetCol = square[1] + colMove;

				if (this.squareIsWithinBoard(targetRow, targetCol)) {
					// in case that we only want the attacked squares we do not need 
					// to check if the target square is empty or if its has a piece in it

					this.availableSquares.push([targetRow, targetCol]);
				}
			}
		}



		return this.availableSquares;
	}

	rookAvailableSquares(square, getAttackedSquares) {
		console.log(`Rook squares`);
		return [];
	}

	bishopAvailableSquares(square, getAttackedSquares) {
		console.log(`Bishop squares`);
		return [];
	}

	knightAvailableSquares(square, getAttackedSquares) {
		console.log(`Knight squares`);
		return [];
	}

	pawnAvailableSquares(square, getAttackedSquares) {
		console.log(`Pawn squares`);
		return [];
	}

	queenAvailableSquares(square, getAttackedSquares) {
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
}