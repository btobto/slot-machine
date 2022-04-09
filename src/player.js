export class Player {
	constructor(balance, stake) {
		this.balance = balance;
		this.stake = stake;
	}

	reduceBalance() {
		this.balance -= this.stake;

		if (this.balance <= 0) {
			// todo
		}
	}

	changeStake(newStake) {
		if (newStake <= this.balance) {
			this.stake = newStake;
		}
	}
}