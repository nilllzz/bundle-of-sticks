import * as React from 'react';
import * as qs from 'query-string';
import Manga from '../../app/models/manga.model';
import { Api } from '../../app/api';
import SearchResult from '../../components/search/search-result';
import CoolSearchbar from '../../components/search/cool-searchbar';
import RecentSearches from '../../components/search/recent-searches';
import { Provider } from '../../app/providers';
import Providers from '../../app/providers';
import LocalState from '../../app/local-state';
import AppLoading from '../../components/app/app-loading';
import MangaContinueReading from '../../components/manga/manga-continue-reading';
import { Glyphicon } from 'react-bootstrap';

type SearchPageState = {
	nextQuery: string | null;
	lastSearchQuery: string;
	lastSearchTime: number | null;
	results: Manga[] | null;
	loading: boolean;
	activeProviders: string[];
	showProvidersInResults: boolean;
	showPreviews: boolean;
};

export default class SearchPage extends React.Component<any, SearchPageState> {
	readonly providers: Provider[];

	constructor(props: any) {
		super(props);

		this.providers = Providers.getList();

		const selectedProviders = LocalState.readDefault<string[]>(
			'selected-providers',
			this.providers.map(p => p.id)
		);

		this.state = {
			lastSearchQuery: undefined,
			results: null,
			loading: false,
			activeProviders: selectedProviders,
			nextQuery: null,
			lastSearchTime: null,
			showProvidersInResults: true,
			showPreviews: LocalState.readDefault<boolean>('search-show-previews', false),
		};

		this.onUpdateActiveProviders = this.onUpdateActiveProviders.bind(this);
		this.changeView = this.changeView.bind(this);
	}

	async componentDidMount() {
		const query = this.getQuery();
		if (query !== undefined) {
			await this.search();
		}
	}

	async componentDidUpdate(_: any, prevState: SearchPageState) {
		const query = this.getQuery();
		if (this.state.lastSearchQuery !== query && prevState.lastSearchQuery !== query) {
			if (query === undefined) {
				this.setState({
					loading: false,
					lastSearchQuery: undefined,
				});
			} else {
				await this.search();
			}
		}
	}

	private getQuery() {
		return qs.parse(this.props.location.search).query;
	}

	private async search() {
		const query = this.getQuery();

		RecentSearches.addSearch(query);

		this.setState(
			{
				lastSearchQuery: query,
				loading: true,
			},
			async () => {
				const longestDelay = Math.max(
					...this.providers
						.filter(p => this.state.activeProviders.includes(p.id))
						.map(p => p.searchDelay)
				);

				const min = this.state.lastSearchTime + longestDelay;
				const diff = min - Date.now();
				if (diff > 0) {
					console.log('wait for seconds', diff / 1000);
					await new Promise((resolve, _) => setTimeout(() => resolve(), diff));
				}

				const providers = this.state.activeProviders.join(',');
				const response = await Api.getRequest('/api/search', {
					q: query,
					providers: providers,
				});
				const mangas = Manga.populate(response.data);

				this.setState({
					results: mangas,
					lastSearchQuery: query,
					loading: false,
					lastSearchTime: Date.now(),
					showProvidersInResults: this.state.activeProviders.length !== 1,
				});
			}
		);
	}

	private changeView(showPreviews: boolean) {
		LocalState.write('search-show-previews', showPreviews);
		this.setState({
			showPreviews: LocalState.readDefault<boolean>('search-show-previews', false),
		});
	}

	private renderSearchResults() {
		if (this.state.loading) {
			return <AppLoading />;
		} else {
			if (!this.state.results || this.state.results.length === 0) {
				return <div>No results.</div>;
			} else {
				return (
					<div className="search-page-results-container">
						<div className="search-page-results-controls">
							<div className="search-page-results-controls-view">
								<Glyphicon
									glyph="th-list"
									className={
										'clickable' +
										(!this.state.showPreviews ? '' : ' text-muted')
									}
									onClick={() => this.changeView(false)}
								/>
								<Glyphicon
									glyph="th-large"
									className={
										'clickable' + (this.state.showPreviews ? '' : ' text-muted')
									}
									onClick={() => this.changeView(true)}
								/>
							</div>
						</div>
						{this.state.showPreviews ? (
							<div className="search-page-results-container-previews">
								{this.state.results.map(r => (
									<MangaContinueReading key={r.link} manga={r} />
								))}
							</div>
						) : (
							<div className="search-page-results-container-list">
								{this.state.results.map(r => (
									<SearchResult
										key={r.link}
										manga={r}
										showProvider={this.state.showProvidersInResults}
									/>
								))}
							</div>
						)}
					</div>
				);
			}
		}
	}

	private onUpdateActiveProviders(activeProviders: string[]) {
		LocalState.write('selected-providers', activeProviders);
		this.setState({
			activeProviders: activeProviders,
		});
	}

	private renderContent() {
		if (this.state.lastSearchQuery === undefined && !this.state.loading) {
			// user has not searched for anything through the search bar, display latest searches instead
			return (
				<div className="search-page-content">
					<CoolSearchbar
						text="Click to "
						highlight="search"
						updateActiveProviders={this.onUpdateActiveProviders}
						activeProviders={this.state.activeProviders}
						providers={this.providers}
					/>
					<div className="search-page-recent">
						<RecentSearches />
					</div>
				</div>
			);
		} else {
			const query = this.getQuery();
			return (
				<div className="search-page-content">
					<CoolSearchbar
						text="Search results for "
						highlight={query}
						updateActiveProviders={this.onUpdateActiveProviders}
						activeProviders={this.state.activeProviders}
						providers={this.providers}
					/>
					<div className="search-page-results">{this.renderSearchResults()}</div>
				</div>
			);
		}
	}

	public render() {
		return <div className="search-page-main shell-content-padded">{this.renderContent()}</div>;
	}
}
