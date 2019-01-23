
export class ThreadHandler {
	constructor(threadTemplate, threadContainer) {
		this.threadTemplate = threadTemplate;
		this.threadContainer = threadContainer;
	}
	
	create(title, author) {
		const thread = new ForumThread(this, title, author);
		this.threadContainer.append(thread.elRoot);
		return thread;
	}
}

export class ForumThread {
	constructor(handler, title, author) {
		this._handler = handler;
		this._title = title;
		this._author = author;
		
		const clone = document.importNode(
			handler.threadTemplate.content, true);
		
		this.elRoot = clone.getElementById('root');
		
		this.elFlameBar = clone.getElementById('flame-bar');
		this.elRadBar = clone.getElementById('rad-bar');
		this.elElegantBar = clone.getElementById('elegant-bar');
		
		this.elTitle = clone.getElementById('title');
		this.elAuthor = clone.getElementById('author');
		this.elPostCount = clone.getElementById('post-count');
		
		for (let el of clone.querySelectorAll('[id]')) {
			el.removeAttribute('id');
		}
		
		this.elTitle.innerText = title;
		this.elAuthor.innerText = author.name;
		this.elAuthor.href = '#';
		
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
