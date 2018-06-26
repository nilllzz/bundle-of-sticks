const HttpHelper = require('../http-helper');
const { JSDOM } = require('jsdom');

const HOST = 'mangapark.me';
const ID = 'mangaparkme';

module.exports = class MangaPark {
	static get id() {
		return ID;
	}

	static get hostInfo() {
		return {
			url: HOST,
			id: ID,
		};
	}

	static async search(query) {
		const result = await HttpHelper.get(HOST, 443, '/search?q=' + query);
		const results = [];

		const dom = new JSDOM(result.body);
		const elements = dom.window.document.getElementsByClassName('item');
		for (const element of elements) {
			let isHot = false;
			if (element.classList.contains('hot')) {
				isHot = true;
			}

			// navigate to the title:
			// <table><tbody><tr>2:<td><h2><a>
			const titleElement =
				element.children[0].children[1].children[0].children[1].children[0].children[1]; // table // tbody // tr // td // h2 // a
			const title = titleElement.textContent.trim();
			const link = titleElement.href;

			results.push({
				name: title,
				link: link,
				hot: isHot,
				host: MangaPark.hostInfo,
			});
		}

		return results;
	}

	static async getInfo(mangaLink) {
		const result = await HttpHelper.get(HOST, 443, mangaLink);
		const dom = new JSDOM(result.body);

		const contentSection = dom.window.document
			.getElementsByClassName('manga')[0]
			.getElementsByClassName('content')[0];

		// title
		const titleElement = contentSection.getElementsByClassName('hd')[0].children[0].children[0];
		let title = titleElement.textContent;
		// ends with "Manga", remove
		if (title.endsWith(' Manga')) {
			title = title.substring(0, title.indexOf(' Manga'));
		}
		const link = titleElement.getAttribute('href');
		const manga = {
			name: title,
			link: link,
			host: MangaPark.hostInfo,
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
			nsfw: false,
		};

		// cover img src
		const imgElement = contentSection.getElementsByClassName('cover')[0].children[0];
		const src = 'https:' + imgElement.getAttribute('src');
		if (src !== 'https://static.mangapark.me/img/no-cover.jpg') {
			info.coverImg = src;
		}

		// rating
		const rating =
			Number.parseFloat(dom.window.document.getElementById('rating').textContent.trim()) / 10;
		if (rating > 0) {
			info.rating = rating;
		}

		// summary
		const summaryElements = contentSection.getElementsByClassName('summary');
		if (summaryElements.length > 0) {
			const summary = summaryElements[0].textContent.trim();
			if (summary) {
				info.summary = summary;
			}
		}

		// nsfw?
		const warningElements = contentSection.getElementsByClassName('warning');
		info.nsfw = warningElements.length > 0;

		const infoTable = contentSection.getElementsByClassName('attr')[0].children[1];
		for (const row of infoTable.children) {
			const header = row.children[0].textContent.trim();
			const content = row.children[1];
			switch (header) {
				case 'Author(s)':
					const authors = [];
					for (const anchorElement of content.getElementsByTagName('a')) {
						const name = anchorElement.textContent.trim();
						const link = anchorElement.getAttribute('href');

						if (name && link) {
							authors.push({
								name: name,
								link: link,
								host: MangaPark.hostInfo,
							});
						}
					}
					info.authors = authors;
					break;
				case 'Artist(s)':
					const artists = [];
					for (const anchorElement of content.getElementsByTagName('a')) {
						const name = anchorElement.textContent.trim();
						const link = anchorElement.getAttribute('href');

						if (name && link) {
							artists.push({
								name: name,
								link: link,
								host: MangaPark.hostInfo,
							});
						}
					}
					info.artists = artists;
					break;
				case 'Genre(s)':
					const genres = [];
					for (const anchorElement of content.getElementsByTagName('a')) {
						const genre = anchorElement.textContent.trim();
						if (genre) {
							genres.push(genre);
						}
					}
					info.genres = genres;
					break;
				case 'Status':
					const status = content.textContent.trim();
					if (status) {
						info.completionStatus = status;
					}
					break;
			}
		}

		return info;
	}
};
