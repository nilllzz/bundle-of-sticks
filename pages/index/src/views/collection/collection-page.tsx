import * as React from 'react';
import { ReadingRecord } from '../../app/reading-records';
import ReadingRecords from '../../app/reading-records';
import MangaContinueReading from '../../components/manga/manga-continue-reading';
import Manga from '../../app/models/manga.model';
import AppButton from '../../components/app/app-button';
import AppTextbox from '../../components/app/app-textbox';

type CollectionPageState = {
	records: ReadingRecord[];
	hasMoreRecords: boolean;
	filter: string;
};

export default class CollectionPage extends React.Component<any, CollectionPageState> {
	constructor(props: any) {
		super(props);

		const records = ReadingRecords.readLatest(4);
		this.state = {
			filter: '',
			records: records,
			hasMoreRecords: ReadingRecords.getLength() > records.length,
		};

		this.onClickLoadMoreRecordsHandler = this.onClickLoadMoreRecordsHandler.bind(this);
		this.onChangeFilter = this.onChangeFilter.bind(this);
	}

	private onClickLoadMoreRecordsHandler() {
		const records = ReadingRecords.readLatest(this.state.records.length + 4);
		this.setState({
			records: records,
			hasMoreRecords: ReadingRecords.getLength() > records.length,
		});
	}

	private onChangeFilter(text: string) {
		this.setState({
			filter: text,
		});
	}

	public render() {
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

		return (
			<div className="collection-page-main shell-content-padded">
				<div className="page-main-header">
					Welcome to your <span className="accent-gradient-text">Collection</span>
				</div>

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
						{this.state.hasMoreRecords ? (
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
}
