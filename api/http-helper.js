const Logger = require('./logger');

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
		Logger.info('api', 'Responsed to request');
	}

	static getCookieJar(cookies) {
		const cookieJar = [];
		for (const key of Object.keys(cookies)) {
			const value = cookies[key];
			const name = key;

			cookieJar.push(name + '=' + value);
		}
		const cookie = cookieJar.join('; ').trim();
		return cookie;
	}

	static async get(host, port, path, cookies = {}) {
		const http = port == 443 ? require('https') : require('http');

		if (host.startsWith('http://')) {
			host = host.substring(7);
		}

		const cookie = this.getCookieJar(cookies);

		const options = {
			host: host,
			port: port,
			path: path,
			headers: {
				Cookie: cookie,
			},
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

	/**
	 * @param {string} src
	 * @return {string}
	 */
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

		// add base 64 extension
		let extension = 'tiff';
		if (src.toLowerCase().endsWith('.jpeg') || src.toLowerCase().endsWith('.jpg')) {
			extension = 'jpeg';
		} else if (src.toLowerCase().endsWith('.png')) {
			extension = 'png';
		}
		const base64 = 'data:image/' + extension + ';base64, ' + result.body;
		return base64;
	}

	static async getImageBase64Options(host, port, path, cookies = {}) {
		const http = port == 443 ? require('https') : require('http');

		if (host.startsWith('http://')) {
			host = host.substring(7);
		}

		const cookie = this.getCookieJar(cookies);

		const options = {
			host: host,
			port: port,
			path: path,
			headers: {
				Cookie: cookie,
			},
		};

		const result = await new Promise(function(resolve, reject) {
			http.get(options, res => {
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

		// add base 64 extension
		let extension = 'tiff';
		if (path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.jpg')) {
			extension = 'jpeg';
		} else if (path.toLowerCase().endsWith('.png')) {
			extension = 'png';
		}
		const base64 = 'data:image/' + extension + ';base64, ' + result.body;
		return base64;
	}
};
