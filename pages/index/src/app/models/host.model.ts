import BaseModel from './base.model';
import Providers from '../providers';

export default class Host extends BaseModel {
	url: string;
	id: string;

	public getProvider() {
		return Providers.getProvider(this.id);
	}

	public getUrl() {
		if (
			!this.url.toLowerCase().startsWith('http://') &&
			!this.url.toLowerCase().startsWith('https://')
		) {
			return 'http://' + this.url;
		} else {
			return this.url;
		}
	}
}

BaseModel.create(Host);
