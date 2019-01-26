import ForumThread from './ForumThread.js';
import User from './User.js';

export default class ForumEngine {
	constructor(maxThreads, threadTemplate, threadContainer) {
		this._threadTemplate = threadTemplate;
		this._threadContainer = threadContainer;
		
		this._threads = [];
		this.maxThreads = maxThreads;
		
		this.currentTick = 0;
		this.tick = this.tick.bind(this);
		this.stopSim = this.stopSim.bind(this);
		this.createThread = this.createThread.bind(this);
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
		this.currentTick++;
		
		for (var i = 0; i < this._threads.length; i++)
		{
			if (this.currentTick % 20 + i > 21)
				this._threads[i].addPost(new User("temp"));
		}
		if (this.currentTick % 17 == 0)
		{
			this.createThread("Dogs", new User("cur"), 0, 0.5);
		}
		
		if (this.currentTick > 200)
		{
			this.stopSim();
		}
		
		// Users can enter or leave threads
		// Users can make "posts" in threads
		// Users can make threads
		// Users can choose to leave forum
		// New users can join
		
		// Moderator users can also take actions
		
		this.updateThreadPositions();
	}
	
	createThread(title, author, leaning, flame) {
		const thread = new ForumThread(
			this, this._threadTemplate,
			title, author, leaning, flame);
		this._threads.push(thread);
		this._threadContainer.append(thread.elRoot);
		return thread;
	}
	
	static compareThreads(a, b) {
		const heatA = a.calculateHeat();
		const heatB = b.calculateHeat();
		// TODO: if heats are equal, use previous index
		return heatA - heatB;
	}
	
	updateThreadPositions() {
		this._threads.sort(ForumEngine.compareThreads);
		// TODO: drop old threads, update thread positions, etc.
	}
	
	*iterThreads() {
		yield* this._threads;
	}
}
