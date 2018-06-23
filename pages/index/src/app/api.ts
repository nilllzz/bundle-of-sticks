export type ApiResponse = {
	success: boolean;
	code: number;
	data: any;
};

export class Api {
	public static async sendRequest(url: string): Promise<ApiResponse> {
		return new Promise<ApiResponse>((resolve, reject) => {
			var xhr = new XMLHttpRequest();

			xhr.onload = e => {
				const response = JSON.parse(xhr.responseText);
				resolve(response);
			};
			xhr.open('GET', url);
			xhr.send();
		});
	}
}
