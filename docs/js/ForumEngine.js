import ForumThread from './ForumThread.js';

export default class ForumEngine {
	constructor(threadTemplate, threadContainer) {
		this._threadTemplate = threadTemplate;
		this._threadContainer = threadContainer;
		
		this._threads = [];
	}
	
	createThread(title, author) {
		const thread = new ForumThread(
			this, this._threadTemplate, title, author);
		this._threads.push(thread);
		this._threadContainer.append(thread.elRoot);
		return thread;
	}
	
	*iterThreads() {
		yield* this._threads;
	}
}
