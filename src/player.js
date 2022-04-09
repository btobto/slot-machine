export class Player {
	constructor(balance, stake) {
		this.balance = balance;
		this.stake = stake;
	}

	reduceBalance() {
		if (this.balance - this.stake >= 0) {
			this.balance -= this.stake;
		}
	}

	addStake(increment) {
		if (this.stake + increment <= this.balance) {
			this.stake += increment;
		}
	}

	reduceStake(decrement) {
		if (this.stake - decrement > 0) {
			this.stake -= decrement;
		}
	}
}