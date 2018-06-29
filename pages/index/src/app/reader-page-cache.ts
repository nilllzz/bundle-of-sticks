import Folder from './models/folder.model';
import Chapter from './models/chapter.model';

export default class ReaderPageCache {
	// clears all cached pages from this outline
	public static clearCache(outline: Folder[]) {
		let cachesCleared = 0;
		for (const folder of outline) {
			for (const volume of folder.volumes) {
				for (const chapter of volume.chapters) {
					if (chapter.pages) {
						for (const page of chapter.pages) {
							if (page.srcBase64) {
								page.srcBase64 = null;
								cachesCleared++;
							}
						}
					}
				}
			}
		}
		console.log('Caches cleared:', cachesCleared);
	}

	private static _cachingPages: string[] = [];

	public static async cacheChapter(chapter: Chapter, pageIndex: number) {
		// cache up to 3 pages forward
		for (let i = 0; i < 3; i++) {
			const index = pageIndex + i + 1;
			if (chapter.pages.length > index) {
				const page = chapter.pages[index];
				if (!page.srcBase64) {
					const url = page.getUrl();
					// make sure to not fetch twice
					if (!this._cachingPages.some(s => s === url)) {
						this._cachingPages.push(url);
						await page.loadSrcBase64();
						this._cachingPages = this._cachingPages.filter(s => s !== url);
					}
				}
			}
		}
	}
}
