const HttpHelper = require('../http-helper');
const { JSDOM } = require('jsdom');

const HOST = 'exhentai.org';
const ID = 'exhentai';

module.exports = class Exhentai {
	static get id() {
		return ID;
	}

	static get hostInfo() {
		return {
			url: HOST,
			id: ID,
		};
	}

	// cookies here

	static getPathFromLink(link) {
		return link.substr(link.indexOf('.org/') + 4);
	}

	/**
	 * @param {string} title
	 * @return {string}
	 */
	static stripSquareBrackets(title) {
		while (
			title.includes('[') &&
			title.includes(']') &&
			title.indexOf('[') < title.indexOf(']')
		) {
			const startIndex = title.indexOf('[');
			const endIndex = title.indexOf(']');
			if (startIndex === 0) {
				title = title.substr(endIndex + 1);
			} else if (endIndex === title.length - 1) {
				title = title.substr(0, startIndex);
			} else {
				title = title.substr(0, startIndex) + title.substr(endIndex + 1);
			}
		}
		return title.trim();
	}

	static async search(query) {
		const result = await HttpHelper.get(
			HOST,
			443,
			'/?f_doujinshi=1&f_manga=1&f_search=' + query,
			this.cookies
		);

		const results = [];
		const dom = new JSDOM(result.body);

		const resultsTable = dom.window.document.getElementsByClassName('itg')[0];
		const tableBody = resultsTable.children[0];
		for (const tableEntry of tableBody.children) {
			if (tableEntry.className.startsWith('gtr')) {
				const infoElement = tableEntry.children[2].children[0].children[2];
				const anchorElement = infoElement.children[0];

				const title = anchorElement.textContent;
				const link = anchorElement.getAttribute('href');
				const path = this.getPathFromLink(link);

				results.push({
					name: title,
					link: path,
					host: Exhentai.hostInfo,
				});
			}
		}

		return results;
	}

	static async getInfo(mangaLink) {
		const result = await HttpHelper.get(HOST, 443, mangaLink, this.cookies);
		const dom = new JSDOM(result.body);

		const titleElement = dom.window.document.getElementById('gn');
		const manga = {
			name: this.stripSquareBrackets(titleElement.textContent.trim()),
			link: mangaLink,
			host: this.hostInfo,
		};

		// need to download the cover image and store it as base64
		// exhentai uses their cookie restrictions on their cache server as well
		const imageContainer = dom.window.document.getElementById('gd1');
		// img source is embedded in the inline style
		let coverImgUrl = imageContainer.innerHTML;
		coverImgUrl = coverImgUrl.substr(coverImgUrl.indexOf('url(') + 4);
		coverImgUrl = coverImgUrl.substr(0, coverImgUrl.indexOf(')'));
		const coverImgPath = this.getPathFromLink(coverImgUrl);
		const coverImgBase64 = await HttpHelper.getImageBase64Options(
			HOST,
			443,
			coverImgPath,
			this.cookies
		);

		// rating
		const ratingLabel = dom.window.document.getElementById('rating_label');
		let ratingText = ratingLabel.textContent;
		ratingText = ratingText.substr(ratingText.lastIndexOf(':') + 1).trim();
		const ratingNum = Number.parseFloat(ratingText) / 5;

		const info = {
			manga: manga,
			coverImg: coverImgBase64,
			rating: ratingNum,
			artists: null,
			genres: null,
			nsfw: true,
			summary: null, // no summary
			completionStatus: null, // no completion status
			authors: null, // no authors (only artists)
		};

		// artists and genres
		const tagList = dom.window.document.getElementById('taglist');
		const tagTable = tagList.children[0].children[0];
		for (const tagContainer of tagTable.children) {
			const heading = tagContainer.children[0].textContent.trim();
			const tagContent = tagContainer.children[1];
			switch (heading) {
				case 'artist:':
					const artists = [];

					for (const artistElement of tagContent.children) {
						const artistAnchor = artistElement.children[0];
						const name = artistAnchor.textContent;
						const link = artistAnchor.getAttribute('href');
						const path = this.getPathFromLink(link);

						artists.push({
							name: name,
							link: path,
							host: this.hostInfo,
						});
					}

					info.artists = artists;
					break;
				case 'male:':
				case 'female:':
				case 'misc:':
					let genres = info.genres;
					if (genres === null) {
						genres = [];
					}

					for (const genreElement of tagContent.children) {
						const genreAnchor = genreElement.children[0];
						const genre = genreAnchor.textContent;
						if (!genres.includes(genre)) {
							genres.push(genre);
						}
					}

					info.genres = genres;
					break;
			}
		}

		// chapters
		// exhentai doesn't have folders, volumes or chapters, it just offers a list of pages
		// however, by default, all pages are divided into chunks of up to 40 pages
		// those chunks will be used as chapters

		const chapters = [];
		const chunkTable = dom.window.document.getElementsByClassName('ptt')[0];
		const chunkContainer = chunkTable.children[0].children[0];

		// ignore left and right arrows (start at 1, end 1 earlier)
		for (let i = 1; i < chunkContainer.children.length - 1; i++) {
			const chunkElement = chunkContainer.children[i];
			const chunkAnchor = chunkElement.children[0];

			const chunkNumber = Number.parseInt(chunkAnchor.textContent.trim());
			const link = chunkAnchor.getAttribute('href');
			const path = this.getPathFromLink(link);

			// reverse order
			chapters.unshift({
				name: null,
				number: chunkNumber,
				date: null,
				link: path,
				host: this.hostInfo,
			});
		}

		// no volumes or folders
		const volume = {
			number: -1,
			chapters: chapters,
		};
		const folder = {
			name: '[Main]',
			number: 1,
			volumes: [volume],
		};
		info.folders = [folder];

		return info;
	}

	static async getPages(chapterLink) {
		const result = await HttpHelper.get(HOST, 443, chapterLink, this.cookies);
		const pages = [];

		const dom = new JSDOM(result.body);
		const pagesContainer = dom.window.document.getElementById('gdt');
		const pageElements = pagesContainer.getElementsByClassName('gdtm');
		let num = 1;
		for (const pageElement of pageElements) {
			const pageAnchor = pageElement.children[0].children[0];

			const link = pageAnchor.getAttribute('href');
			const path = this.getPathFromLink(link);

			pages.push({
				name: num.toString(),
				number: num,
				link: path,
				host: this.hostInfo,
			});

			num++;
		}

		return pages;
	}

	/**
	 * @param {string} pageLink
	 * @param {boolean} base64
	 * @return {object}
	 */
	static async getPageSrc(pageLink, base64) {
		const result = await HttpHelper.get(HOST, 443, pageLink, this.cookies);
		const dom = new JSDOM(result.body);

		const imgElement = dom.window.document.getElementById('img');
		const src = imgElement.getAttribute('src');

		let srcBase64 = null;
		if (base64) {
			const imgbase64 = await HttpHelper.getImageBase64(src);
			srcBase64 = imgbase64;
		}
		return { srcBase64: srcBase64, src: src };
	}
};
