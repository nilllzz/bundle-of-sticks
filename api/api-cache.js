const Logger = require('./logger');

class CacheEntry {
	/**
	 * @param {Request} request
	 * @param {string} endpoint
	 * @param {number} cacheTimeMs
	 */
	constructor(request, endpoint, data, cacheTimeMs) {
		this.request = request;
		this.expires = cacheTimeMs + Date.now();
		this.endpoint = endpoint;
		this.data = data;

		this.id = CacheEntry.getId(request, endpoint);
	}

	/**
	 * @param {Request} request
	 * @param {string} endpoint
	 */
	static getId(request, endpoint) {
		return JSON.stringify({
			endpoint: endpoint,
			query: request.query,
		}).toLowerCase();
	}

	/**
	 * @return {Boolean}
	 */
	isExpired() {
		const now = Date.now();
		return now >= this.expires;
	}
}

class ApiCache {
	constructor() {
		this.entries = [];
	}

	// prunes all expired entries
	prune() {
		let count = this.entries.length;
		this.entries = this.entries.filter(e => !e.isExpired());

		if (count - this.entries.length > 0) {
			Logger.info('cache', 'Pruned ' + (count - this.entries.length) + ' entries from cache');
		}
	}

	/**
	 * @param {Request} request
	 * @param {string} endpoint
	 * @param {any} data
	 * @param {number} cacheTimeMs 10 minutes default
	 */
	cacheRequest(request, endpoint, data, cacheTimeMs = 600000) {
		this.prune();

		const entry = new CacheEntry(request, endpoint, data, cacheTimeMs);
		if (!this.entries.some(e => e.id === entry.id)) {
			Logger.info('cache', 'Cache results for request ' + entry.id);
			this.entries.push(entry);
		}

		return data;
	}

	/**
	 * @param {Request} request
	 * @param {string} endpoint
	 * @return The cache entry's data or false if none exist
	 */
	getCache(request, endpoint) {
		const id = CacheEntry.getId(request, endpoint);
		if (this.entries.some(e => e.id === id)) {
			const entry = this.entries.find(e => e.id === id);
			if (!entry.isExpired()) {
				Logger.info('cache', 'Return cached data for id ' + entry.id);
				return entry.data;
			}
		}
		return false;
	}
}

const activeCache = new ApiCache();
module.exports = activeCache;
