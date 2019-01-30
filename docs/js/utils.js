
export function randomChoice(array) {
	return array[Math.floor(Math.random() * array.length)];
}

export function delay(millis) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, millis);
	});
}
