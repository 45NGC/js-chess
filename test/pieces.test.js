import { Pieces } from '../src/pieces.js';
import { EN_PASSANT_SQUARE, BOARDS } from '../src/constants.js';

describe('Pieces', () => {

	/*
		NOTE: Consider refactoring current test setup to avoid modifying BOARDS.EMPTY directly within each test.
		Instead, define specific board scenarios (e.g., BOARDS.QUEEN_CENTERED, BOARDS.ROOK_BLOCKED) in a separate 
		constants or boardCases.js file.

		Benefits of this approach:
		- Improves test readability by using descriptive board names.
		- Reduces duplication and potential setup errors.
		- Makes it easier to reuse board setups across multiple tests.
		- Keeps tests focused on logic rather than board initialization.

		Example:
		Instead of:
			const board = structuredClone(BOARDS.EMPTY);
			board[3][3] = 8; // white queen

		Use:
			const board = BOARDS.QUEEN_CENTERED;

		This will help maintain clean, scalable, and self-documenting test code.
	*/

	//TODO: use constant PIECE_MAP in tests

	test('king squares should be adjacent squares', () => {
		const board = structuredClone(BOARDS.EMPTY);
		board[4][4] = 7;

		const pieces = new Pieces(1, false);
		const attacks = pieces.getPieceAvailableMoves(board, 'white_king', [4, 4], {}, true);

		expect(attacks).toEqual(expect.arrayContaining([
			[3, 3], [3, 4], [3, 5],
			[4, 3], [4, 5],
			[5, 3], [5, 4], [5, 5],
		]));
	});

	test('knight squares should be valid L-shaped moves', () => {
		const board = structuredClone(BOARDS.EMPTY);
		board[4][4] = 2;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_knight', [4, 4], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[2, 3], [2, 5], [3, 2], [3, 6],
			[5, 2], [5, 6], [6, 3], [6, 5]
		]));
	});

	test('pawn squares should include single move forward', () => {
		const board = structuredClone(BOARDS.EMPTY);
		board[6][4] = 1;

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_pawn', [6, 4], {}, false);

		expect(moves).toContainEqual([5, 4]);
	});

	test('pawn squares should include double move from initial position', () => {
		const board = structuredClone(BOARDS.EMPTY);
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

	test('pawn squares should include diagonal capture and en passant', () => {
		const board = structuredClone(BOARDS.EMPTY);
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

	test('pawn should not move forward if path is blocked', () => {
		const board = structuredClone(BOARDS.BLOCKED_PAWN);

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_pawn', [6, 4], {}, false);

		expect(moves).toEqual([]); // cannot move forward
	});
	
	test('rook squares should be straight-line moves blocked by allies/enemies', () => {
		const board = structuredClone(BOARDS.ROOK_TEST);

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_rook', [3, 3], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[2, 3], // up
			[4, 3], // down
		]));
		expect(moves).not.toContainEqual([1, 3]); // blocked by ally at [1, 3]
		expect(moves).not.toContainEqual([5, 3]); // blocked by ally at [5, 3]
	});

	test('bishop squares should be blocked by pieces in diagonals', () => {
		const board = structuredClone(BOARDS.BISHOP_BLOCKED);

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_bishop', [3, 3], {}, false);

		expect(moves).toEqual(expect.arrayContaining([
			[2, 2], [2, 4],
		]));
		expect(moves).not.toContainEqual([4, 2]); // ally blocking
		expect(moves).not.toContainEqual([1, 0]); // not valid diagonal
		expect(moves).not.toContainEqual([5, 4]); // enemy blocking after
	});

	test('queen squares should combine rook and bishop logic', () => {
		const board = structuredClone(BOARDS.EMPTY);
		board[3][3] = 8; // white queen

		const pieces = new Pieces(1, false);
		const moves = pieces.getPieceAvailableMoves(board, 'white_queen', [3, 3], {}, false);

		// test a subset of possible directions
		expect(moves).toEqual(expect.arrayContaining([
			[4, 4], [5, 5], [6, 6],           // down-right
			[4, 2], [5, 1], [6, 0],           // down-left
			[2, 4], [1, 5], [0, 6],           // up-right
			[2, 2], [1, 1], [0, 0],           // up-left
			[3, 4], [3, 5], [3, 6], [3, 7],   // right
			[3, 2], [3, 1], [3, 0],           // left
			[4, 3], [5, 3], [6, 3], [7, 3],   // down
			[2, 3], [1, 3], [0, 3],           // up
		]));
	});

});
