import BaseModel from './base.model';
import Host from './host.model';
import Info from './info.model';
import { Api } from '../api';

export default class Manga extends BaseModel {
	name: string;
	link: string;
	hot?: boolean;

	host: Host;

	constructor(data: any = {}) {
		super(data);

		if (data.host) {
			this.host = new Host(data.host);
		}
	}

	public static async fetchInfo(providerId: string, mangaLink: string) {
		const response = await Api.getRequest('/api/manga/info', {
			host: providerId,
			manga: mangaLink,
		});
		if (!response.success) {
			return null;
		} else {
			const info = new Info(response.data);
			return info;
		}
	}

	public getUrl() {
		return '/manga/' + this.host.getProvider().id + '/' + encodeURIComponent(this.link);
	}

	public getExternalLink() {
		return this.host.getUrl() + this.link;
	}

	public getId() {
		return this.host.id + '|' + this.link;
	}
}

BaseModel.create(Manga);
