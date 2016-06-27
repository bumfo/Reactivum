const Reactivum = require('./reactivum.js');

let ratingVum = Reactivum({
	rating: 0,
	floorPlus1: 0,
	fractionalPercentage: '0%',
}, '#ratings');

function updateRating(rating) {
	ratingVum.rating = rating;
	ratingVum.floorPlus1 = Math.floor(rating) + 1;
	ratingVum.fractionalPercentage = (rating - Math.floor(rating)) * 100 + '%';
}

function domForeach(nodeCollection, fn) {
	for (let i = 0, n = nodeCollection.length; i < n; ++i) {
		fn(nodeCollection[i], i, nodeCollection);
	}
}

function collectionOn(collection, event, fn) {
	domForeach(collection, (node, i) => {
		node.addEventListener('mousedown', e => {
			fn.call(collection, e, i);
		});
	})
}

collectionOn(document.querySelector('#star').children, 'mousedown', (starDom, i) => {
	updateRating(i + 1);
});

updateRating(3.5);
