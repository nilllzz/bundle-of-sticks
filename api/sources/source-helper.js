const MangaHere = require('./mangahere');

module.exports = class SourceHelper {
	static async search(query, providers) {
		let results = [];
		const searchAll = providers === undefined;
		if (searchAll || providers.includes(MangaHere.id)) {
			results = results.concat(await MangaHere.search(query));
		}

		return results;
	}

	static async getChapters(hostId, mangaLink) {
		if (hostId === MangaHere.id) {
			return await MangaHere.getChapters(mangaLink);
		}
	}
};
