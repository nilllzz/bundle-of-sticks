import BaseModel from './base.model';
import Host from './host.model';

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
