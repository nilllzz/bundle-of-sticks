export class Keys {
	public static readonly Backspace = 8;
	public static readonly Enter = 13;
	public static readonly Escape = 27;

	// arrows
	public static readonly ArrowLeft = 37;
	public static readonly ArrowRight = 39;

	// numbers
	public static readonly N0 = 48;
	public static readonly N1 = 49;
	public static readonly N2 = 50;
	public static readonly N3 = 51;
	public static readonly N4 = 52;
	public static readonly N5 = 53;
	public static readonly N6 = 54;
	public static readonly N7 = 55;
	public static readonly N8 = 56;
	public static readonly N9 = 57;

	public static readonly NumberKeys = [
		Keys.N0,
		Keys.N1,
		Keys.N2,
		Keys.N3,
		Keys.N4,
		Keys.N5,
		Keys.N6,
		Keys.N7,
		Keys.N8,
		Keys.N9,
	];

	// numpad
	public static readonly NumPad0 = 96;
	public static readonly NumPad1 = 97;
	public static readonly NumPad2 = 98;
	public static readonly NumPad3 = 99;
	public static readonly NumPad4 = 100;
	public static readonly NumPad5 = 101;
	public static readonly NumPad6 = 102;
	public static readonly NumPad7 = 103;
	public static readonly NumPad8 = 104;
	public static readonly NumPad9 = 105;

	public static readonly NumpadKeys = [
		Keys.NumPad0,
		Keys.NumPad1,
		Keys.NumPad2,
		Keys.NumPad3,
		Keys.NumPad4,
		Keys.NumPad5,
		Keys.NumPad6,
		Keys.NumPad7,
		Keys.NumPad8,
		Keys.NumPad9,
	];

	// returns -1 for all non numerical keys
	public static getNumericalValue(keyCode: number) {
		if (Keys.NumberKeys.includes(keyCode)) {
			return Keys.NumberKeys.indexOf(keyCode);
		} else if (Keys.NumpadKeys.includes(keyCode)) {
			return Keys.NumpadKeys.indexOf(keyCode);
		}
		// default, key is non-numeric
		return -1;
	}
}

type KeyboardEventBusSubscriber = {
	id: string;
	handler: (keyCode: number) => boolean;
};

export class KeyboardEventBus {
	private subscribers: KeyboardEventBusSubscriber[] = [];

	public subscribe(id: string, handler: (keyCode: number) => boolean) {
		if (!this.subscribers.some(s => s.id === id)) {
			this.subscribers.push({
				id: id,
				handler: handler,
			});
		}
	}

	public unsubscribe(id: string) {
		this.subscribers = this.subscribers.filter(s => s.id !== id);
	}

	public push(keyCode: number) {
		for (const subscriber of this.subscribers) {
			const handled = subscriber.handler(keyCode);
			if (handled) {
				return;
			}
		}
	}
}
