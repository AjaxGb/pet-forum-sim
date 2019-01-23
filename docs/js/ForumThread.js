export default class ForumThread {
	constructor(forum, template, title, author) {
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
		
		this.postCount = 0;
		this.flameAmount = Math.random();
		this.radAmount = Math.random();
		this.elegantAmount = Math.random();
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
