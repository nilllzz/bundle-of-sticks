import * as React from 'react';
import { ReadingRecord } from '../../app/reading-records';
import ReadingRecords from '../../app/reading-records';
import MangaContinueReading from '../../components/manga/manga-continue-reading';
import Manga from '../../app/models/manga.model';
import AppButton from '../../components/app/app-button';
import AppTextbox from '../../components/app/app-textbox';
import AppTabs, { AppTab } from '../../components/app/app-tabs';

type CollectionPageState = {
	records: ReadingRecord[];
	filter: string;
	activeTab: number;
};

export default class CollectionPage extends React.Component<any, CollectionPageState> {
	constructor(props: any) {
		super(props);

		const records = ReadingRecords.readLatest(4);
		this.state = {
			filter: '',
			records: records,
			activeTab: 0,
		};

		this.onClickLoadMoreRecordsHandler = this.onClickLoadMoreRecordsHandler.bind(this);
		this.onChangeFilter = this.onChangeFilter.bind(this);
		this.onChangeTabs = this.onChangeTabs.bind(this);
	}

	private loadRecords(amount: number, atoz: boolean) {
		let records = ReadingRecords.readLatest(amount);
		if (atoz) {
			records = records.sort((a: ReadingRecord, b: ReadingRecord) => {
				if (a.manga.name < b.manga.name) {
					return -1;
				}
				if (a.manga.name > b.manga.name) {
					return 1;
				}
				return 0;
			});
		}
		this.setState({
			records: records,
		});
	}

	private onClickLoadMoreRecordsHandler() {
		this.loadRecords(this.state.records.length + 4, false);
	}

	private onChangeFilter(text: string) {
		if (this.state.records.length < ReadingRecords.getLength()) {
			this.loadRecords(ReadingRecords.getLength(), true);
		}
		this.setState({
			filter: text,
		});
	}

	private onChangeTabs(newTab: number) {
		this.setState({
			activeTab: newTab,
		});
	}

	private renderBookmarks() {
		return (
			<div className="collection-page-tab-bookmarks">
				<div className="collection-page-filter">
					<AppTextbox
						onChange={this.onChangeFilter}
						text={this.state.filter}
						id="filter"
						placeholder="Filter..."
					/>
				</div>
			</div>
		);
	}

	private renderReadingRecords() {
		const filterPhrases = this.state.filter
			.split(' ')
			.filter(p => p.trim().length > 0)
			.map(p =>
				p
					.replace('_', ' ')
					.trim()
					.toLowerCase()
			);
		const records = this.state.records.filter(r => {
			if (this.state.filter === '') {
				return true;
			}

			for (const phrase of filterPhrases) {
				if (
					r.manga.name.toLowerCase().includes(phrase) ||
					r.manga.host.id.toLowerCase().includes(phrase)
				) {
					return true;
				}
			}

			return false;
		});
		const hiddenRecordCount = this.state.records.length - records.length;
		const hasMoreRecords = ReadingRecords.getLength() > this.state.records.length;

		return (
			<div className="collection-page-tab-continue-reading">
				<div className="collection-page-filter">
					<AppTextbox
						onChange={this.onChangeFilter}
						text={this.state.filter}
						id="filter"
						placeholder="Filter..."
					/>
				</div>

				{this.state.records.length > 0 ? (
					<div className="collection-page-continue-reading">
						<div className="collection-page-continue-reading-list">
							{records.map(r => {
								const manga = new Manga(r.manga);
								return <MangaContinueReading key={manga.getId()} manga={manga} />;
							})}
						</div>
						{hiddenRecordCount > 0 ? (
							<div className="text-muted">+ {hiddenRecordCount} hidden</div>
						) : null}
						{hasMoreRecords ? (
							<div className="collection-page-continue-reading-controls">
								<span className="collection-page-continue-reading-controls-line" />
								<AppButton onClick={this.onClickLoadMoreRecordsHandler}>
									Load More
								</AppButton>
								<span className="collection-page-continue-reading-controls-line" />
							</div>
						) : null}
					</div>
				) : null}
			</div>
		);
	}

	public render() {
		return (
			<div className="collection-page-main shell-content-padded">
				<div className="page-main-header">
					Welcome to your <span className="accent-gradient-text">Collection</span>
				</div>

				<div className="collection-page-tabs">
					<AppTabs activeTabIndex={this.state.activeTab} changeTabs={this.onChangeTabs}>
						<AppTab index={0} title="Bookmarks" glyph="bookmark">
							{this.renderBookmarks()}
						</AppTab>
						<AppTab index={1} title="Reading records" glyph="time">
							{this.renderReadingRecords()}
						</AppTab>
					</AppTabs>
				</div>
			</div>
		);
	}
}
