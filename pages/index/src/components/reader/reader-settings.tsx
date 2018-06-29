import * as React from 'react';
import ReaderCheckbox from './reader-checkbox';
import { Fade } from 'react-bootstrap';

export type Settings = {
	pageAlignment: 'scroll' | 'fit-horizontal' | 'fit-vertical';
	cacheChapter: boolean;
	flatOutline: boolean;
};

type ReaderSettingsProps = {
	settings: Settings;
	updateSettings: (newSettings: Settings) => void;
	visible: boolean;
};

export default class ReaderSettings extends React.Component<ReaderSettingsProps, any> {
	constructor(props: ReaderSettingsProps) {
		super(props);

		this.onCheckAlignment = this.onCheckAlignment.bind(this);
		this.onCheckCacheChapter = this.onCheckCacheChapter.bind(this);
		this.onCheckFlatOutline = this.onCheckFlatOutline.bind(this);
	}

	public static getDefaultSettings(): Settings {
		return {
			pageAlignment: 'scroll',
			cacheChapter: false,
			flatOutline: false,
		};
	}

	private onCheckAlignment(alignment: 'scroll' | 'fit-horizontal' | 'fit-vertical') {
		const settings = this.props.settings;
		settings.pageAlignment = alignment;
		this.props.updateSettings(settings);
	}

	private onCheckCacheChapter() {
		const settings = this.props.settings;
		settings.cacheChapter = !this.props.settings.cacheChapter;
		this.props.updateSettings(settings);
	}

	private onCheckFlatOutline() {
		const settings = this.props.settings;
		settings.flatOutline = !this.props.settings.flatOutline;
		this.props.updateSettings(settings);
	}

	public render() {
		return (
			<Fade in={this.props.visible} unmountOnExit>
				<div className="reader-settings-main reader-popup">
					<div className="reader-settings-title">Settings</div>
					<div className="reader-settings-section">
						<div className="reader-settings-section-header">Page alignment</div>
						<div className="reader-settings-section-body">
							<ReaderCheckbox
								checked={this.props.settings.pageAlignment === 'scroll'}
								onChecked={() => this.onCheckAlignment('scroll')}
							>
								Scroll
							</ReaderCheckbox>
							<ReaderCheckbox
								checked={this.props.settings.pageAlignment === 'fit-horizontal'}
								onChecked={() => this.onCheckAlignment('fit-horizontal')}
							>
								Fit horizontally
							</ReaderCheckbox>
							<ReaderCheckbox
								checked={this.props.settings.pageAlignment === 'fit-vertical'}
								onChecked={() => this.onCheckAlignment('fit-vertical')}
							>
								Fit vertically
							</ReaderCheckbox>
						</div>
					</div>
					<div className="reader-settings-section">
						<div className="reader-settings-section-header">Cache</div>
						<div className="reader-settings-section-body">
							<ReaderCheckbox
								checked={this.props.settings.cacheChapter}
								onChecked={this.onCheckCacheChapter}
							>
								Cache Chapter
							</ReaderCheckbox>
						</div>
					</div>
					<div className="reader-settings-section">
						<div className="reader-settings-section-header">Outline</div>
						<div className="reader-settings-section-body">
							<ReaderCheckbox
								checked={this.props.settings.flatOutline}
								onChecked={this.onCheckFlatOutline}
							>
								Only show chapters
							</ReaderCheckbox>
						</div>
					</div>
				</div>
			</Fade>
		);
	}
}
