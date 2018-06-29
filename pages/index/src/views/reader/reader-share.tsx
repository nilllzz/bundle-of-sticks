import * as React from 'react';
import Info from '../../app/models/info.model';
import AppLoading from '../../components/app/app-loading';
import { Api } from '../../app/api';
import AppButton from '../../components/app/app-button';
import { Glyphicon } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import ReaderBase from './reader-base';
import { ReadingRecord } from '../../app/reading-records';

type ReaderShareState = {
	info: Info;
	loading: boolean;
	success: boolean;
};

export default class ReaderShare extends React.Component<any, ReaderShareState> {
	private _provider: string;
	private _link: string;
	private _folder: string;
	private _volume: number;
	private _chapter: number;
	private _pageNumber: number;

	constructor(props: any) {
		super(props);

		this.state = { info: null, success: false, loading: true };

		this._provider = this.props.match.params.provider;
		this._link = this.props.match.params.link;
		this._folder = this.props.match.params.folder;
		this._volume = Number.parseInt(this.props.match.params.volume);
		this._chapter = Number.parseInt(this.props.match.params.chapter);
		this._pageNumber = Number.parseInt(this.props.match.params.pageNumber);

		this.onRetryHandler = this.onRetryHandler.bind(this);
	}

	async componentDidMount() {
		this.loadInfo();
	}

	private async loadInfo() {
		const response = await Api.getRequest('/api/manga/info', {
			host: this._provider,
			manga: this._link,
		});
		const info = new Info(response.data);
		this.setState({
			info: info,
			loading: false,
			success: response.success,
		});

		if (response.success) {
			// construct reading record for where to start
			const record = {
				manga: info.manga,
				page: this._pageNumber - 1, // index
				chapter: this._chapter,
				volume: this._volume,
				folderId: this._folder,
			} as ReadingRecord;

			ReaderBase.show(info.manga, info.folders, record);
		}
	}

	private onRetryHandler() {
		this.setState(
			{
				loading: true,
				info: null,
				success: false,
			},
			() => {
				this.loadInfo();
			}
		);
	}

	private renderMain() {
		if (this.state.loading) {
			return <AppLoading />;
		} else {
			if (!this.state.success) {
				return (
					<div className="reader-share-fail">
						<span className="accent-color-text">
							<Glyphicon glyph="exclamation-sign" />
						</span>{' '}
						Failed to fetch manga information!
						<div className="reader-share-fail-controls">
							<AppButton onClick={this.onRetryHandler} icon="repeat" main>
								Retry
							</AppButton>
							<Link to="/" className="unstyled-link">
								<AppButton icon="home" dark>
									Homepage
								</AppButton>
							</Link>
						</div>
					</div>
				);
			} else {
				return <Redirect to={this.state.info.manga.getUrl()} />;
			}
		}
	}

	public render() {
		return (
			<div className="reader-share-main">
				<div className="reader-share-content">
					<div className="reader-share-title">Open Manga</div>
					{this.renderMain()}
				</div>
			</div>
		);
	}
}
