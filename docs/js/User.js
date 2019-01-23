export default class User {
	constructor(name,
			leaning=Math.random() * 2 - 1,
			partisanship=Math.random(),
			jerkiness=Math.random()) {
		this.name = name;
		
		this.leaning = leaning;
		this.partisanship = partisanship;
		this.jerkiness = jerkiness;
		
		this.currentThread = null;
	}
}
