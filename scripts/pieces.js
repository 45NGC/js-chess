'use strict'

export class Pieces {

	constructor(turn, board) {
		this.turn = turn;
		this.board = board;
		this.playerPieces = this.getPlayerPieces(turn);
		this.opponentPieces = this.getPlayerPieces(-turn);
		this.opponentAttackedSquares = this.getOpponentAttackedSquares(board, turn);
		this.kingSquare = this.getKingSquare(board, turn);
	}

	availableSquares = [];
	kingMoves = [[1, 0], [1, -1], [1, 1], [0, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1]]

	// PIECE METHODS :

	kingAvailableSquares(getAttackedSquares) {

		//this.availableSquares = [];

		for (const [rowMove, colMove] of this.kingMoves) {
			const targetRow = this.kingSquare[0] + rowMove;
			const targetCol = this.kingSquare[1] + colMove;

			if (this.squareIsWithinBoard(targetRow, targetCol)) {
				const targetSquare = this.board[targetRow][targetCol];
				const isAttacked = this.opponentAttackedSquares.includes(targetSquare);

				// in case that we only want the attacked squares we do not need 
				// to check if the target square is empty or if its has a piece in it
				if (getAttackedSquares) {
					this.availableSquares.push([targetRow, targetCol]);
				} else if (!isAttacked) {
					// check if the square is empty or has an opponent piece
					if (!this.playerPieces.includes(targetSquare)) {
						this.availableSquares.push([targetRow, targetCol]);
					}
				}
			}
		}

		return this.availableSquares;
	}

	rookAvailableSquares(getAttackedSquares) {
		console.log(`Rook squares`);
		return [];
	}

	bishopAvailableSquares(getAttackedSquares) {
		console.log(`Bishop squares`);
		return [];
	}

	knightAvailableSquares(getAttackedSquares) {
		console.log(`Knight squares`);
		return [];
	}

	pawnAvailableSquares(getAttackedSquares) {
		console.log(`Pawn squares`);
		return [];
	}

	queenAvailableSquares(getAttackedSquares) {
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

	getOpponentAttackedSquares(board, turn) {
		return [];
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