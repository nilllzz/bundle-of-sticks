import BaseModel from './base.model';
import Manga from './manga.model';
import Artist from './artist.model';
import Author from './author.model';
import Folder from './folder.model';
import ModelCache from './model-cache';
import { Api } from '../api';

const modelCache = new ModelCache<Info>();

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

	public static async fetch(providerId: string, mangaLink: string) {
		const modelId = 'info/' + providerId + '/' + mangaLink;
		if (modelCache.hasEntry(modelId)) {
			return modelCache.getEntry(modelId);
		}

		const response = await Api.getRequest('/api/manga/info', {
			host: providerId,
			manga: mangaLink,
		});
		if (!response.success) {
			return null;
		} else {
			const info = new Info(response.data);
			modelCache.addEntry(modelId, info);
			return info;
		}
	}

}

BaseModel.create(Info);
