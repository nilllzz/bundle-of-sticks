import BaseModel from './base.model';
import Volume from './volume.model';

export default class Folder extends BaseModel {
	number: number;
	name: string;
	language: string = 'en'; // default language is english

	volumes: Volume[];

	constructor(data: any = {}) {
		super(data);

		if (data.volumes) {
			this.volumes = Volume.populate(data.volumes);
		}
	}

	public getId() {
		return this.name.toLowerCase();
	}
}

BaseModel.create(Folder);
