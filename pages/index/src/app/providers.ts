export type Provider = {
	name: string;
	id: string;
	url: string;
	initial: string;
};

export default class Providers {
	static getList(): Provider[] {
		return [
			{
				name: 'Manga Here',
				id: 'mangaherecc',
				url: 'www.mangahere.cc',
				initial: 'H',
			},
			{
				name: 'Manga Fox',
				id: 'mangafoxnet',
				url: 'fanfox.net/',
				initial: 'F',
			},
			{
				name: 'Manga Park',
				id: 'mangaparkme',
				url: 'www.mangapark.me',
				initial: 'P',
			},
		];
	}
}
