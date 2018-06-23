import * as React from 'react';
import * as qs from 'query-string';
import Manga from '../../app/models/manga.model';
import { Api } from '../../app/api';
import SearchResult from '../../components/search/search-result';

type SearchPageState = {
	lastSearchQuery: string | null;
	results: Manga[] | null;
};

export default class SearchPage extends React.Component<any, SearchPageState> {
	constructor(props: any) {
		super(props);

		this.state = { lastSearchQuery: null, results: null };
	}

	async componentDidMount() {
		await this.search();
	}

	async componentDidUpdate() {
		await this.search();
	}

	private getQuery() {
		return qs.parse(this.props.location.search).query;
	}

	private async search() {
		const query = this.getQuery();
		if (!this.state.lastSearchQuery || this.state.lastSearchQuery !== query) {
			const response = await Api.sendRequest('/api/search?q=' + query);
			const mangas = Manga.populate(response.data);

			this.setState({
				results: mangas,
				lastSearchQuery: query,
			});
		}
	}

	private renderSearchResults() {
		if (this.state.results === []) {
			return <div>No results.</div>;
		} else if (this.state.results) {
			return this.state.results.map(r => <SearchResult key={r.link} manga={r} />);
		} else {
			return <div>Loading...</div>;
		}
	}

	public render() {
		const query = this.getQuery();
		return (
			<div className="search-page-main">
				<div className="search-page-title">
					Search results for
					<b className="accent-color-text">{' ' + query}</b>
				</div>
				<div className="search-page-results">{this.renderSearchResults()}</div>
			</div>
		);
	}
}
