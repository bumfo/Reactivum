const Reactivum = require('./reactivum.js');

let demoVum = Reactivum({
	input: '2',
	result: 3,
}, '#demo');

demoVum.$listen('input', () => {
	demoVum.result = +demoVum.input + 1;
});
