const MangaHere = require('./manga-here');
const MangaPark = require('./manga-park');

module.exports = class SourceHelper {
	static async search(query, providers) {
		let results = [];
		const searchAll = providers === undefined;
		if (searchAll || providers.includes(MangaHere.id)) {
			results = results.concat(await MangaHere.search(query));
		}
		if (searchAll || providers.includes(MangaPark.id)) {
			results = results.concat(await MangaPark.search(query));
		}

		// sort all results alphabetically
		results = results.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});

		// if there are "hot" entries, put them first
		if (results.some(r => r.hot)) {
			const hotResults = results.filter(r => r.hot);
			const other = results.filter(r => !r.hot);
			results = hotResults.concat(other);
		}

		return results;
	}

	static async getChapters(hostId, mangaLink) {
		switch (hostId) {
			case MangaHere.id:
				return await MangaHere.getChapters(mangaLink);
		}
	}

	static async getInfo(hostId, mangaLink) {
		switch (hostId) {
			case MangaHere.id:
				return await MangaHere.getInfo(mangaLink);
			case MangaPark.id:
				return await MangaPark.getInfo(mangaLink);
		}
	}

	static async getPages(hostId, chapterLink) {
		switch (hostId) {
			case MangaHere.id:
				return await MangaHere.getPages(chapterLink);
			case MangaPark.id:
				return await MangaPark.getPages(chapterLink);
		}
	}

	/**
	 * @param {string} hostId
	 * @param {string} pageLink
	 * @param {boolean} base64
	 * @return {object}
	 */
	static async getPageSrc(hostId, pageLink, base64) {
		switch (hostId) {
			case MangaHere.id:
				return await MangaHere.getPageSrc(pageLink, base64);
			case MangaPark.id:
				return await MangaPark.getPageSrc(pageLink, base64);
		}
	}
};
