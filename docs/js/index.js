import ForumEngine from './ForumEngine.js';
import User from './User.js';

const forumEngine = new ForumEngine(10,
	document.getElementById('thread-template'),
	document.getElementById('threads-container'),
);

// Expose for debugging
window.forumEngine = forumEngine;

(async function() {
	await forumEngine.load('data/topics.json', 'data/users.json');
	console.log('Loaded data');
	
	forumEngine.createThread(new User('jjFrankz16'), 0, 0,
		"Hi i'm new");
	forumEngine.createThread(new User('A'), -0.2, 1,
		'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	forumEngine.createThread(new User('xxXXMurderDemonXXxx'), 0.4, 0,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum');
	forumEngine.createThread(new User('TEST'), 1, 1,
		'TEST').addPost(new User('bbb'), -1, 0.5);
	
	forumEngine.startSim();
})();