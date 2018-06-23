import * as React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component<any, any> {
	public render() {
		return (
			<header>
				<div className="shell-header-body">
					<div className="shell-header-inner">
						<span className="shell-header-title">
							<Link to="/" className="unstyled-link">
								Bundle of Sticks
							</Link>
						</span>
					</div>
				</div>
			</header>
		);
	}
}
