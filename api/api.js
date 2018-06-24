const HttpHelper = require('./http-helper');
const SourceHelper = require('./sources/source-helper');

module.exports = function defineApi(expressApp) {
	defineSearch(expressApp);
	defineChapters(expressApp);
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
		if (!requireQueryParams(request, ['q'])) {
			// no query? send empty results
			HttpHelper.respond(response, 200, []);
			return;
		}
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
		HttpHelper.respond(response, 200, results);
	});
}

function defineChapters(expressApp) {
	expressApp.get('/api/manga/chapters', async function(request, response) {
		if (!requireQueryParams(request, ['host', 'manga'])) {
			HttpHelper.respond(response, 200, []);
			return;
		}

		const hostId = decodeURIComponent(request.query.host);
		const mangaLink = decodeURIComponent(request.query.manga);

		const chapters = await SourceHelper.getChapters(hostId, mangaLink);
		HttpHelper.respond(response, 200, chapters);
	});
}
