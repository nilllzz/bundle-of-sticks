export default class LocalState {
	static write(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static read(key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}

	static readDefault(key: string, defaultValue: any): any {
		if (!this.hasKey(key)) {
			this.write(key, defaultValue);
		}
		return this.read(key);
	}

	static hasKey(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}
}
