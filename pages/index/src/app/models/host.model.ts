import BaseModel from './base.model';
import Providers from '../providers';

export default class Host extends BaseModel {
	url: string;
	id: string;

	public getProvider() {
		return Providers.getProvider(this.id);
	}
}

BaseModel.create(Host);
