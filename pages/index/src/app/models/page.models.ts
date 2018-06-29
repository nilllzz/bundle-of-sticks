import BaseModel from './base.model';
import Host from './host.model';
import { Api } from '../api';

export default class Page extends BaseModel {
	name: string;
	number: number;
	link: string;
	src?: string;
	srcBase64?: string;

	host: Host;

	constructor(data: any = {}) {
		super(data);

		if (data.host) {
			this.host = new Host(data.host);
		}
	}

	public async loadSrc() {
		if (!this.src) {
			await this.fetchSrc(false);
		}
	}

	public async loadSrcBase64() {
		if (!this.srcBase64) {
			await this.fetchSrc(true);
		}
	}

	private async fetchSrc(base64: boolean) {
		const result = await Api.getRequest('/api/manga/page/src', {
			host: this.host.id,
			page: this.link,
			base64: base64,
		});
		if (result.success) {
			if (result.data.src) {
				this.src = result.data.src;
			}
			if (result.data.srcBase64) {
				this.srcBase64 = result.data.srcBase64;
			}
		}
	}

	public getUrl() {
		return this.host.getUrl() + this.link;
	}
}

BaseModel.create(Page);
