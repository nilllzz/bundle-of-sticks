export default class LocalState {
	static write(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static read<T>(key: string): T {
		return JSON.parse(localStorage.getItem(key)) as T;
	}

	static readDefault<T>(key: string, defaultValue: T): T {
		if (!this.hasKey(key)) {
			this.write(key, defaultValue);
		}
		return this.read<T>(key);
	}

	static hasKey(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}
}
