import * as React from 'react';
import Manga from '../../app/models/manga.model';

type SearchResultProps = {
	manga: Manga;
};

export default class SearchResult extends React.Component<SearchResultProps, any> {
	public render() {
		return <div className="search-result-main">{this.props.manga.name}</div>;
	}
}
