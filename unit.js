const Reactivum = require('./reactivum.js');

let demoVum = Reactivum({
	input: '',
	result: 0,
}, '#demo');

demoVum.$listen('input', () => {
	demoVum.result = Math.random();
});
