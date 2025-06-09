'use strict'

import { END_SOUND } from "./sounds.js";

export class Clock {

	constructor(minutes, increment) {
		this.minutes = minutes;
		this.increment = increment;
		this.whiteTime = minutes * 60;
		this.blackTime = minutes * 60;
		this.initialTime = minutes * 60;
		this.turn = 1;
	}

	startClock() {
		clearInterval(this.intervalId);

		this.intervalId = setInterval(() => {
			if (this.turn === 1) {
				if (this.whiteTime > 0) {
					this.whiteTime--;
				} else {
					clearInterval(this.intervalId);
					END_SOUND.play();
					this.finishTimeMessage()
				}
			} else {
				if (this.blackTime > 0) {
					this.blackTime--;
				} else {
					clearInterval(this.intervalId);
					END_SOUND.play();
					this.finishTimeMessage()
				}
			}
			this.updateClocks();
		}, 1000);
	}

	updateClocks() {
		document.getElementById('black-clock').textContent = this.formatTime(this.blackTime);
		document.getElementById('white-clock').textContent = this.formatTime(this.whiteTime);
	}

	stopClocks() {
		clearInterval(this.intervalId);
	}

	restartClocks() {
		this.turn = 1;
		this.blackTime = this.initialTime;
		this.whiteTime = this.initialTime;
	}

	rotateClocks(setInitialPosition = false) {
		const clockContainer = document.querySelector('.chess-clock');
		const whiteClock = document.getElementById('white-clock');
		const blackClock = document.getElementById('black-clock');

		if (whiteClock && blackClock && clockContainer) {

			if (setInitialPosition) {
				clockContainer.insertBefore(blackClock, whiteClock);
			} else {

				if (clockContainer.firstElementChild === blackClock) {
					clockContainer.insertBefore(whiteClock, blackClock);
				} else {
					clockContainer.insertBefore(blackClock, whiteClock);
				}
			}
		}
	}

	addIncrementTime(turn) {
		if (turn === 1) {
			this.whiteTime += this.increment;
		} else {
			this.blackTime += this.increment;
		}
	}

	formatTime(seconds) {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	}

	switchClockTurn() {
		this.turn = this.turn === 1 ? -1 : 1;
	}

	finishTimeMessage() {
		const endGameMessage = document.getElementById('end-game-message');
		this.stopClocks();

		const endTimeEvent = new CustomEvent('timeFinished');
		document.dispatchEvent(endTimeEvent);

		endGameMessage.textContent = this.turn === 1 ? `BLACK WON` : `WHITE WON`;
		endGameMessage.classList.remove('hidden');
}

}