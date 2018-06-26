import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type AppButtonProps = {
	onClick?: () => void;
	icon?: string;
	main?: boolean;
};

export default class AppButton extends React.Component<AppButtonProps, any> {
	public render() {
		let mainClass = 'app-button clickable';
		if (this.props.main) {
			mainClass += ' app-button-main';
		}

		return (
			<div className={mainClass} onClick={this.props.onClick}>
				{this.props.icon ? (
					<Glyphicon className="app-button-icon" glyph={this.props.icon} />
				) : null}
				{this.props.children}
			</div>
		);
	}
}
