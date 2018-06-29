import * as React from 'react';

type ReaderPageControlProps = {
	currentPage: number;
	pageCount: number;
};

export default class ReaderPageControl extends React.Component<ReaderPageControlProps, any> {
	public render() {
		return (
			<div className="reader-page-control-main">
				{this.props.currentPage} / {this.props.pageCount}
			</div>
		);
	}
}
