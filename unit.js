const Reactivum = require('./reactivum.js');

let demoVum = Reactivum({
	input0: 1,
	input1: 2,
	result: 3,
}, '#demo');

demoVum.$listen('input0 input1', () => {
	demoVum.result = +demoVum.input0 + +demoVum.input1;
});
