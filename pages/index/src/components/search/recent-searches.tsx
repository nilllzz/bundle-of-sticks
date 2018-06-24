import * as React from 'react';
import LocalState from '../../app/local-state';
import AppTimeDisplay from '../app/app-time-display';
import { Link } from 'react-router-dom';
import AppSeparator from '../app/app-separator';
import PrivacyMode from '../../app/privacy-mode';

type RecentSearchEntry = {
	query: string;
	date: number;
};

type RecentSearchesState = {
	searches: RecentSearchEntry[];
};

export default class RecentSearches extends React.Component<any, RecentSearchesState> {
	constructor(props: any) {
		super(props);

		this.state = { searches: RecentSearches.getSearches() };
	}

	private static getSearches(): RecentSearchEntry[] {
		const searches = LocalState.readDefault('recent-searches', []) as RecentSearchEntry[];
		return searches;
	}

	private static isSameQuery(entry: RecentSearchEntry, query: string) {
		return entry.query.toLowerCase() === query.toLowerCase();
	}

	public static addSearch(query: string) {
		// don't add if privacy mode is on
		if (PrivacyMode.isActive()) {
			return;
		}

		const searches = this.getSearches();
		const newEntry = {
			query: query,
			date: Date.now(),
		} as RecentSearchEntry;

		if (searches.some(s => this.isSameQuery(s, query))) {
			// replace existing query and put the new one at the top
			const filtered = searches.filter(s => !this.isSameQuery(s, query));
			filtered.unshift(newEntry);
			LocalState.write('recent-searches', filtered);
		} else {
			searches.unshift(newEntry);
			// no more than 15 entries
			while (searches.length > 15) {
				searches.pop();
			}
			LocalState.write('recent-searches', searches);
		}
	}

	public render() {
		return (
			<div className="recent-searches-main">
				<div className="recent-searches-title">Or pick from your recent searches:</div>
				{this.state.searches.map(s => {
					return (
						<div className="recent-searches-entry" key={s.date.toString()}>
							<Link
								to={'/search?query=' + s.query}
								className="recent-searches-entry-link accent-link unstyled-link"
							>
								{s.query}
							</Link>
							<AppSeparator />
							<AppTimeDisplay time={s.date} />
						</div>
					);
				})}
			</div>
		);
	}
}
