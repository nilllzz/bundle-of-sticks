import * as React from 'react';
import Info from '../../app/models/info.model';
import { Api } from '../../app/api';
import MangaRating from '../../components/manga/manga-rating';
import { Link } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';
import Bookmarks from '../../app/bookmarks';
import Manga from '../../app/models/manga.model';
import AppSeparator from '../../components/app/app-separator';
import Growls from '../shell/growls';
import MangaNSFW from './manga-nsfw';
import AppExternalLink from '../../components/app/app-external-link';
import MangaSummary from '../../components/manga/manga-summary';

type MangaViewPageState = {
	info: Info;
	loading: boolean;
	imgError: boolean;
	hasBookmark: boolean;
	nsfwConfirmed: boolean;
};

export default class MangaViewPage extends React.Component<any, MangaViewPageState> {
	constructor(props: any) {
		super(props);

		this.state = {
			info: null,
			loading: true,
			imgError: false,
			hasBookmark: false,
			nsfwConfirmed: false,
		};

		this.onImgLoadError = this.onImgLoadError.bind(this);
		this.toggleBookmark = this.toggleBookmark.bind(this);
		this.onContinueNSFW = this.onContinueNSFW.bind(this);
	}

	async componentDidMount() {
		const provider = this.props.match.params.provider;
		const link = this.props.match.params.link;

		const response = await Api.getRequest('/api/manga/info', { host: provider, manga: link });
		const info = new Info(response.data);

		this.setState({
			info: info,
			loading: false,
			hasBookmark: this.hasBookmark(info.manga),
			imgError: !info.coverImg,
		});
	}

	private hasBookmark(manga: Manga) {
		const bookmark = Bookmarks.createManga(manga);
		return Bookmarks.hasBookmark(bookmark);
	}

	private onImgLoadError() {
		this.setState({
			imgError: true,
		});
	}

	private toggleBookmark() {
		const bookmark = Bookmarks.createManga(this.state.info.manga);
		if (!Bookmarks.hasBookmark(bookmark)) {
			Bookmarks.addBookmark(bookmark);
			Growls.add(
				'Bookmark added',
				'Find ' + this.state.info.manga.name + ' in your collection',
				3000
			);
		} else {
			Bookmarks.removeBookmark(bookmark);
			Growls.add('Bookmark removed');
		}
		this.setState({
			hasBookmark: this.hasBookmark(this.state.info.manga),
		});
	}

	private onContinueNSFW() {
		this.setState({
			nsfwConfirmed: true,
		});
	}

	private renderAuthors() {
		const authorElements = [];
		if (!this.state.info.authors || this.state.info.authors.length === 0) {
			authorElements.push(
				<span className="text-muted" key="0">
					Unknown
				</span>
			);
		} else {
			for (let i = 0; i < this.state.info.authors.length; i++) {
				const author = this.state.info.authors[i];
				authorElements.push(
					<Link
						to={author.getUrl()}
						className="accent-color-text unstyled-link"
						key={author.link}
					>
						{author.name}
					</Link>
				);
				if (i < this.state.info.authors.length - 1) {
					authorElements.push(<AppSeparator key={author.name + 'separator'} />);
				}
			}
		}

		return (
			<div className="manga-view-page-authors manga-view-page-info-element">
				<div className="manga-view-page-info-title">
					{'Author' + (authorElements.length > 1 ? 's' : '')}:
				</div>
				<div className="manga-view-page-info-list">{authorElements}</div>
			</div>
		);
	}

	private renderArtists() {
		const artistElements = [];
		if (!this.state.info.artists || this.state.info.artists.length === 0) {
			artistElements.push(
				<span className="text-muted" key="0">
					Unknown
				</span>
			);
		} else {
			for (let i = 0; i < this.state.info.artists.length; i++) {
				const artist = this.state.info.artists[i];
				artistElements.push(
					<Link
						to={artist.getUrl()}
						className="accent-color-text unstyled-link"
						key={artist.link}
					>
						{artist.name}
					</Link>
				);
				if (i < this.state.info.artists.length - 1) {
					artistElements.push(<AppSeparator key={artist.name + 'separator'} />);
				}
			}
		}

		return (
			<div className="manga-view-page-artists manga-view-page-info-element">
				<div className="manga-view-page-info-title">
					{'Artist' + (artistElements.length > 1 ? 's' : '')}:
				</div>
				<div className="manga-view-page-info-list">{artistElements}</div>
			</div>
		);
	}

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

		if (this.state.info.nsfw && !this.state.nsfwConfirmed) {
			return <MangaNSFW manga={this.state.info.manga} onContinue={this.onContinueNSFW} />;
		}

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
									(this.state.hasBookmark ? ' accent-color-text' : '')
								}
								onClick={this.toggleBookmark}
							>
								<Glyphicon glyph="bookmark" />
							</div>
						</div>
						<div className="manga-view-page-info">
							<MangaRating rating={this.state.info.rating} />
							{this.renderAuthors()}
							{this.renderArtists()}
							<div className="manga-view-page-genres manga-view-page-info-element">
								<div className="manga-view-page-info-title">Genres:</div>
								{this.state.info.genres && this.state.info.genres.length > 0 ? (
									this.state.info.genres.join(', ')
								) : (
									<span className="text-muted">None</span>
								)}
							</div>
							<div className="manga-view-page-completion-status manga-view-page-info-element">
								<div className="manga-view-page-info-title">Status:</div>
								{this.state.info.completionStatus ? (
									this.state.info.completionStatus
								) : (
									<span className="text-muted">Unknown</span>
								)}
							</div>
							<div className="manga-view-page-source manga-view-page-info-element">
								<div className="manga-view-page-info-title">Source:</div>
								<AppExternalLink href={this.state.info.manga.getExternalLink()}>
									{this.state.info.manga.host.getProvider().name + ' '}
								</AppExternalLink>
							</div>
						</div>
					</div>
					<div className="manga-view-page-lower">
						<MangaSummary summary={this.state.info.summary} />
					</div>
					<div className="manga-view-page-chapters" />
				</div>
			</div>
		);
	}
}
