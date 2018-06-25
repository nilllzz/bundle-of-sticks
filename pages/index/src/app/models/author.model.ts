import BaseModel from './base.model';
import Host from './host.model';

export default class Author extends BaseModel {
	name: string;
	link: string;

	host: Host;

	constructor(data: any = {}) {
		super(data);

		if (data.host) {
			this.host = new Host(data.host);
		}
	}

	public getUrl() {
		return '/author/' + encodeURIComponent(this.link);
	}
}

BaseModel.create(Author);
