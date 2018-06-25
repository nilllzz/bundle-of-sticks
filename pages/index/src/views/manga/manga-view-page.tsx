import * as React from 'react';
import Info from '../../app/models/info.model';
import { Api } from '../../app/api';
import MangaRating from '../../components/manga/manga-rating';
import { Link } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';
import Bookmarks from '../../app/bookmarks';

type MangaViewPageState = {
	info: Info;
	loading: boolean;
	imgError: boolean;
};

export default class MangaViewPage extends React.Component<any, MangaViewPageState> {
	constructor(props: any) {
		super(props);

		this.state = { info: null, loading: true, imgError: false };

		this.onImgLoadError = this.onImgLoadError.bind(this);
		this.toggleBookmark = this.toggleBookmark.bind(this);
	}

	async componentDidMount() {
		const provider = this.props.match.params.provider;
		const link = this.props.match.params.link;

		const response = await Api.getRequest('/api/manga/info', { host: provider, manga: link });
		const info = new Info(response.data);

		this.setState({
			info: info,
			loading: false,
		});
	}

	private onImgLoadError() {
		this.setState({
			imgError: true,
		});
	}

	private toggleBookmark() {}

	public render() {
		if (this.state.loading) {
			// if it's still loading, render a bunch of placeholders
			return (
				<div className="manga-view-page-main shell-content-padded">
					<div className="manga-view-page-title page-main-header">
						<div className="manga-view-page-title-placeholder content-placeholder" />
					</div>
					<div className="manga-view-page-body">
						<div className="manga-view-page-upper">
							<div className="manga-view-page-coverimg-placeholder accent-gradient-background" />
							<div className="manga-view-page-info">
								<div className="manga-view-page-rating-placeholder content-placeholder" />
								<div className="manga-view-page-info-placeholder content-placeholder" />
								<div className="manga-view-page-info-placeholder content-placeholder" />
								<div className="manga-view-page-info-placeholder content-placeholder" />
								<div className="manga-view-page-info-placeholder content-placeholder" />
							</div>
						</div>
						<div className="manga-view-page-lower">
							<div className="manga-view-page-summary-placeholder content-placeholder" />
						</div>
					</div>
				</div>
			);
		}

		const authorElements = [];
		if (this.state.info.authors.length === 0) {
			authorElements.push(<span className="text-muted">Unknown</span>);
		} else {
			for (let i = 0; i < this.state.info.authors.length; i++) {
				const author = this.state.info.authors[i];
				authorElements.push(
					<Link to={author.getUrl()} className="accent-color-text unstyled-link">
						{author.name}
					</Link>
				);
				if (i < this.state.info.authors.length - 1) {
					authorElements.push(<span>{', '}</span>);
				}
			}
		}

		const artistElements = [];
		if (this.state.info.artists.length === 0) {
			artistElements.push(<span className="text-muted">Unknown</span>);
		} else {
			for (let i = 0; i < this.state.info.artists.length; i++) {
				const artist = this.state.info.artists[i];
				artistElements.push(
					<Link to={artist.getUrl()} className="accent-color-text unstyled-link">
						{artist.name}
					</Link>
				);
				if (i < this.state.info.artists.length - 1) {
					artistElements.push(<span>{', '}</span>);
				}
			}
		}

		const bookmark = Bookmarks.createManga(this.state.info.manga);
		const hasBookmark = Bookmarks.hasBookmark(bookmark);

		return (
			<div className="manga-view-page-main shell-content-padded">
				<div className="manga-view-page-title page-main-header">
					{this.state.info.manga.name}
				</div>
				<div className="manga-view-page-body">
					<div className="manga-view-page-upper">
						<div className="manga-view-page-coverimg accent-gradient-background">
							{!this.state.imgError ? (
								<img src={this.state.info.coverImg} onError={this.onImgLoadError} />
							) : (
								<div className="manga-view-page-coverimg-fail no-user-select">
									No cover
								</div>
							)}
							<div
								className={
									'manga-view-page-bookmark clickable' +
									(hasBookmark ? ' accent-color-text' : '')
								}
								onClick={this.toggleBookmark}
							>
								<Glyphicon glyph="bookmark" />
							</div>
						</div>
						<div className="manga-view-page-info">
							<MangaRating rating={this.state.info.rating} />
							<div className="manga-view-page-authors manga-view-page-info-element">
								<div className="manga-view-page-info-title">Authors:</div>
								{authorElements}
							</div>
							<div className="manga-view-page-artists manga-view-page-info-element">
								<div className="manga-view-page-info-title">Artists:</div>
								{artistElements}
							</div>
							<div className="manga-view-page-genres manga-view-page-info-element">
								<div className="manga-view-page-info-title">Genres:</div>
								{this.state.info.genres.length > 0 ? (
									this.state.info.genres.join(', ')
								) : (
									<span className="text-muted">None</span>
								)}
							</div>
							<div className="manga-view-page-completion-status manga-view-page-info-element">
								<div className="manga-view-page-info-title">Status:</div>
								{this.state.info.completionStatus}
							</div>
						</div>
					</div>
					<div className="manga-view-page-lower">
						<div className="manga-view-page-summary">{this.state.info.summary}</div>
					</div>
				</div>
			</div>
		);
	}
}
