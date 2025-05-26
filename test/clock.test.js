import { Clock } from "../scripts/clock";

describe('Clock', () => {
  let clock;

  beforeEach(() => {
    clock = new Clock(5, 2);
  });

  test('Initializes with white and black time converted to seconds', () => {
    expect(clock.whiteTime).toBe(300);
    expect(clock.blackTime).toBe(300);
  });

  test('Switches turn between players on switchClockTurn()', () => {
    expect(clock.turn).toBe(1);
    clock.switchClockTurn();
    expect(clock.turn).toBe(-1);
  });

  test('Adds increment to white time when current turn is white', () => {
    clock.whiteTime = 100;
    clock.addIncrementTime(1);
    expect(clock.whiteTime).toBe(102);
  });

  test('Adds increment to black time when current turn is black', () => {
    clock.blackTime = 80;
    clock.addIncrementTime(-1);
    expect(clock.blackTime).toBe(82);
  });

  test('Formats time to MM:SS including leading zeros', () => {
    expect(clock.formatTime(90)).toBe('01:30');
    expect(clock.formatTime(59)).toBe('00:59');
  });

  test('Resets clocks to initial state and turn on restart', () => {
    clock.whiteTime = 0;
    clock.blackTime = 10;
    clock.turn = -1;

    clock.restartClocks();

    expect(clock.whiteTime).toBe(300);
    expect(clock.turn).toBe(1);
  });
});