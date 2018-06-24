import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class Footer extends React.Component<any, any> {
	public render() {
		return (
			<footer>
				<div className="shell-footer-body">
					<div className="shell-footer-upper">
						<span className="shell-footer-subbody">
							Outsourced to chinese slave workers with
							<span className="shell-footer-heart accent-gradient-text">
								<Glyphicon glyph="heart" />
							</span>
						</span>
					</div>
					<div className="shell-footer-lower">
						<span className="shell-footer-subbody">Copyright 20XX</span>
					</div>
				</div>
			</footer>
		);
	}
}
