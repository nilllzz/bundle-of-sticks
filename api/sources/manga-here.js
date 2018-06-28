const HttpHelper = require('../http-helper');
const { JSDOM } = require('jsdom');

const HOST = 'www.mangahere.cc';
const ID = 'mangaherecc';

module.exports = class MangaHere {
	static get id() {
		return ID;
	}

	static get hostInfo() {
		return {
			url: HOST,
			id: ID,
		};
	}

	static getPathFromLink(link) {
		return link.substr(link.indexOf('.cc/') + 3);
	}

	static async search(query) {
		const result = await HttpHelper.get(HOST, 80, '/search.php?name=' + query);
		const results = [];

		let body = result.body + '';
		if (body.includes('<div class="result_search">')) {
			const dom = new JSDOM(body);
			const elements = dom.window.document.getElementsByClassName('name_one');

			for (const element of elements) {
				const title = element.innerHTML.trim();
				const link = element.getAttribute('href');
				const path = this.getPathFromLink(link);

				results.push({
					name: title,
					link: path,
					host: MangaHere.hostInfo,
				});
			}
		}

		return results;
	}

	static async getInfo(mangaLink) {
		const result = await HttpHelper.get(HOST, 80, mangaLink);
		const dom = new JSDOM(result.body);

		const contentSection = dom.window.document.getElementById('main');
		const title = contentSection.getElementsByClassName('title')[0].textContent;
		// return manga info too
		const manga = {
			name: title,
			link: mangaLink,
			host: MangaHere.hostInfo,
		};

		const info = {
			manga: manga,
			coverImg: null,
			rating: -1,
			artists: null,
			authors: null,
			completionStatus: null,
			genres: null,
			summary: null,
			folders: null,
			nsfw: false,
			unavailable: false,
		};

		// cover img src
		const imgElement = contentSection.getElementsByTagName('img')[0];
		info.coverImg = imgElement.getAttribute('src');

		// rating
		const ratingContainer = dom.window.document.getElementById('current_rating');
		const ratingText = ratingContainer.textContent;
		if (ratingText) {
			info.rating = Math.min(Number.parseFloat(ratingText) / 5, 1);
		}

		// summary
		const summaryContainer = dom.window.document.getElementById('show');
		if (summaryContainer) {
			let summary = summaryContainer.textContent.trim();
			if (summary.endsWith('Show less')) {
				summary = summary.substring(0, summary.length - 10);
			}
			if (summary.length > 0) {
				info.summary = summary;
			}
		}

		// get: authors, artists, completion status, genres
		const detailContainer = contentSection.getElementsByClassName('detail_topText')[0];
		for (const li of detailContainer.children) {
			if (li.children.length >= 1 && li.children[0].nodeName === 'LABEL') {
				const labelText = li.children[0].textContent;
				switch (labelText) {
					case 'Artist(s):':
						const artists = [];
						for (let i = 1; i < li.children.length; i++) {
							const artistElement = li.children[i];

							const name = artistElement.textContent;

							const link = artistElement.getAttribute('href');
							const path = this.getPathFromLink(link);

							artists.push({
								name: name,
								link: path,
								host: MangaHere.hostInfo,
							});
						}
						info.artists = artists;
						break;
					case 'Author(s):':
						const authors = [];
						for (let i = 1; i < li.children.length; i++) {
							const authorElement = li.children[i];

							const name = authorElement.textContent;

							const link = authorElement.getAttribute('href');
							const path = this.getPathFromLink(link);

							authors.push({
								name: name,
								link: path,
								host: MangaHere.hostInfo,
							});
						}
						info.authors = authors;
						break;
					case 'Status:':
						let statusText = li.textContent;
						statusText = statusText.substr(7); // cut away "Status:"
						// space used is the char at 160: non-breaking-space
						const space = String.fromCharCode(160);
						if (statusText.includes(space)) {
							statusText = statusText.substring(0, statusText.indexOf(space)); // cut away stuff after status str
						}
						info.completionStatus = statusText;
						break;
					case 'Genre(s):':
						let genreText = li.textContent;
						genreText = genreText.substr(9); // cut away "Genre(s):"
						const genres = genreText.split(',').map(g => g.trim());
						if (genres.length === 1 && genres[0] === 'None') {
							info.genres = [];
						} else {
							info.genres = genres;
						}
						break;
				}
			}
		}

		// tag 'Mature" accounts for nsfw, MangaHere doesn't have a seperate indicator
		if (info.genres && info.genres.includes('Mature')) {
			info.nsfw = true;
		}

		// get volumes
		const volumes = [];

		const chapterContainer = contentSection.getElementsByClassName('detail_list')[0];
		const chapterList = chapterContainer.getElementsByTagName('ul')[0];
		const chapterEntries = chapterList.getElementsByTagName('li');
		for (const chapterEntry of chapterEntries) {
			const chapterInfo = chapterEntry.children[0];
			// link
			const anchor = chapterInfo.children[0];
			const link = anchor.getAttribute('href');
			const path = this.getPathFromLink(link);
			// name
			let chapterName = chapterInfo.innerHTML.trim();
			chapterName = chapterName.substring(chapterName.lastIndexOf('>') + 1).trim();
			if (chapterName.length === 0) {
				chapterName = null;
			}
			// number
			let chapterNumberStr = chapterInfo.children[0].textContent.trim();
			chapterNumberStr = chapterNumberStr
				.substring(chapterNumberStr.lastIndexOf(' ') + 1)
				.trim();
			const chapterNumber = Number.parseFloat(chapterNumberStr);
			// date
			const dateContainer = chapterEntry.children[1];
			const date = new Date(dateContainer.innerHTML.trim()).getTime();

			const chapter = {
				name: chapterName,
				number: chapterNumber,
				date: date,
				link: path,
				host: MangaHere.hostInfo,
			};

			// volume
			let volumeNumberStr = chapterInfo.children[1].textContent.trim();
			let volumeNumber = -1; // used if a chapter doesn't belong to a volume

			if (volumeNumberStr !== '') {
				volumeNumberStr = volumeNumberStr
					.substring(volumeNumberStr.lastIndexOf(' '))
					.trim();
				volumeNumber = Number.parseFloat(volumeNumberStr);
			}

			let volume = volumes.find(v => v.number === volumeNumber);
			// create volume if it doesn't exist
			if (!volume) {
				volume = {
					number: volumeNumber,
					chapters: [],
				};
				volumes.push(volume);
			}
			// add chapter to volume
			volume.chapters.push(chapter);
		}

		// MangaHere doesn't have folders, put all volumes in a default folder
		const folder = { name: '[Main]', number: 1, volumes: volumes };
		info.folders = [folder];

		// mangas on MangaHere can get remove through licensing claims
		if (chapterContainer.children[0].className === 'mt10 color_ff00 mb10') {
			info.unavailable = true;
		}

		return info;
	}

	static async getChapters(mangaLink) {
		const result = await HttpHelper.get(HOST, 80, mangaLink);
		const chapters = [];

		const dom = new JSDOM(result.body);

		const container = dom.window.document.getElementsByClassName('detail_list')[0];
		const chapterul = container.children[1];
		const chapterContainers = chapterul.getElementsByTagName('li');
		for (const chapterContainer of chapterContainers) {
			const a = chapterContainer.children[0].children[0];
			const title = a.innerHTML.trim();
			const link = a.getAttribute('href');
			const path = this.getPathFromLink(link);

			const dateContainer = chapterContainer.children[1];
			const dateStr = dateContainer.innerHTML.trim();

			chapters.push({
				name: title,
				link: path,
				date: dateStr,
				host: MangaHere.hostInfo,
			});
		}

		// reverse chapters so that the first one appears on top
		chapters.reverse();

		return chapters;
	}

	static async getPages(chapterLink) {
		const result = await HttpHelper.get(HOST, 80, chapterLink);
		const pages = [];

		const dom = new JSDOM(result.body);
		const navitaionElement = dom.window.document.getElementsByClassName('go_page')[0];
		const pageSelect = navitaionElement
			.getElementsByClassName('right')[0]
			.getElementsByTagName('select')[0];
		const pageElements = pageSelect.getElementsByTagName('option');

		let num = 1;
		for (const pageElement of pageElements) {
			const title = pageElement.innerHTML.trim();

			// manga here has this weird Featured page at the end of every chapter that's almost always empty
			// let's just ignore it
			if (title != 'Featured') {
				const link = pageElement.getAttribute('value');
				const path = this.getPathFromLink(link);

				pages.push({
					name: title,
					number: num,
					link: path,
					host: MangaHere.hostInfo,
				});

				num++;
			}
		}

		return pages;
	}

	/**
	 * @param {string} pageLink
	 * @param {boolean} base64
	 * @return {string}
	 */
	static async getPageSrc(pageLink, base64) {
		const result = await HttpHelper.get(HOST, 80, pageLink);
		const dom = new JSDOM(result.body);

		const imgElement = dom.window.document.getElementById('image');
		const src = imgElement.getAttribute('src');

		if (base64) {
			const imgbase64 = await HttpHelper.getImageBase64(src);
			return imgbase64;
		} else {
			return src;
		}
	}
};
