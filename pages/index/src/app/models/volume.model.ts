import BaseModel from './base.model';
import Chapter from './chapter.model';

export default class Volume extends BaseModel {
	number: number;

	chapters: Chapter[];

	constructor(data: any = {}) {
		super(data);

		if (data.chapters) {
			this.chapters = Chapter.populate(data.chapters);
		}
	}
}

BaseModel.create(Volume);
