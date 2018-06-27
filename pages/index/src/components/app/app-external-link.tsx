import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type AppExternalLinkProps = {
	href: string;
};

export default class AppExternalLink extends React.Component<AppExternalLinkProps, any> {
	public render() {
		return (
			<a className="unstyled-link accent-color-text" href={this.props.href} target="_blank">
				{this.props.children}
				<Glyphicon glyph="new-window" />
			</a>
		);
	}
}
