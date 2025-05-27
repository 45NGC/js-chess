import { Pieces } from '../scripts/pieces.js';
import { EN_PASSANT_SQUARE } from '../scripts/constants.js';

describe('Pieces', () => {

	const emptyBoard = [
		[-7, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 7],
	];

	test('kingAttackedSquares should return adjacent squares', () => {
		const board = structuredClone(emptyBoard);
		board[4][4] = 7;

		const pieces = new Pieces(1, false);
		const attacks = pieces.getPieceAvailableMoves(board, 'white_king', [4, 4], {}, true);

		expect(attacks).toEqual(expect.arrayContaining([
			[3, 3], [3, 4], [3, 5],
			[4, 3], [4, 5],
			[5, 3], [5, 4], [5, 5],
		]));
	});

	test('knightAvailableSquares should return valid L-shaped moves', () => {
		const board = structuredClone(emptyBoard);
		board[4][4] = 2;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_knight', [4, 4], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[2, 3], [2, 5], [3, 2], [3, 6],
			[5, 2], [5, 6], [6, 3], [6, 5]
		]));
	});

	test('pawnAvailableSquares should include single move forward', () => {
		const board = structuredClone(emptyBoard);
		board[6][4] = 1;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_pawn', [6, 4], {}, false);

		expect(moves).toContainEqual([5, 4]);
	});

	test('pawnAvailableSquares should include double move from initial position', () => {
		const board = structuredClone(emptyBoard);
		board[6][4] = 1;
		board[5][4] = 0;
		board[4][4] = 0;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_pawn', [6, 4], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[5, 4],
			[4, 4]
		]));
	});

	test('pawnAvailableSquares should include diagonal capture and en passant', () => {
		const board = structuredClone(emptyBoard);
		board[3][3] = 1;
		board[2][2] = -1;
		board[2][4] = EN_PASSANT_SQUARE;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_pawn', [3, 3], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[2, 2],
			[2, 4]
		]));
	});

});
