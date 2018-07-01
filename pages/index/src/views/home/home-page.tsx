import * as React from 'react';
import Providers, { Provider } from '../../app/providers';
import LocalState from '../../app/local-state';
import CoolSearchbar from '../../components/search/cool-searchbar';
import { ReadingRecord } from '../../app/reading-records';
import ReadingRecords from '../../app/reading-records';
import Emojis from '../../app/emojis';
import MangaContinueReading from '../../components/manga/manga-continue-reading';
import Manga from '../../app/models/manga.model';

type HomePageState = {
	nextQuery: string | null;
	activeProviders: string[];
};

export default class HomePage extends React.Component<any, HomePageState> {
	private readonly providers: Provider[];
	private readonly records: ReadingRecord[];

	constructor(props: any) {
		super(props);

		this.providers = Providers.getList();
		this.records = ReadingRecords.readLatest(3);

		const selectedProviders = LocalState.readDefault<string[]>(
			'selected-providers',
			this.providers.map(p => p.id)
		);

		this.state = {
			nextQuery: null,
			activeProviders: selectedProviders,
		};

		this.onUpdateActiveProviders = this.onUpdateActiveProviders.bind(this);
		this.onClickHomeBanner = this.onClickHomeBanner.bind(this);
	}

	private getTitle() {
		let titleText = 'BUNDLE OF STICKS ';
		let startIndex = 0;
		while (titleText.includes(' ', startIndex)) {
			const spaceIndex = titleText.indexOf(' ', startIndex);
			const emoji = Emojis.getRandom();
			titleText =
				titleText.substring(0, spaceIndex) +
				' ' +
				emoji +
				' ' +
				titleText.substring(spaceIndex + 1);
			startIndex = spaceIndex + 2 + emoji.length;
		}
		return titleText.trim();
	}

	private onUpdateActiveProviders(activeProviders: string[]) {
		LocalState.write('selected-providers', activeProviders);
		this.setState({
			activeProviders: activeProviders,
		});
	}

	private onClickHomeBanner() {
		// update emojis, most important feature
		this.forceUpdate();
	}

	public render() {
		return (
			<div className="home-main">
				<div className="home-banner" onClick={this.onClickHomeBanner}>
					<div className="page-main-header no-user-select">{this.getTitle()}</div>
				</div>

				<div className="home-content shell-content-padded">
					<CoolSearchbar
						text="Click to search "
						highlight="Manga"
						updateActiveProviders={this.onUpdateActiveProviders}
						activeProviders={this.state.activeProviders}
						providers={this.providers}
					/>
					<div>
						<div className="home-continue-reading-title">Continue reading</div>
						<div className="home-continue-reading-entries">
							{this.records.map(r => {
								const manga = new Manga(r.manga); // no actual instance returned, need to populate
								return <MangaContinueReading key={manga.getId()} manga={manga} />;
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
