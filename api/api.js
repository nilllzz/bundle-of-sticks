const HttpHelper = require('./http-helper');
const SourceHelper = require('./sources/source-helper');
const ApiCache = require('./api-cache');
const Logger = require('./logger');

module.exports = function defineApi(expressApp) {
	defineSearch(expressApp);
	defineChapters(expressApp);
	defineInfo(expressApp);
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
			cache = ApiCache.cacheRequest(request, 'search', results);
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

		const chapters = await SourceHelper.getChapters(hostId, mangaLink);
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
			cache = ApiCache.cacheRequest(request, 'manga/info', info);
		}

		HttpHelper.respond(response, 200, cache);
	});
}
