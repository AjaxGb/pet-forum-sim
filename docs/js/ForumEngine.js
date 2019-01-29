import ForumThread from './ForumThread.js';
import User from './User.js';
import { randomChoice } from './utils.js';

export default class ForumEngine {
	constructor(maxThreads, threadTemplate, threadContainer) {
		this._threadTemplate = threadTemplate;
		this._threadContainer = threadContainer;
		
		this.threadTitles = null;
		this._threads = [];
		this.maxThreads = maxThreads;
		
		this.potentialUsers = null;
		this._users = [];
		
		this.currentTick = 0;
		this.tick = this.tick.bind(this);
		this._intervalID = null;
	}
	
	async loadTopics(url) {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`Failed to load topics data: \
				${resp.status} ${resp.statusText}`);
		}
		
		const data = await resp.json();
		
		this.threadTitles = data.titles;
	}
	
	async loadUsers(url) {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`Failed to load users data: \
				${resp.status} ${resp.statusText}`);
		}
		
		const data = await resp.json();
		
		this.potentialUsers = data.users;
	}
	
	async load(topicsURL, usersURL) {
		await Promise.all([
			this.loadTopics(topicsURL),
			this.loadUsers(usersURL),
		]);
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
		if (this.currentTick % 25 == 0)
		{
			//calculate forum stats to determine users to show up
			//for now, just pull from potentialUsers randomly
			
			if (true)
			{
				let newUser = randomChoice(this.potentialUsers);
				this._users.push(new User(newUser.name, newUser.leaning, newUser.partisanship, newUser.aggression));
			}
			
			if (this.currentTick % 50 == 0)
			{
				let newAuthor = randomChoice(this._users);
				this.createThread(newAuthor, newAuthor.leaning, newAuthor.jerkiness);
			}
		}
		
		for (let i = this.currentTick % 5;i < this._users.length;i = i + 5)
		{
			//picks newer posts over older ones
			//for now, this is according to how far down the page the post is
			let currentUser = this._users[i];
			
			let r = Math.floor(Math.random() * 3);
			let threadIndex = (this._threads.length - 1) - r;
			if (threadIndex < 0)
				threadIndex = 0;
			
			while (threadIndex >= 0)
			{
				let lookThread = this._threads[threadIndex];
				
				if (lookThread.flameAmount / 2 < currentUser.jerkiness && true /*what the heck would the formula be???*/)
				{
					this._threads[threadIndex].addPost(currentUser, currentUser.leaning, currentUser.jerkiness);
					
					break;
				}
				
				threadIndex--;
			}
			
			if (threadIndex < 0)
			{
				//mark user for removal. i.e: user is leaving the forum
			}
		}
		
		if (this.currentTick > 500)
		{
			this.stopSim();
		}
		
		// Users can enter or leave threads
		// Users can make "posts" in threads
		// Users can make threads
		// Users can choose to leave forum
		// New users can join
		
		// Moderator users can also take actions
		
		//for all threads: update values
		
		this.currentTick++;
		
		this.updateThreadPositions();
	}
	
	_pickMatchingTitle(author, leaning, flame) {
		// TODO: Actually pick an appropriate title
		// TODO: Prevent the same thread from showing up too often
		return randomChoice(this.threadTitles).title;
	}
	
	createThread(author, leaning, flame,
			title=this._pickMatchingTitle(author, leaning, flame)) {
		
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
