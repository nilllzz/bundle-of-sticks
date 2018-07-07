export type Provider = {
	name: string;
	id: string;
	url: string;
	searchDelay: number; // ms
};

export default class Providers {
	public static getList(): Provider[] {
		return [
			{
				name: 'Manga Here',
				id: 'mangaherecc',
				url: 'www.mangahere.cc',
				searchDelay: 5500,
			},
			{
				name: 'Manga Fox',
				id: 'mangafoxnet',
				url: 'fanfox.net/',
				searchDelay: 0,
			},
			{
				name: 'Manga Park',
				id: 'mangaparkme',
				url: 'www.mangapark.me',
				searchDelay: 0,
			},
			{
				name: 'ExHentai',
				id: 'exhentai',
				url: 'exhentai.org/',
				searchDelay: 0,
			},
		];
	}

	public static getProvider(id: string) {
		return this.getList().find(p => p.id === id);
	}
}
