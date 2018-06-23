module.exports = class Helper {
	static async sleep(ms) {
		await new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	}
};
