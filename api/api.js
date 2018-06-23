module.exports = function defineApi(expressApp) {
	// search
	const searchFunc = require('./search');
	expressApp.get('/api/search', async function(request, response) {
		if (!request.query || !request.query.q) {
			// no query? send empty results
			response.send(getHttpResponse(200, []));
			return;
		}
		const query = request.query.q;

		const results = await searchFunc(query);
		response.send(getHttpResponse(200, results));
	});
};

function getHttpResponse(code, obj) {
	let success = false;
	if (code >= 200 && code < 300) {
		success = true;
	}
	return {
		success: success,
		code: code,
		data: obj,
	};
}
