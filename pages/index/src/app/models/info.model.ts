import BaseModel from './base.model';
import Manga from './manga.model';
import Artist from './artist.model';
import Author from './author.model';
import Folder from './folder.model';

export default class Info extends BaseModel {
	coverImg: string;
	completionStatus: string;
	summary: string;
	rating: number;
	genres: string[];
	nsfw: boolean;
	unavailable: boolean;

	artists: Artist[];
	authors: Author[];
	manga: Manga;
	folders: Folder[];

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
		if (data.folders) {
			this.folders = Folder.populate(data.folders);
		}
	}
}

BaseModel.create(Info);
