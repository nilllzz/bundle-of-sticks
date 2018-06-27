import BaseModel from './base.model';
import Volume from './volume.model';

export default class Folder extends BaseModel {
	language: string;

	volumes: Volume[];

	constructor(data: any = {}) {
		super(data);

		if (data.volumes) {
			this.volumes = Volume.populate(data.volumes);
		}
	}
}

BaseModel.create(Folder);
