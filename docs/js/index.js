import ForumEngine from './ForumEngine.js';
import User from './User.js';
import { delay } from './utils.js';

(async function() {
	const forumEngine = new ForumEngine(10,
		document.getElementById('thread-template'),
		document.getElementById('threads-container'),
	);

	// Expose for debugging
	window.forumEngine = forumEngine;
	
	forumEngine.openSounds({
		ending: 'BanHammer2',
		lock: 'Lock1',
		unlock: 'Unlock2',
		pin: 'Pin2',
		unpin: 'Pin1',
		hide: 'Click1',
		unhide: 'Click2',
		fireloop: { url: 'FireLoop1', loop: true },
	}, 'audio/', '.mp3');

	await forumEngine.load('data/topics.json', 'data/users.json');
	console.log('Loaded data');
	
	const admin = new User('Admin');
	
	forumEngine.createThread(admin, 0, 0,
		'Welcome to the new WeLikePets Forums!', {
			pinned: true,
			locked: true,
		});
	
	forumEngine.addEventAt(2400, () => {
		console.log('Game Over');
		forumEngine.determineEnding();
	});
	
	await delay(1000);
	
	forumEngine.startSim();
})();