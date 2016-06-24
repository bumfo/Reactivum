const Emitter = require('./emitter.js');
const ready = require('./ready.js');

class Reactive {
	constructor() {
		this.$_emitter = new Emitter();
		this.$_listener = new Emitter();
	}

	$listen(name, fn) {
		this.$_listener.on(name, fn);
	}
}

function Model(model) {
	let reactive = new Reactive();

	Object.keys(model).forEach(name => {
		Object.defineProperty(reactive, name, {
			enumerable: true,
			get: () => model[name],
			set: val => {
				model[name] = val;
				reactive.$_emitter.emit(name, val);
			},
		});
	});

	return reactive;
}

function biforeachDom(parentNode, fnSet) {
	for (let i = 0, n = parentNode.childNodes.length; i < n; ++i) {
		let node = parentNode.childNodes[i];

		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
				fnSet.elementNode(node);
				biforeachDom(node, fnSet);
				break;
			case Node.TEXT_NODE:
				fnSet.textNode(node);
				break;
		}
	}
}

function foreachAttribute(node, fn) {
	for (let i = 0, n = node.attributes.length; i < n; ++i) {
		let attribute = node.attributes[i];

		fn(attribute);
	}
}


let attributeGetReflects = {
	value: node => node.value,
};

function getValue(node, attribute) {
	if (attributeGetReflects.hasOwnProperty(attribute.name)) {
		return attributeGetReflects[attribute.name](node);
	} else {
		return attribute.value;
	}
}

let attributeSetReflects = {
	value: (node, val) => node.value = val,
};

function bindDom(model, selector) {
	let rep = /\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g;
	let container = document.querySelector(selector);

	function getNewValue(template) {
		return template.replace(rep, (u, v) => {
			return model[v];
		});
	}

	function updateNode(node, template) {
		let newValue = getNewValue(template);

		if (node.nodeValue !== newValue)
			node.nodeValue = newValue;
	}

	function updateAttribute(node, attribute, template) {
		let newValue = getNewValue(template);

		if (getValue(node, attribute) !== newValue) {
			if (attributeSetReflects.hasOwnProperty(attribute.name)) {
				attributeSetReflects[attribute.name](node, newValue);
			} else {
				attribute.value = newValue;
			}
		}
	}

	let elementAttributeChangeReflects = {
		INPUT: {
			value: (element, fn) => element.addEventListener('input', e => {
				fn();
			}),
		},
	};



	let fnSet = {
		textNode: node => {
			let template = node.nodeValue;

			let newText = template.replace(rep, (u, v) => {
				model.$_emitter.on(v, val => {
					updateNode(node, template);
				});
				return model[v];
			});

			if (template !== newText)
				node.nodeValue = newText;
		},
		elementNode: node => {
			foreachAttribute(node, attribute => fnSet.attribute(node, attribute));
		},
		attribute: (node, attribute) => {
			let template = attribute.value;

			let newText = template.replace(rep, (u, v) => {
				model.$_emitter.on(v, val => {
					updateAttribute(node, attribute, template);
				});

				let eventReflects;
				if (elementAttributeChangeReflects.hasOwnProperty(node.nodeName)) {
					eventReflects = elementAttributeChangeReflects[node.nodeName];
				} else {
					eventReflects = {};
				}

				if (eventReflects.hasOwnProperty(attribute.name)) {
					eventReflects[attribute.name](node, () => {
						model.$_listener.emit(v);
						model[v] = getValue(node, attribute);
						// updateAttribute(node, attribute, template);
					});
				}

				return model[v];
			});

			if (template !== newText)
				attribute.value = newText;
		},
	};

	biforeachDom(container, fnSet);
}

function Reactivum(defaults, selector) {
	let model = Model(defaults);

	ready(() => bindDom(model, selector));

	return model;
}

module.exports = Reactivum;
