export default class Emojis {
	private static getSet() {
		const now = new Date(Date.now());
		const day = now.getDate();
		const month = now.getMonth() + 1;

		if (month === 12) {
			if (day === 24 || day === 25 || day === 26) {
				return ['🎅', '☃️', '🎄', '🎁', '🦌', '🛷'];
			}
		} else if (month === 4 && day === 20) {
			return ['🐸', '👽', '🍀'];
		} else if (month === 9 && day === 11) {
			return ['🇮🇱', '✈️️', '🏙️'];
		} else if (month === 7 && day === 4) {
			return ['🇺🇸', '🍔', '🔫', '🦅', '🗽'];
		} else if (month === 2 && day === 14) {
			return ['❤️', '🍑', '🍆', '😍', '💋'];
		} else if (month === 10 && day === 3) {
			return ['🇩🇪', '🎆', '🥨', '🍺'];
		} else if (month === 10 && day === 31) {
			return ['🎃', '💀', '👻', '☠'];
		}

		return [
			'👏',
			'👌',
			'😤',
			'🍩',
			'💯',
			'🍎',
			'🎨',
			'🐤',
			'🎈',
			'🍌',
			'🐝',
			'🎂',
			'🍞',
			'💡',
			'🍰',
			'🐔',
			'🍪',
			'🌽',
			'🌲',
			'🔥',
			'🍤',
			'🍟',
			'💎',
			'🍯',
			'🍨',
			'🍋',
			'🍈',
			'🌴',
			'🍍',
			'🍕',
			'🚀',
			'💥',
			'🌳',
			'🍉',
			'🥝',
			'🧀',
			'⛰',
			'⭐',
			'💰',
			'🧠',
			'🥥',
			'🥦',
			'🌭',
			'🥩',
			'🥪',
			'🥫',
			'🥡',
			'🥢',
			'🛸',
			'🥌',
			'🥓',
			'🥙',
			'🥚',
			'🥁',
			'🥊'
		];
	}

	public static getRandom() {
		const emojiSet = this.getSet();
		const r = Math.round(Math.random() * (emojiSet.length - 1));
		return emojiSet[r];
	}
}
