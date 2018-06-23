import * as React from 'react';
import * as qs from 'query-string';
import Manga from '../../app/models/manga.model';
import { Api } from '../../app/api';
import SearchResult from '../../components/search/search-result';

type SearchPageState = {
	lastSearchQuery: string | null;
	results: Manga[] | null;
	loading: boolean;
};

export default class SearchPage extends React.Component<any, SearchPageState> {
	constructor(props: any) {
		super(props);

		this.state = { lastSearchQuery: null, results: null, loading: true };
	}

	async componentDidMount() {
		await this.search();
	}

	async componentDidUpdate(_: any, prevState: SearchPageState) {
		if (!prevState.loading && !this.state.loading) {
			await this.search();
		}
	}

	private getQuery() {
		return qs.parse(this.props.location.search).query;
	}

	private async search() {
		const query = this.getQuery();
		if (query === undefined) {
			this.setState({
				loading: false,
				results: [],
				lastSearchQuery: null,
			});
		} else if (this.state.lastSearchQuery === null || this.state.lastSearchQuery !== query) {
			this.setState(
				{
					loading: true,
				},
				async () => {
					const response = await Api.sendRequest('/api/search?q=' + query);
					const mangas = Manga.populate(response.data);

					this.setState({
						results: mangas,
						lastSearchQuery: query,
						loading: false,
					});
				}
			);
		}
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

	private renderContent() {
		if (this.state.lastSearchQuery === null) {
			// user has not searched for anything through the search bar, display latest searches instead
			return (
				<div className="search-page-title">
					Enter your <b className="accent-color-text">search</b> into the bar above
				</div>
			);
		} else {
			const query = this.getQuery();
			return (
				<div>
					<div className="search-page-title">
						Search results for
						<b className="accent-color-text">{' ' + query}</b>
					</div>
					<div className="search-page-results">{this.renderSearchResults()}</div>
				</div>
			);
		}
	}

	public render() {
		return <div className="search-page-main">{this.renderContent()}</div>;
	}
}
