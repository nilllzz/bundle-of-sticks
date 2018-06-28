import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type ReaderOutlineItemProps = {
	glyph?: string;
	textMain: string;
	textSub: string;
	active: boolean;
	collapsed: boolean;
	onClick?: () => void;
};

export default class ReaderOutlineItem extends React.Component<ReaderOutlineItemProps, any> {
	public render() {
		return (
			<div className="reader-outline-item-main">
				{this.props.glyph ? (
					<Glyphicon glyph={this.props.glyph} className="text-muted" />
				) : null}

				<div className="reader-outline-item-num clickable" onClick={this.props.onClick}>
					<span className={this.props.active ? 'accent-color-text' : ''}>
						{this.props.textMain}
					</span>
				</div>
				<div className="reader-outline-item-name">
					<span className="text-muted">{this.props.textSub}</span>
				</div>
				{!this.props.collapsed ? (
					<div className="reader-outline-item-children">{this.props.children}</div>
				) : null}
			</div>
		);
	}
}
