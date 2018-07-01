import BaseModel from './base.model';
import Host from './host.model';
import Page from './page.models';
import { Api } from '../api';

export default class Chapter extends BaseModel {
	name: string;
	number: number;
	date: number;
	link: string;

	pages?: Page[];
	host: Host;

	constructor(data: any = {}) {
		super(data);

		if (data.host) {
			this.host = new Host(data.host);
		}
		if (data.pages) {
			this.pages = Page.populate(data.pages);
		}
	}

	public async loadPages() {
		if (!this.pages) {
			const result = await Api.getRequest('/api/manga/pages', {
				host: this.host.id,
				chapter: this.link,
			});
			if (!result.success) {
				return false;
			}
			this.pages = Page.populate(result.data);
		}
		return true;
	}
}

BaseModel.create(Chapter);
