const mangaHere = require('./sources/mangahere');

/**
 * Search returns manga results from various pages
 * each result has: source, name, link
 */

module.exports = async function search(query) {
	let results = [];
	results = results.concat(await mangaHere.search(query));

	const manga = results[0];
	const chapters = await mangaHere.getChapters(manga.link);
	results[0].chapters = chapters;
	const pageLink = results[0].chapters[0].pages[0].link;
	const img = await mangaHere.getPageImage(pageLink);
	results[0].chapters[0].pages[0].img = img;

	return results;
};
