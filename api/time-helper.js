module.exports = class TimeHelper {
	static minutes(mins) {
		return 1000 * 60 * mins;
	}

	static hours(hours) {
		return 1000 * 60 * 60 * hours;
	}
};
