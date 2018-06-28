module.exports = class Logger {
	static log(type, context, message) {
		// yeah this looks sane
		const text =
			'[' +
			type.padEnd(5) +
			'] [' +
			context
				.toUpperCase()
				.substr(0, 8)
				.padEnd(8) +
			'] ' +
			message;
		console.log(text);
	}

	/**
	 * @param {string} context
	 * @param {string} message
	 */
	static info(context, message) {
		this.log('INFO', context, message);
	}

	/**
	 * @param {string} context
	 * @param {Error} error
	 */
	static error(context, error) {
		this.log('ERROR', context, error.message);
	}
};
