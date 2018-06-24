import * as React from 'react';
import * as qs from 'query-string';
import Manga from '../../app/models/manga.model';
import { Api } from '../../app/api';
import SearchResult from '../../components/search/search-result';
import CoolSearchbar from '../../components/search/cool-searchbar';
import { Link } from 'react-router-dom';
import RecentSearches from '../../components/search/recent-searches';
import ProviderSelector from '../../components/search/provider-selector';
import { Provider } from '../../app/providers';
import Providers from '../../app/providers';
import LocalState from '../../app/local-state';

type SearchPageState = {
	nextQuery: string | null;
	lastSearchQuery: string;
	results: Manga[] | null;
	loading: boolean;
	activeProviders: string[];
};

export default class SearchPage extends React.Component<any, SearchPageState> {
	readonly providers: Provider[];

	constructor(props: any) {
		super(props);

		this.providers = Providers.getList();

		const selectedProviders = LocalState.readDefault(
			'selected-providers',
			this.providers.map(p => p.id)
		) as string[];

		this.state = {
			lastSearchQuery: undefined,
			results: null,
			loading: false,
			activeProviders: selectedProviders,
			nextQuery: null,
		};

		this.onSearchbarSearch = this.onSearchbarSearch.bind(this);
		this.onUpdateActiveProviders = this.onUpdateActiveProviders.bind(this);
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

		this.setState(
			{
				lastSearchQuery: query,
				loading: true,
			},
			async () => {
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
				});
			}
		);
	}

	private onSearchbarSearch(query: string) {
		this.setState(
			{
				nextQuery: query,
			},
			() => {
				const element = document.getElementById('search-next');
				element.click();
			}
		);
	}

	private renderSearchResults() {
		if (this.state.loading) {
			return <div>Loading...</div>;
		} else {
			if (!this.state.results || this.state.results.length === 0) {
				return <div>No results.</div>;
			} else {
				return this.state.results.map(r => <SearchResult key={r.link} manga={r} />);
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
						onSearch={this.onSearchbarSearch}
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
						onSearch={this.onSearchbarSearch}
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
		return (
			<div className="search-page-main shell-content-padded">
				{this.renderContent()}
				<Link to={'/search?query=' + this.state.nextQuery} hidden id="search-next" />
			</div>
		);
	}
}
