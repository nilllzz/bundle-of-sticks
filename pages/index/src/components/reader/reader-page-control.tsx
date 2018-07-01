import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as Copy from 'copy-to-clipboard';
import Growls from '../../views/shell/growls';

type ReaderPageControlProps = {
	currentPage: number;
	pageCount: number;
	shareLink: string;
};

export default class ReaderPageControl extends React.Component<ReaderPageControlProps, any> {
	constructor(props: ReaderPageControlProps) {
		super(props);

		this.onCopyHandler = this.onCopyHandler.bind(this);
	}

	private onCopyHandler() {
		// copy text to clipboard
		const success = Copy(this.props.shareLink);
		if (success) {
			Growls.add('Link copied', 'The link to this page has been copied to your clipboard');
		} else {
			Growls.add(
				'Error',
				'Failed to copy link to clipboard. You can manually copy it here: ' +
					this.props.shareLink,
				5000
			);
		}
	}

	public render() {
		if (this.props.pageCount === 0) {
			return null;
		}

		return (
			<div className="reader-page-control-main">
				{this.props.currentPage} / {this.props.pageCount}
				<Glyphicon
					glyph="link"
					className="reader-page-control-link clickable"
					onClick={this.onCopyHandler}
				/>
			</div>
		);
	}
}
