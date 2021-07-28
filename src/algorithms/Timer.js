export default class Timer {
	constructor(callback, delay) {
		this.start = Date.now();
		this.id = setTimeout(callback, delay);
		this.callback = callback;
		this.remaining = delay;
	}

	clear = () => {
		clearTimeout(this.id);
	};
}
