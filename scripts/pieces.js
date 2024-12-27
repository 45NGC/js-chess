'use strict'

export class Pieces {

	// PIECE METHODS :

	kingAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`King squares`);

	}

	rookAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`Rook squares`);

	}

	bishopAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`Bishop squares`);

	}

	knightAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`Knight squares`);

	}

	pawnAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`Pawn squares`);

	}

	queenAvailableSquares(board, turn, includeAttackedSquares) {
		console.log(`Queen squares`);

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

	getOpponentAttackedSquares(board, turn) {

	}

	getOpponentPieces(turn) {
		return turn === 1 ? [-1, -2, -3, -4, -5, -6, -7, -8, -9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
	}

	// In case any move is made we delete the available en passant squares because they only last one turn
	deleteEnPassantSquares(board) {

	}
}