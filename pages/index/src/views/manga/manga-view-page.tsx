import * as React from 'react';
import Info from '../../app/models/info.model';
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
import AppButton from '../../components/app/app-button';
import ReaderBase from '../reader/reader-base';
import ReadingRecords, { ReadingRecord } from '../../app/reading-records';
import StringHelper from '../../app/string-helper';
import MangaCoverimg from '../../components/manga/manga-coverimg';

type MangaViewPageState = {
	info: Info;
	loading: boolean;
	hasBookmark: boolean;
	nsfwConfirmed: boolean;
	record: ReadingRecord;
	fetchError: boolean;
};

export default class MangaViewPage extends React.Component<any, MangaViewPageState> {
	constructor(props: any) {
		super(props);

		this.state = {
			info: null,
			loading: true,
			hasBookmark: false,
			nsfwConfirmed: false,
			record: null,
			fetchError: false,
		};

		this.toggleBookmark = this.toggleBookmark.bind(this);
		this.onContinueNSFW = this.onContinueNSFW.bind(this);
		this.onUpdateReadingRecord = this.onUpdateReadingRecord.bind(this);
		this.onClickRetryHandler = this.onClickRetryHandler.bind(this);
	}

	componentDidMount() {
		this.loadInfo();
	}

	componentWillUnmount() {
		if (this.state.info) {
			// clear event bus subscription
			ReadingRecords.unsubscribe(this.state.info.manga);
		}
	}

	private async loadInfo() {
		const provider = this.props.match.params.provider;
		const link = this.props.match.params.link;

		const info = await Info.fetch(provider, link);
		if (!info) {
			this.setState({
				loading: false,
				fetchError: true,
			});
		} else {
			const record = ReadingRecords.read(info.manga);

			this.setState({
				info: info,
				loading: false,
				fetchError: false,
				hasBookmark: this.hasBookmark(info.manga),
				record: record,
			});

			// if the user opens the reader from here, track changes to the reading record
			ReadingRecords.subscribe(info.manga, this.onUpdateReadingRecord);
		}
	}

	private hasBookmark(manga: Manga) {
		const bookmark = Bookmarks.createManga(manga);
		return Bookmarks.hasBookmark(bookmark);
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

	private onUpdateReadingRecord(record: ReadingRecord) {
		this.setState({
			record: record,
		});
	}

	private onClickRetryHandler() {
		this.setState(
			{
				loading: true,
			},
			() => {
				this.loadInfo();
			}
		);
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

	private renderGenres() {
		const genreElements = [];
		if (!this.state.info.genres || this.state.info.genres.length === 0) {
			genreElements.push(
				<span className="text-muted" key="0">
					None
				</span>
			);
		} else {
			for (let i = 0; i < this.state.info.genres.length; i++) {
				const genre = this.state.info.genres[i];
				genreElements.push(<span key={genre}>{genre}</span>);
				if (i < this.state.info.genres.length - 1) {
					genreElements.push(<AppSeparator key={genre + 'separator'} />);
				}
			}
		}

		return (
			<div className="manga-view-page-genres manga-view-page-info-element">
				<div className="manga-view-page-info-title">
					{'Genre' + (genreElements.length > 1 ? 's' : '')}:
				</div>

				<div className="manga-view-page-info-list">{genreElements}</div>
			</div>
		);
	}

	private renderControls() {
		if (this.state.info.unavailable) {
			return (
				<span className="accent-color-text">
					<Glyphicon glyph="lock" /> {this.state.info.manga.host.getProvider().name} has
					marked this Manga as <strong>unavailable</strong>.{' '}
				</span>
			);
		}

		const record = this.state.record;
		if (!record) {
			// show start reading button if no reading record exists
			return (
				<AppButton
					main
					onClick={() => {
						ReaderBase.show(this.state.info.manga, this.state.info.folders);
					}}
				>
					Start reading
				</AppButton>
			);
		} else {
			const folder = this.state.info.folders.find(f => f.getId() === record.folderId);
			const volume = folder.volumes.find(v => v.number === record.volume);
			const chapter = volume.chapters.find(c => c.number === record.chapter);

			return (
				<div>
					<div className="manga-view-page-controls-record text-muted">
						<div>Page {(record.page + 1).toString()}</div>
						<div>
							Chapter {StringHelper.padStart(chapter.number.toString(), '0', 3)}
						</div>
						{!!chapter.name ? <div>{chapter.name}</div> : null}
						{volume.number > -1 ? (
							<div>
								Volume {StringHelper.padStart(volume.number.toString(), '0', 3)}
							</div>
						) : null}
					</div>
					<AppButton
						main
						onClick={() => {
							ReaderBase.show(this.state.info.manga, this.state.info.folders);
						}}
					>
						Continue reading
					</AppButton>
				</div>
			);
		}
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

		if (this.state.fetchError) {
			return (
				<div className="manga-view-page-main shell-content-padded">
					<div className="manga-view-page-title page-main-header">
						Error loading Manga information
					</div>
					<div className="manga-view-page-body">
						The server responded with an error while fetching information about this
						Manga.
						<div className="manga-view-page-controls manga-view-page-controls-error">
							<AppButton onClick={this.onClickRetryHandler} main icon="repeat">
								Retry
							</AppButton>
							<Link to="/" className="unstyled-link">
								<AppButton icon="home">Homepage</AppButton>
							</Link>
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
						<div className="manga-view-page-coverimg">
							<MangaCoverimg
								src={this.state.info.coverImg}
								width={200}
								height={310}
							/>
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
							{this.renderGenres()}
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
					<div className="manga-view-page-controls">{this.renderControls()}</div>
				</div>
			</div>
		);
	}
}
