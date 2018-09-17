import * as React from 'react';
import { Bookmark } from '../../app/bookmarks';
import Manga from '../../app/models/manga.model';
import MangaContinueReading from '../manga/manga-continue-reading';

type BookmarksGroupProps = {
	bookmarks: Bookmark[];
	letter: string;
	onRemoveBookmark: (b: Bookmark) => boolean;
}

export default class BookmarksGroup extends React.Component<BookmarksGroupProps, any> {
	constructor(props: BookmarksGroupProps) {
		super(props);
	}

	public render() {
		return <div className="bookmarks-group-main">
			<div className="bookmarks-group-header">
				<span><strong>{this.props.letter.toUpperCase()}</strong></span>
				<div className="bookmarks-group-header-line" />
			</div>
			<div className="collection-page-continue-reading">
				<div className="collection-page-continue-reading-list">
					{this.props.bookmarks.map(b => {
						const manga = new Manga(b.manga);
						return (
							<MangaContinueReading
								key={manga.getId()}
								manga={manga}
								showRemove={true}
								onRemoveRecord={_ => this.props.onRemoveBookmark(b)}
							/>
						);
					})}
				</div>
			</div>
		</div>;
	}
}
