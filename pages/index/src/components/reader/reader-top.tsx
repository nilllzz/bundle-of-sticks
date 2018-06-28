import * as React from 'react';
import ReaderButton from './reader-button';
import Manga from '../../app/models/manga.model';

type ReaderTopProps = {
	manga: Manga;
	onClose: () => void;
	onToggleOutline: () => void;
};

export default class ReaderTop extends React.Component<ReaderTopProps, any> {
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
					<ReaderButton glyph="remove" onClick={this.props.onClose} />
				</div>
			</div>
		);
	}
}
