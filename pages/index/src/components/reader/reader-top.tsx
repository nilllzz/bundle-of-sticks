import * as React from 'react';
import ReaderButton from './reader-button';
import Manga from '../../app/models/manga.model';
import ReaderSettings, { Settings } from './reader-settings';
import ReaderPageControl from './reader-page-control';
import { KeyboardEventBus } from '../../app/keyboard-helper';

type ReaderTopProps = {
	manga: Manga;
	settings: Settings;
	onClose: () => void;
	onToggleOutline: () => void;
	updateSettings: (newSettings: Settings) => void;
	currentPage: number;
	pageCount: number;
};

type ReaderTopState = {
	settingsVisible: boolean;
};

export default class ReaderTop extends React.Component<ReaderTopProps, ReaderTopState> {
	constructor(props: ReaderTopProps) {
		super(props);

		this.state = { settingsVisible: false };

		this.onToggleSettingsHandler = this.onToggleSettingsHandler.bind(this);
	}

	private onToggleSettingsHandler() {
		this.setState({
			settingsVisible: !this.state.settingsVisible,
		});
	}

	public render() {
		return (
			<div className="reader-top-main">
				<div className="reader-top-left">
					<ReaderButton glyph="menu-hamburger" onClick={this.props.onToggleOutline} />
					<span className="reader-top-title">
						<strong>{this.props.manga.name}</strong>
					</span>
				</div>
				<div className="reader-top-right">
					<ReaderPageControl
						currentPage={this.props.currentPage}
						pageCount={this.props.pageCount}
					/>
					<ReaderButton glyph="cog" onClick={this.onToggleSettingsHandler} />
					<ReaderButton glyph="remove" onClick={this.props.onClose} />
				</div>
				<ReaderSettings
					updateSettings={this.props.updateSettings}
					settings={this.props.settings}
					visible={this.state.settingsVisible}
				/>
			</div>
		);
	}
}
