import ForumEngine from './ForumEngine.js';
import User from './User.js';

(async function() {
	const forumEngine = new ForumEngine(10,
		document.getElementById('thread-template'),
		document.getElementById('threads-container'),
	);

	// Expose for debugging
	window.forumEngine = forumEngine;
	
	forumEngine.openSounds({
		ban: 'BanHammer2',
		lock: 'Lock1',
		pin: 'Pin2',
		unpin: 'Pin1',
	}, 'audio/', '.mp3');

	await forumEngine.load('data/topics.json', 'data/users.json');
	console.log('Loaded data');
	
	const admin = new User('Admin');
	
	forumEngine.createThread(admin, 0, 0,
		'Welcome to the new WeLikePets Forums!', {
			pinned: true,
			locked: true,
		});
	
	forumEngine.startSim();
})();