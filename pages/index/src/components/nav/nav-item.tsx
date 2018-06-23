import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type NavItemProps = {
	text: string;
	linkTo: string;
	icon?: string;
	location: string;
};

export default class NavItem extends React.Component<NavItemProps, any> {
	private getClass() {
		return this.props.linkTo === this.props.location ? 'nav-item-selected' : '';
	}

	public render() {
		return (
			<div className={'nav-item-main ' + this.getClass()}>
				<Link to={this.props.linkTo} className="unstyled-link">
					{this.props.icon ? (
						<Glyphicon glyph={this.props.icon} />
					) : (
						<span className="nav-item-icon-replacement" />
					)}
					<span className="nav-item-text">{this.props.text}</span>
				</Link>
			</div>
		);
	}
}
