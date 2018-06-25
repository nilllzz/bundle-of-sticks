import LocalState from './local-state';
import Manga from './models/manga.model';

export type Bookmark = {
	name: string;
	type: string;
	target: string;
	dateAdded: number;
};

export default class Bookmarks {
	static readonly TYPE_SEARCH = 'search';
	static readonly TYPE_MANGA = 'manga';

	private static bookmarksBuffer: Bookmark[] = null;

	private static compareBookmarks(b1: Bookmark, b2: Bookmark) {
		return b1.target.toLowerCase() === b2.target.toLowerCase();
	}

	public static getBookmarks(typeFilter = ''): Bookmark[] {
		if (this.bookmarksBuffer === null) {
			this.bookmarksBuffer = LocalState.readDefault('bookmarks', []) as Bookmark[];
		}

		if (!typeFilter) {
			return this.bookmarksBuffer.filter(b => b.type === typeFilter);
		} else {
			return this.bookmarksBuffer;
		}
	}

	private static saveBookmarks() {
		this.getBookmarks(); // make sure it's loaded
		LocalState.write('bookmarks', this.bookmarksBuffer);
	}

	public static addBookmark(bookmark: Bookmark) {
		this.getBookmarks(); // make sure it's loaded
		this.bookmarksBuffer.push(bookmark);
		this.saveBookmarks();
	}

	public static removeBookmark(bookmark: Bookmark) {
		this.getBookmarks(); // make sure it's loaded
		this.bookmarksBuffer = this.bookmarksBuffer.filter(
			b => !this.compareBookmarks(b, bookmark)
		);
		this.saveBookmarks();
	}

	public static hasBookmark(bookmark: Bookmark) {
		return this.getBookmarks(bookmark.type).some(b => this.compareBookmarks(b, bookmark));
	}

	public static createManga(manga: Manga): Bookmark {
		return {
			name: manga.name,
			type: this.TYPE_MANGA,
			target: manga.getUrl(),
			dateAdded: Date.now(),
		};
	}

	public static createSearch(query: string): Bookmark {
		return {
			name: query,
			type: this.TYPE_SEARCH,
			target: '/search?query=' + query,
			dateAdded: Date.now(),
		};
	}
}
