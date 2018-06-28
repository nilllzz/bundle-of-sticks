import Manga from './models/manga.model';
import Page from './models/page.models';
import Chapter from './models/chapter.model';
import Volume from './models/volume.model';
import Folder from './models/folder.model';
import LocalState from './local-state';

type ReadingRecord = {
	manga: Manga;
	page: number;
	chapter: number;
	volume: number;
	folderId: string;

	date: number;
};

export default class ReadingRecords {
	private static buffer: ReadingRecord[] = null;

	private static loadBuffer() {
		if (!this.buffer) {
			this.buffer = LocalState.readDefault('reading-records', []);
		}
	}

	private static writeBuffer() {
		LocalState.write('reading-records', this.buffer);
	}

	public static track(
		manga: Manga,
		pageIndex: number,
		chapter: Chapter,
		volume: Volume,
		folder: Folder
	) {
		this.loadBuffer();

		const record = {
			manga: manga,
			page: pageIndex,
			chapter: chapter.number,
			volume: volume.number,
			folderId: folder.getId(),
			date: Date.now(),
		};

		const currentRecord = this.read(manga);
		// remove current record if one exists
		if (currentRecord) {
			this.buffer = this.buffer.filter(r => new Manga(r.manga).getId() !== manga.getId());
		}
		this.buffer.push(record);
		this.writeBuffer();
	}

	public static read(manga: Manga): ReadingRecord {
		this.loadBuffer();
		return this.buffer.find(r => new Manga(r.manga).getId() === manga.getId());
	}
}
