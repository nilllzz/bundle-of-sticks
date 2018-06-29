import * as React from 'react';

type MangaSummaryProps = {
	summary: string;
};

type MangaSummaryState = {
	expanded: boolean;
};

export default class MangaSummary extends React.Component<MangaSummaryProps, MangaSummaryState> {
	private readonly shortSummary: string;

	constructor(props: MangaSummaryProps) {
		super(props);

		if (this.props.summary && this.props.summary.length > 400) {
			// show 500 chars
			this.shortSummary = this.props.summary.substr(0, 400);
			// try to cut at a space
			const lastSpaceIndex = this.shortSummary.lastIndexOf(' ');
			if (lastSpaceIndex > 375) {
				this.shortSummary = this.shortSummary.substring(0, lastSpaceIndex);
			}
			this.shortSummary += '... ';
			this.state = { expanded: false };
		} else {
			this.state = { expanded: true };
		}

		this.onClickExpandHandler = this.onClickExpandHandler.bind(this);
	}

	onClickExpandHandler() {
		this.setState({
			expanded: true,
		});
	}

	public render() {
		if (!this.props.summary) {
			return null;
		}

		if (this.state.expanded) {
			return (
				<div className="manga-summary-main">
					<span>{this.props.summary}</span>
				</div>
			);
		} else {
			return (
				<div className="manga-summary-main">
					<span>{this.shortSummary}</span>
					<em>
						<span
							className="clickable accent-color-text"
							onClick={this.onClickExpandHandler}
						>
							{' '}
							Expand
						</span>
					</em>
				</div>
			);
		}
	}
}
