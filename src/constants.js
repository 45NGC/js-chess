'use strict';

export const MOVE_NORMAL = 0;
export const MOVE_CAPTURE = 1;
export const MOVE_CHECK = 2;
export const MOVE_CHECKMATE = 3;
export const MOVE_DRAW = 4;
export const END_TIME = 5;
export const EN_PASSANT_SQUARE = 9;

export const CASTLING_PIECES = [4, -4, 5, -5, 7, -7];

export const MOVES = {
	king: [[0, 1], [1, 0], [-1, -1], [-1, 1], [-1, 0], [1, -1], [1, 1], [0, -1]],
	queen: [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [0, 1], [-1, 0], [0, -1]],
	rook: [[1, 0], [0, 1], [-1, 0], [0, -1]],
	bishop: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
	knight: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
};

export const PIECE_MAP = {
	'1': `white_pawn`,
	'2': `white_knight`,
	'3': `white_bishop`,
	'4': `white_rook`,
	'5': `white_rook`,
	'6': `white_rook`,
	'7': `white_king`,
	'8': `white_queen`,
	'-1': `black_pawn`,
	'-2': `black_knight`,
	'-3': `black_bishop`,
	'-4': `black_rook`,
	'-5': `black_rook`,
	'-6': `black_rook`,
	'-7': `black_king`,
	'-8': `black_queen`
};

export const BOARDS = {
	EMPTY: [
		[-7, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 7],
	],

	BLOCKED_PAWN: [
		[-7, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, -1, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 7],
	],

	ROOK_TEST: [
		[-7, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 2, 0, 0, 0, 0],
		[0, 0, 0,  0, 0, 0, 0, 0],
		[0, 0, 0,  4, 0, 0, 0, 0],
		[0, 0, 0,  0, 0, 0, 0, 0],
		[0, 0, 0, 2, 0, 0, 0, 0],
		[0, 0, 0,  0, 0, 0, 0, 0],
		[0, 0, 0,  0, 0, 0, 0, 7],
	],

	BISHOP_BLOCKED: [
		[0, 0, 0, -7, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 3, 0, 0, 0, 0],
		[0, 0, 2, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, -2, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 7],
	],
};
