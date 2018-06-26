module.exports = class HttpHelper {
	static respond(response, code, data = '') {
		let success = false;
		if (code >= 200 && code < 300) {
			success = true;
		}
		const payload = {
			success: success,
			code: code,
			data: data,
		};
		response.send(payload);
	}

	static async get(host, port, path) {
		const http = port == 443 ? require('https') : require('http');

		if (host.startsWith('http://')) {
			host = host.substring(7);
		}

		const options = {
			host: host,
			port: port,
			path: path,
		};

		const result = await new Promise(function(resolve, reject) {
			http.get(options, res => {
				res.on('error', () => {
					reject({
						status: res.statusCode,
					});
				});

				let body = '';
				res.on('data', chunk => {
					body += chunk.toString();
				});
				res.on('end', () => {
					resolve({
						status: res.statusCode,
						body: body,
					});
				});
			});
		});

		return result;
	}

	static async getImageBase64(src) {
		const http = src.startsWith('https://') ? require('https') : require('http');

		const result = await new Promise(function(resolve, reject) {
			http.get(src, res => {
				res.on('error', () => {
					reject({
						status: res.statusCode,
					});
				});

				let chunks = [];
				res.on('data', chunk => {
					chunks.push(chunk);
				});
				res.on('end', () => {
					const buffer = Buffer.concat(chunks);
					const base64 = buffer.toString('base64');
					resolve({
						status: res.statusCode,
						body: base64,
					});
				});
			});
		});

		return result;
	}
};
