export default class ForumThread {
	constructor(forum, template, title, author, leaning, flame) {
		this._forum = forum;
		this._title = title;
		this._author = author;
		
		const clone = document.importNode(template.content, true);
		
		this.elRoot = clone.getElementById('root');
		
		this.elFlameBar = clone.getElementById('flame-bar');
		this.elRadBar = clone.getElementById('rad-bar');
		this.elElegantBar = clone.getElementById('elegant-bar');
		
		this.elTitle = clone.getElementById('title');
		this.elAuthor = clone.getElementById('author');
		this.elPostCount = clone.getElementById('post-count');
		
		// Remove all template ids so they don't mess
		// up the main page.
		for (let el of clone.querySelectorAll('[id]')) {
			el.removeAttribute('id');
		}
		
		this.elTitle.innerText = title;
		this.elAuthor.innerText = author.name;
		this.elAuthor.href = '#';
		
		this.createdTick = forum.currentTick;
		
		this.maxRecentPosts = 20;
		this.minPostsForFullStrength = 4;
		this.postCount = 0;
		this.recentPosts = [];
		this.addPost(author, leaning, flame);
	}
	
	addPost(user, leaning=0, flame=0, tick=this._forum.currentTick) {
		let length = this.recentPosts.push({
			user: user,
			leaning: Math.max(-1, Math.min(1, leaning)),
			flame: Math.max(0, Math.min(1, flame)),
			tick: tick,
		});
		
		this.postCount++;
		
		while (length-- > this.maxRecentPosts) {
			this.recentPosts.shift();
		}
		
		this.updateValues();
	}
	
	updateValues() {
		let flame = 0;
		let rad = 0;
		let elegant = 0;
		
		for (let post of this.recentPosts) {
			flame += post.flame;
			
			if (post.leaning < 0) {
				rad -= post.leaning;
			} else {
				elegant += post.leaning;
			}
		}
		
		// Threads that are just beginning won't be
		// able to completely max out their bars right
		// out of the gate.
		const count = Math.max(
			this.minPostsForFullStrength,
			this.recentPosts.length);
		
		this.flameAmount = flame / count;
		this.radAmount = rad / count;
		this.elegantAmount = elegant / count;
	}
	
	calculateHeat() {
		// TODO
		return 0;
	}
	
	get title() {
		return this._title;
	}
	
	get author() {
		return this._author;
	}
	
	get postCount() {
		return this._postCount;
	}
	
	set postCount(val) {
		// Truncate to integer, clamp to minimum 0.
		val = Math.max(0, val|0);
		this._postCount = val;
		this.elPostCount.innerText = val;
	}
	
	get flameAmount() {
		return this.elFlameBar.value;
	}
	
	set flameAmount(val) {
		// Automatically clamps to 0..1
		this.elFlameBar.value = val;
	}
	
	get radAmount() {
		return this.elRadBar.value;
	}
	
	set radAmount(val) {
		// Automatically clamps to 0..1
		this.elRadBar.value = val;
	}
	
	get elegantAmount() {
		return this.elElegantBar.value;
	}
	
	set elegantAmount(val) {
		// Automatically clamps to 0..1
		this.elElegantBar.value = val;
	}
}
