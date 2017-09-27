import Cookie from './Cookie';
const sessionStorage = {
	setItem(name, value) {
		Cookie(name, value);
	},
	getItem(name) {
		return Cookie(name);
	},
}

// 如果不支持sessionStorage就用cookie，而且伪造sessionStorage
if (!window.sessionStorage) {
	window.sessionStorage = sessionStorage;
}