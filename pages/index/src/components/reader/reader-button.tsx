import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type ReaderButtonProps = {
	glyph: string;
	selected?: boolean;
	onClick?: () => void;
};

export default class ReaderButton extends React.Component<ReaderButtonProps, any> {
	public render() {
		const mainClass = this.props.selected ? ' reader-button-selected' : '';

		return (
			<div
				className={'reader-button-main clickable' + mainClass}
				onClick={this.props.onClick}
			>
				<Glyphicon glyph={this.props.glyph} />
			</div>
		);
	}
}
