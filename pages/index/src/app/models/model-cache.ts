type CacheEntry<T> = {
	id: string;
	model: T;
}

export default class ModelCache<T> {
	entries: CacheEntry<T>[];

	constructor() {
		this.entries = [];
	}

	public hasEntry(id: string) {
		return this.entries.some(e => e.id === id);
	}

	public getEntry(id: string) {
		return this.entries.find(e => e.id === id).model;
	}

	public addEntry(id: string, model: T) {
		const entry = {
			id: id,
			model: model
		}
		this.entries.push(entry);
		return entry;
	}
}
