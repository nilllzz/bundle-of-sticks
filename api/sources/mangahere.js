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
				const path = link.substr(link.indexOf('.cc/') + 3);

				results.push({
					name: title,
					link: path,
					host: MangaHere.hostInfo,
				});
			}
		}

		return results;
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
			const path = link.substr(link.indexOf('.cc/') + 3);

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
		const pageSelect = navitaionElement.children[2].children[1];
		const pageElements = pageSelect.getElementsByTagName('option');

		let num = 1;
		for (const pageElement of pageElements) {
			const title = pageElement.innerHTML.trim();
			const link = pageElement.getAttribute('value');
			const path = link.substr(link.indexOf('.cc/') + 3);

			pages.push({
				name: title,
				num: num,
				link: path,
				host: MangaHere.hostInfo,
			});

			num++;
		}

		return pages;
	}

	// returns the page's image as base 64
	static async getPageImage(pageLink) {
		const result = await HttpHelper.get(HOST, 80, pageLink);
		const dom = new JSDOM(result.body);

		const imgElement = dom.window.document.getElementById('image');
		const src = imgElement.getAttribute('src');

		const imgbase64 = await HttpHelper.getImageBase64(src);
		return imgbase64.body;
	}
};
