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
			const result = await Api.getRequest('/api/manga/page/src', {
				host: this.host.id,
				page: this.link,
			});
			if (result.success) {
				this.src = result.data;
			}
		}
	}

	public async loadSrcBase64() {
		if (!this.srcBase64) {
			const result = await Api.getRequest('/api/manga/page/src', {
				host: this.host.id,
				page: this.link,
				base64: true,
			});
			if (result.success) {
				this.srcBase64 = result.data;
			}
		}
	}

	public getUrl() {
		return this.host.getUrl() + this.link;
	}
}

BaseModel.create(Page);
