import BaseModel from './base.model';

export default class Host extends BaseModel {
	url: string;
	id: string;
}

BaseModel.create(Host);
