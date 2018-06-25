import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type AppButtonProps = {
	onClick?: () => void;
	icon?: string;
};

export default class AppButton extends React.Component<AppButtonProps, any> {
	public render() {
		return (
			<div className="app-button clickable" onClick={this.props.onClick}>
				{this.props.icon ? (
					<Glyphicon className="app-button-icon" glyph={this.props.icon} />
				) : null}
				{this.props.children}
			</div>
		);
	}
}
