import ForumThread from './ForumThread.js';

export default class ForumEngine {
	constructor(threadTemplate, threadContainer) {
		this._threadTemplate = threadTemplate;
		this._threadContainer = threadContainer;
		
		this._threads = [];
		
		this.tick = this.tick.bind(this);
		this._intervalID = null;
	}
	
	startSim() {
		if (this._intervalID === null) {
			// Run at 20 tps
			this._intervalID = setInterval(this.tick, 1000 / 20);
		}
	}
	
	stopSim() {
		if (this._intervalID !== null) {
			clearInterval(this._intervalID);
			this._intervalID = null;
		}
	}
	
	tick() {
		// Users can enter or leave threads
		// Users can make "posts" in threads
		// Users can make threads
		// Users can choose to leave forum
		// New users can join
		// Thread order updates
		
		// Moderator users can also take actions
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
