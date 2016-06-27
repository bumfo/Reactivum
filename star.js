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

let starsDom = document.querySelector('#star').children;

function domForeach(nodeCollection, fn) {
	for (let i = 0, n = nodeCollection.length; i < n; ++i) {
		fn(nodeCollection[i], i, nodeCollection);
	}
}

domForeach(starsDom, (starDom, i) => {
	starsDom[i].addEventListener('mousedown', e => {
		updateRating(i + 1);
	});
})

updateRating(3.5);
