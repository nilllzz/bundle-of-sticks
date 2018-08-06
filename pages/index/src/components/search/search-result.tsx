import * as React from 'react';
import Manga from '../../app/models/manga.model';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Growls from '../../views/shell/growls';
import Bookmarks from '../../app/bookmarks';
import { Link } from 'react-router-dom';

type SearchResultProps = {
	manga: Manga;
	showProvider: boolean;
};

export default class SearchResult extends React.Component<SearchResultProps, any> {
	constructor(props: SearchResultProps) {
		super(props);

		this.onClickBookmarkHandler = this.onClickBookmarkHandler.bind(this);
	}

	private onClickBookmarkHandler(e: React.MouseEvent<Glyphicon>) {
		// do not trigger main's click event
		e.stopPropagation();
		e.preventDefault();

		const bookmark = Bookmarks.createManga(this.props.manga);
		if (!Bookmarks.hasBookmark(bookmark)) {
			Bookmarks.addBookmark(bookmark);

			Growls.add(
				'Bookmark added',
				'Find ' + this.props.manga.name + ' in your collection',
				3000
			);
		} else {
			Bookmarks.removeBookmark(bookmark);

			Growls.add('Bookmark removed');
		}

		// bookmark data not stored in state
		this.forceUpdate();
	}

	public render() {
		const bookmark = Bookmarks.createManga(this.props.manga);
		const hasBookmark = Bookmarks.hasBookmark(bookmark);
		const bookmarkTooltip = (
			<Tooltip id="search-result-bookmark-tooltip">
				<div>{hasBookmark ? 'Remove bookmark' : 'Add bookmark'}</div>
			</Tooltip>
		);

		return (
			<Link
				className="search-result-main clickable unstyled-link"
				to={this.props.manga.getUrl()}
			>
				<div className="search-result-info enable-user-select">
					<div className="search-result-title accent-color-text">
						{this.props.manga.hot ? (
							<OverlayTrigger
								placement="top"
								overlay={
									<Tooltip id={'manga-hot-' + this.props.manga.link}>
										<div>HOT</div>
									</Tooltip>
								}
							>
								<Glyphicon
									glyph="fire"
									className="search-result-hot accent-gradient-text"
								/>
							</OverlayTrigger>
						) : null}
						{this.props.manga.name}
					</div>
					{this.props.showProvider ? (
						<div className="search-result-provider">
							<em>{this.props.manga.host.getProvider().name}</em>
						</div>
					) : null}
				</div>
				<div className="search-result-controls">
					<OverlayTrigger placement="top" overlay={bookmarkTooltip}>
						<Glyphicon
							glyph="bookmark"
							onClick={this.onClickBookmarkHandler}
							className={hasBookmark ? 'accent-color-text' : ''}
						/>
					</OverlayTrigger>
				</div>
			</Link>
		);
	}
}
