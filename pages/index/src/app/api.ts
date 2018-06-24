export type ApiResponse = {
	success: boolean;
	code: number;
	data: any;
};

export class Api {
	public static async getRequest(url: string, params: any = null): Promise<ApiResponse> {
		let getUrl = url;

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
			var xhr = new XMLHttpRequest();

			xhr.onload = e => {
				const response = JSON.parse(xhr.responseText);
				resolve(response);
			};
			console.log('Api request to', url);
			xhr.open('GET', url);
			xhr.send();
		});
	}
}
