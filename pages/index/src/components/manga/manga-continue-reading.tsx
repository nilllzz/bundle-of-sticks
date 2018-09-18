import * as React from 'react';
import Manga from '../../app/models/manga.model';
import Info from '../../app/models/info.model';
import ReadingRecords, { ReadingRecord } from '../../app/reading-records';
import StringHelper from '../../app/string-helper';
import MangaCoverimg from '../manga/manga-coverimg';
import AppButton from '../app/app-button';
import { Link } from 'react-router-dom';
import ReaderBase from '../../views/reader/reader-base';
import AppTimeDisplay from '../app/app-time-display';
import { Glyphicon } from 'react-bootstrap';

type MangaContinueReadingProps = {
	manga: Manga;
	showRemove: boolean;
	onRemoveRecord?: (manga: Manga) => boolean;
};

type MangaContinueReadingState = {
	info: Info;
	loading: boolean;
	record: ReadingRecord;
};

export default class MangaContinueReading extends React.Component<
	MangaContinueReadingProps,
	MangaContinueReadingState
	> {
	constructor(props: MangaContinueReadingProps) {
		super(props);

		const record = ReadingRecords.read(this.props.manga);
		this.state = { info: null, loading: true, record: record };

		this.onRecordUpdate = this.onRecordUpdate.bind(this);
		this.onClickReadHandler = this.onClickReadHandler.bind(this);
		this.onClickRemoveRecord = this.onClickRemoveRecord.bind(this);
	}

	async componentDidMount() {
		const info = await Info.fetch(this.props.manga.host.id, this.props.manga.link);

		this.setState(
			{
				info: info,
				loading: false,
			},
			() => {
				if (this.state.info) {
					ReadingRecords.subscribe(this.state.info.manga, this.onRecordUpdate);
				}
			}
		);
	}

	componentWillUnmount() {
		if (this.state.info) {
			ReadingRecords.unsubscribe(this.state.info.manga);
		}
	}

	private getChapterAmount() {
		if (this.state.info && this.state.info.folders) {
			let chapters = 0;
			for (const folder of this.state.info.folders) {
				for (const volume of folder.volumes) {
					chapters += volume.chapters.length;
				}
			}
			return chapters;
		}
		return 0;
	}

	private onRecordUpdate(record: ReadingRecord) {
		this.setState({
			record: record,
		});
	}

	private onClickReadHandler() {
		ReaderBase.show(this.state.info.manga, this.state.info.folders, this.state.record);
	}

	private onClickRemoveRecord() {
		if (this.props.onRemoveRecord) {
			const doRemove = this.props.onRemoveRecord(this.props.manga);
			if (doRemove) {
				ReadingRecords.remove(this.state.info.manga);
			}
		}
	}

	private renderMain() {
		if (this.state.loading) {
			return (
				<div className="manga-continue-reading-body">
					<div className="manga-continue-reading-title-placeholder content-placeholder" />
					<div className="manga-continue-reading-info">
						<div className="manga-continue-reading-coverimg-placeholder accent-gradient-background" />
						<div className="manga-continue-reading-right">
							<div className="manga-continue-reading-text-placeholder content-placeholder" />
							<div className="manga-continue-reading-controls-placeholder content-placeholder" />
						</div>
					</div>
				</div>
			);
		} else if (!this.state.info) {
			return (
				<div className="manga-continue-reading-body manga-continue-reading-error">
					<div className="text-muted">
						<strong>{this.props.manga.name}</strong>
					</div>
					<div className="text-muted">Failed to fetch Manga information</div>
					<div className="manga-continue-reading-controls">
						<Link to={this.props.manga.getUrl()} className="unstyled-link">
							<AppButton>View Manga</AppButton>
						</Link>
					</div>
				</div>
			);
		} else {
			if (!this.state.record || this.state.info.unavailable) {
				// if no record exists, show Start reading

				return (
					<div className="manga-continue-reading-body">
						<span className="manga-continue-reading-title accent-color-text">
							<strong>{this.state.info.manga.name}</strong>
						</span>
						<div className="manga-continue-reading-info">
							<MangaCoverimg
								src={this.state.info.coverImg}
								width={100}
								height={155}
							/>
							{this.props.showRemove ? (
								<div
									className="manga-continue-reading-remove clickable"
									onClick={this.onClickRemoveRecord}
								>
									<Glyphicon glyph="remove" />
								</div>
							) : null}
							<div className="manga-continue-reading-right">
								{!this.state.info.unavailable ?
									<div className="manga-continue-reading-text text-muted">
										You have not read<br />
										this Manga<br />
										<strong>{this.getChapterAmount()} Chapters</strong>
									</div> :
									<div className="manga-continue-reading-text accent-color-text">
										<Glyphicon glyph="lock" /> <strong>{this.state.info.manga.host.getProvider().name}</strong> marked<br />
										this Manga as unavailable
									</div>}
								<div className="manga-continue-reading-controls">
									{!this.state.info.unavailable ?
										<AppButton onClick={this.onClickReadHandler} main>
											Read
										</AppButton>
										: null}
									<Link
										to={this.state.info.manga.getUrl()}
										className="unstyled-link"
									>
										<AppButton>More info</AppButton>
									</Link>
								</div>
							</div>
						</div>
					</div>
				);
			} else {
				const folder = this.state.info.folders.find(
					f => f.getId() === this.state.record.folderId
				);
				const volume = folder.volumes.find(v => v.number === this.state.record.volume);
				const chapter = volume.chapters.find(c => c.number === this.state.record.chapter);

				return (
					<div className="manga-continue-reading-body">
						<span className="manga-continue-reading-title accent-color-text">
							<strong>{this.state.info.manga.name}</strong>
						</span>
						<div className="manga-continue-reading-info">
							<MangaCoverimg
								src={this.state.info.coverImg}
								width={100}
								height={155}
							/>
							{this.props.showRemove ? (
								<div
									className="manga-continue-reading-remove clickable"
									onClick={this.onClickRemoveRecord}
								>
									<Glyphicon glyph="remove" />
								</div>
							) : null}
							<div className="manga-continue-reading-right">
								<div className="manga-continue-reading-text text-muted">
									<div>Page {(this.state.record.page + 1).toString()}</div>
									<div>
										Chapter{' '}
										{StringHelper.padStart(chapter.number.toString(), '0', 3)}
									</div>
									{!!chapter.name ? <div>{chapter.name}</div> : null}
									{volume.number > -1 ? (
										<div>
											Volume{' '}
											{StringHelper.padStart(
												volume.number.toString(),
												'0',
												3
											)}
										</div>
									) : null}
									<AppTimeDisplay time={this.state.record.date} />
								</div>
								<div className="manga-continue-reading-controls">
									<AppButton onClick={this.onClickReadHandler} main>
										Read
									</AppButton>
									<Link
										to={this.state.info.manga.getUrl()}
										className="unstyled-link"
									>
										<AppButton>More info</AppButton>
									</Link>
								</div>
							</div>
						</div>
					</div>
				);
			}
		}
	}

	public render() {
		return <div className="manga-continue-reading-main">{this.renderMain()}</div>;
	}
}
