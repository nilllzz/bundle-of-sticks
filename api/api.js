const HttpHelper = require('./http-helper');
const SourceHelper = require('./sources/source-helper');
const ApiCache = require('./api-cache');
const Logger = require('./logger');
const TimeHelper = require('./time-helper');

module.exports = function defineApi(expressApp) {
	defineSearch(expressApp);
	defineChapters(expressApp);
	defineInfo(expressApp);
	definePages(expressApp);
	definePageSrc(expressApp);
};

function requireQueryParams(request, params) {
	if (request.query === undefined) {
		return false;
	}
	for (const param of params) {
		if (request.query[param] === undefined) {
			return false;
		}
	}
	return true;
}

function defineSearch(expressApp) {
	expressApp.get('/api/search', async function(request, response) {
		Logger.info('api', 'Open api at /api/search');

		if (!requireQueryParams(request, ['q'])) {
			// no query? send empty results
			HttpHelper.respond(response, 200, []);
			return;
		}

		let cache = ApiCache.getCache(request, 'search');
		if (cache === false) {
			const query = encodeURIComponent(request.query.q);
			let providers = request.query.providers;
			if (providers !== undefined) {
				if (providers.length === 0) {
					providers = undefined;
				} else {
					providers = providers.split(',');
				}
			}

			const results = await SourceHelper.search(query, providers);
			cache = ApiCache.cacheRequest(request, 'search', results, TimeHelper.minutes(10));
		}

		HttpHelper.respond(response, 200, cache);
	});
}

function defineChapters(expressApp) {
	expressApp.get('/api/manga/chapters', async function(request, response) {
		Logger.info('api', 'Open api at /api/manga/chapters');

		if (!requireQueryParams(request, ['host', 'manga'])) {
			HttpHelper.respond(response, 400);
			return;
		}

		const hostId = decodeURIComponent(request.query.host);
		const mangaLink = decodeURIComponent(request.query.manga);

		const chapters = await SourceHelper.getChapters(hostId, mangaLink, TimeHelper.hours(1));
		HttpHelper.respond(response, 200, chapters);
	});
}

function defineInfo(expressApp) {
	expressApp.get('/api/manga/info', async function(request, response) {
		Logger.info('api', 'Open api at /api/manga/info');

		if (!requireQueryParams(request, ['host', 'manga'])) {
			HttpHelper.respond(response, 400);
			return;
		}

		let cache = ApiCache.getCache(request, 'manga/info');
		if (cache === false) {
			const hostId = decodeURIComponent(request.query.host);
			const mangaLink = decodeURIComponent(request.query.manga);

			const info = await SourceHelper.getInfo(hostId, mangaLink);
			cache = ApiCache.cacheRequest(request, 'manga/info', info, TimeHelper.hours(1));
		}

		HttpHelper.respond(response, 200, cache);
	});
}

function definePages(expressApp) {
	expressApp.get('/api/manga/pages', async function(request, response) {
		Logger.info('api', 'Open api at /api/manga/pages');

		if (!requireQueryParams(request, ['host', 'chapter'])) {
			HttpHelper.respond(response, 400);
			return;
		}

		let cache = ApiCache.getCache(request, 'manga/pages');
		if (cache === false) {
			const hostId = decodeURIComponent(request.query.host);
			const chapterLink = decodeURIComponent(request.query.chapter);

			const info = await SourceHelper.getPages(hostId, chapterLink);
			cache = ApiCache.cacheRequest(request, 'manga/pages', info, TimeHelper.hours(1));
		}

		HttpHelper.respond(response, 200, cache);
	});
}

function definePageSrc(expressApp) {
	expressApp.get('/api/manga/page/src', async function(request, response) {
		Logger.info('api', 'Open api at /api/manga/page/src');

		if (!requireQueryParams(request, ['host', 'page'])) {
			HttpHelper.respond(response, 400);
			return;
		}

		let cache = ApiCache.getCache(request, 'manga/page/src');
		if (cache === false) {
			const hostId = decodeURIComponent(request.query.host);
			const pageLink = decodeURIComponent(request.query.page);

			// if the base64 image data should be returned instead of the path to the image
			const base64 = !!request.query.base64;

			try {
				const src = await SourceHelper.getPageSrc(hostId, pageLink, base64);
				cache = ApiCache.cacheRequest(request, 'manga/page/src', src, TimeHelper.hours(1));
			} catch (e) {
				Logger.error('api', e);
				HttpHelper.respond(response, 500);
			}
		}

		HttpHelper.respond(response, 200, cache);
	});
}
