var autoIdle = {
	mIdle: false,
	get idle() {
		return this.mIdle;
	},
	set idle(aValue) {
		if (this.mIdle == aValue)
			return;

		this.mIdle = aValue;
		if(aValue) {
			this.mIdleStartTime = Math.min(autoIdle.mLastAction, 
																			Date.now() - this.closeTime);
			clearInterval(this.mAutoCloseInterval);
			delete this.mAutoCloseInterval;
			document.getElementById("act_idle").hidden = false;
		}
	}
}