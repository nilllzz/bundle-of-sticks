import BaseModel from './base.model';
import Manga from './manga.model';
import Artist from './artist.model';
import Author from './author.model';

export default class Info extends BaseModel {
	coverImg: string;
	completionStatus: string;
	summary: string;
	rating: number;
	genres: string[];

	artists: Artist[];
	authors: Author[];
	manga: Manga;

	constructor(data: any = {}) {
		super(data);

		if (data.manga) {
			this.manga = new Manga(data.manga);
		}
		if (data.artists) {
			this.artists = Artist.populate(data.artists);
		}
		if (data.authors) {
			this.authors = Author.populate(data.authors);
		}
	}
}

BaseModel.create(Info);
