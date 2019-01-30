import ForumThread from './ForumThread.js';
import User from './User.js';
import { randomChoice } from './utils.js';

export default class ForumEngine {
	constructor(maxThreads, threadTemplate, threadContainer) {
		this._threadTemplate = threadTemplate;
		this._threadContainer = threadContainer;
		
		this.sounds = Object.create(null);
		
		this._tickEvents = [];
		
		this.threadTitles = null;
		this._threads = [];
		this.maxThreads = maxThreads;
		
		this.potentialUsers = null;
		this._users = [];
		
		this.currentTick = 0;
		this.tick = this.tick.bind(this);
		this._intervalID = null;
		
		this.flameMod = 0;
		
		// No bind needed (yet)
		threadContainer.addEventListener('click',
			this._onClick);
		threadContainer.addEventListener('contextmenu',
			this._onContext);
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
	
	addEventAt(tick, callback) {
		this._tickEvents.push({
			tick: tick,
			callback: callback,
		});
		this._tickEvents.sort((a, b) => a.tick - b.tick);
	}
	
	openSounds(sounds, prefix='', suffix='') {
		for (let [name, url] of Object.entries(sounds)) {
			let loop = false;
			if (typeof url === 'object') {
				loop = !!url.loop;
				url = url.url;
			}
			const audio = new Audio(prefix + url + suffix);
			audio.loop = loop;
			this.sounds[name] = audio;
		}
	}
	
	sound(name) {
		const audio = this.sounds[name];
		if (!audio) return;
		audio.currentTime = 0;
		audio.play();
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
	
	_onContext(event) {
		if (!event
			|| !event.target
			|| !event.target.classList) return;
		
		const target = event.target;
		
		if (target.classList.contains('thread-action')) {
			event.preventDefault();
		}
	}
	
	_onClick(event) {
		if (!event
			|| !event.target
			|| !event.target.classList) return;
		
		const target = event.target;
		
		if (target.classList.contains('thread-action')) {
			event.preventDefault();
			
			if (event.ctrlKey || event.altKey || event.shiftKey) {
				return;
			}
			
			const thread = ForumThread.getByElement(
				target.closest('.thread'));
			
			switch (target.dataset.buttonAction) {
			case 'lock':
				thread.locked = !thread.locked;
				break;
			case 'hide':
				thread.hidden = !thread.hidden;
				break;
			case 'pin':
				thread.pinned = !thread.pinned;
				break;
			}
		}
	}
	
	tick() {
		if (this.currentTick % 150 == 0)
		{
			if (this.potentialUsers.length > 0)
			{
				let n = Math.floor(Math.random() * this.potentialUsers.length);
				if (this.currentTick < 600)
				{
					while (Math.abs(this.potentialUsers[n].leaning) > 0.3)
					{
						n = Math.floor(Math.random() * this.potentialUsers.length);
					}
				}
				let newUser = this.potentialUsers[n];
				this._users.push(new User(newUser.name, newUser.leaning, newUser.partisanship, newUser.aggression));
				this.potentialUsers.splice(n, 1);
			}
			
			if (this.currentTick % 150 == 0)
			{
				let newAuthor = randomChoice(this._users);
				this.createThread(newAuthor, newAuthor.leaning, newAuthor.jerkiness + (this.flameMod / 5));
			}
			
			if (this.currentTick % 300 == 0)
			{
				this.flameMod *= 3;
				for (let i = 0;i < this._threads.length;i++)
				{
					this.flameMod += this._threads[i].flameAmount;
				}
				this.flameMod = this.flameMod / this.maxThreads;
			}
		}
		
		let removeUser = -1;
		
		for (let i = this.currentTick % 15;i < this._users.length;i = i + 5)
		{
			//picks newer posts over older ones
			//for now, this is according to how far down the page the post is
			let currentUser = this._users[i];
			
			const visibleThreads = this._threads.filter(t => !t.hidden);
			
			let r = Math.floor(Math.random() * 3);
			let threadIndex = (visibleThreads.length - 1) - r;
			if (threadIndex < 0)
				threadIndex = 0;
			
			while (threadIndex >= 0 && threadIndex < visibleThreads.length)
			{
				let lookThread = visibleThreads[threadIndex];
				
				if (lookThread.flameAmount < (currentUser.jerkiness + 1) / 2)
				{
					let lenience = (1 - currentUser.partisanship) / 2;
					if (currentUser.leaning + lookThread.elegantAmount <  lenience || currentUser.leaning - lookThread.radAmount <  lenience
						|| (lookThread.elegantAmount + lookThread.radAmount) * 2 < lenience)
					{
						let temp = visibleThreads[threadIndex];
						if (temp.locked)
						{
							if (lookThread.flameAmount * 2 > (currentUser.jerkiness + 1) / 2)
							{
								this.flameMod *= 1.15;
								if (Math.random < 0.2)
									removeUser = i;
							}
							else
								this.flameMod *= 0.95;
						}
						else
						{
							temp.addPost(currentUser, currentUser.leaning, currentUser.jerkiness + (this.flameMod / 5));
						}
						break;
					}
				}
				
				threadIndex--;
			}
			
			if (threadIndex < 0)
			{
				if (this.currentTick < 400)
				{
					if (visibleThreads.length < 3)
					{
						let temp = randomChoice(visibleThreads);
						if (temp.locked)
						{
							removeUser = i;
							this.flameMod *= 1.1;
						}
						else
							temp.addPost(currentUser, currentUser.leaning, currentUser.jerkiness + (this.flameMod / 5));
						
					}
					else
					{
						let temp = visibleThreads[Math.floor(Math.random() * 3)];
						if (temp.locked)
						{
							removeUser = i;
							this.flameMod *= 1.1;
						}
						else
							temp.addPost(currentUser, currentUser.leaning, currentUser.jerkiness + (this.flameMod / 5));
					}
				}
				else
				{
					removeUser = i;
				}
			}
		}
		
		if (removeUser != -1)
		{
			this._users.splice(removeUser, 1);
		}
		
		// Users can enter or leave threads
		// Users can make "posts" in threads
		// Users can make threads
		// Users can choose to leave forum
		// New users can join
		
		// Moderator users can also take actions
		
		//for all threads: update values
		
		while (this._tickEvents.length && this.currentTick >= this._tickEvents[0].tick) {
			this._tickEvents[0].callback.call(null, this);
			this._tickEvents.shift();
		}
		
		if (this.currentTick % 20 === 0) {
			this.updateThreadPositions();
		}
		
		this.currentTick++;
	}
	
	determineEnding(forcedEnding) {
		this.stopSim();
		
		document.documentElement.focus();
		document.body.classList.add('game-over');
		this.sound('ending');
		
		// TODO: Prevent tabbing to controls after gameover
		
		let flame = this.flameMod;
		let lean = 0;
		for (let i = 0; i < this._users.length; i++) {
			lean += this._users[i].leaning;
		}
		lean = lean / this._users.length;
		
		if (forcedEnding !== undefined) {
			flame = -Infinity;
			
			switch (forcedEnding) {
			case 'flame':
				flame = Infinity;
				break;
			case 'traditional':
				lean = Infinity;
				break;
			case 'radical':
				lean = -Infinity;
				break;
			case 'neutral':
				lean = 0;
				break;
			default:
				throw new Error(`Invalid forcedEnding: "${forcedEnding}"`);
			}
		}
		
		if (flame > 0.84)
		{
			document.body.classList.add('flame-ending');
			this.sound('flameloop');
		}
		else if (lean > 0.1)
		{
			document.body.classList.add('traditional-ending');
		}
		else if (lean < -0.1)
		{
			document.body.classList.add('radical-ending');
		}
		else
		{
			document.body.classList.add('neutral-ending');
		}
	}
	
	_pickMatchingTitle(author, leaning, flame) {
		let rant = Math.floor(Math.random() * this.threadTitles.length);
		let len = 0.15;
		
		while (Math.abs(this.threadTitles[rant].leaning - author.leaning) > len && Math.abs(this.threadTitles[rant].aggression - flame) > len)
		{
			rant = Math.floor(Math.random() * this.threadTitles.length);
		}
		let r = this.threadTitles[rant].title;
		this.threadTitles.splice(rant, 1);
		return r;
	}
	
	createThread(author, leaning, flame,
			title=this._pickMatchingTitle(author, leaning, flame),
			options={}) {
		
		const thread = new ForumThread(
			this, this._threadTemplate,
			title, author, leaning, flame, options);
		
		thread.index = Infinity;
		
		this._threads.push(thread);
		this._threadContainer.append(thread.elRoot);
		this.updateThreadPositions();
		
		return thread;
	}
	
	static compareThreads(a, b) {
		if (a.pinned && b.pinned) {
			return a.index - b.index;
		} else if (a.pinned) {
			return -1;
		} else if (b.pinned) {
			return 1;
		}
		
		const heatA = a.calculateHeat();
		const heatB = b.calculateHeat();
		const heatDiff = heatA - heatB;
		
		if (Math.abs(heatDiff) < 0.001) {
			return a.index - b.index;
		}
		
		return heatDiff;
	}
	
	updateThreadPositions() {
		this._threads.sort(ForumEngine.compareThreads);
		
		while (this._threads.length > this.maxThreads) {
			const remove = this._threads.pop();
			this._threadContainer.removeChild(remove.elRoot);
		}
		
		let previousRoot = null;
		for (let i = this._threads.length - 1; i >= 0; i--) {
			const thread = this._threads[i];
			thread.index = i;
			
			this._threadContainer.insertBefore(
				thread.elRoot,
				previousRoot);
			
			previousRoot = thread.elRoot;
		}
	}
	
	*iterThreads() {
		yield* this._threads;
	}
}
