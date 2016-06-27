class Emitter {
	constructor() {
		this._callbacks = new Map();
	}
	onExact(event, listener) {
		this.getListeners(event).push(listener);
	}
	onAny(events, listener) {
		events.forEach(event => this.onExact(event, listener));
	}
	on(selector, listener) {
		if (typeof selector === 'string')
			this.onAny(selector.split(' '), listener);
		else
			this.onAny(selector, listener);
	}
	emitRest(event, ...args) {
		var arr = this.getListeners(event);
		for (var i = 0, n = arr.length; i < n; ++i) {
			arr[i](...args);
		}
	}
	emit(event, e) {
		var arr = this.getListeners(event);
		for (var i = 0, n = arr.length; i < n; ++i) {
			arr[i](e);
		}
	}
	getListeners(event) {
		var listeners = this._callbacks.get(event);
		return listeners || this._callbacks.set(event, listeners = []), listeners;
	}
}

module.exports = Emitter;
