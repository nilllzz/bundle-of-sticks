export type ApiResponse = {
	success: boolean;
	code: number;
	data: any;
};

export class Api {
	public static async getRequest(url: string, params: any = null): Promise<ApiResponse> {
		let getUrl = url;

		// construct url from get params
		if (params) {
			let num = 0;
			for (const key of Object.keys(params)) {
				const separator = num === 0 ? '?' : '&';
				getUrl += separator;

				const param = params[key];
				getUrl += key + '=';

				if (typeof param === 'string') {
					getUrl += encodeURIComponent(param);
				} else {
					const jsonVal = JSON.stringify(param);
					getUrl += encodeURIComponent(jsonVal);
				}

				num++;
			}
		}

		return this.sendRequest(getUrl);
	}

	public static async sendRequest(url: string): Promise<ApiResponse> {
		return new Promise<ApiResponse>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			// terminate the request after 15 seconds
			const timeoutHandle = setTimeout(() => {
				console.error('Api request timed out');
				resolve({ success: false, code: 503, data: { message: 'timeout' } });
			}, 20000);

			xhr.onload = e => {
				clearTimeout(timeoutHandle);
				const response = JSON.parse(xhr.responseText.replace(/&amp;/g, '&'));
				if (!response.success) {
					console.error('Api request returned error');
				}
				resolve(response);
			};
			xhr.open('GET', url);
			xhr.send();
		});
	}
}
