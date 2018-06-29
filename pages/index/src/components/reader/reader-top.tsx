import * as React from 'react';
import ReaderButton from './reader-button';
import Manga from '../../app/models/manga.model';
import ReaderSettings, { Settings } from './reader-settings';
import ReaderPageControl from './reader-page-control';
import { Glyphicon } from 'react-bootstrap';

type ReaderTopProps = {
	manga: Manga;
	settings: Settings;
	onClose: () => void;
	onToggleOutline: () => void;
	updateSettings: (newSettings: Settings) => void;
	currentPage: number;
	pageCount: number;
	shareLink: string;
	collapsed: boolean;
	toggleCollapsed: () => void;
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
		if (this.props.collapsed) {
			return (
				<div className="reader-top-floating-control">
					<ReaderButton glyph="chevron-down" onClick={this.props.toggleCollapsed} />
				</div>
			);
		}

		return (
			<div className="reader-top-main">
				<div className="reader-top-left">
					<ReaderButton glyph="menu-hamburger" onClick={this.props.onToggleOutline} />
					<div className="reader-top-title">
						<Glyphicon
							glyph="chevron-up"
							className="reader-top-collapse clickable"
							onClick={this.props.toggleCollapsed}
						/>
						<strong>{this.props.manga.name}</strong>
					</div>
				</div>
				<div className="reader-top-right">
					<ReaderPageControl
						currentPage={this.props.currentPage}
						pageCount={this.props.pageCount}
						shareLink={this.props.shareLink}
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
