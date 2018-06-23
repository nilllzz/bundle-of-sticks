import * as React from 'react';
import { Link } from 'react-router-dom';
import HeaderSearchbar from '../../components/search/header-searchbar';

export default class Header extends React.Component<any, any> {
	public render() {
		return (
			<header>
				<div className="shell-header-body">
					<div className="shell-header-inner">
						<span className="shell-header-title accent-color-text-hover">
							<Link to="/" className="unstyled-link">
								Bundle of Sticks
							</Link>
						</span>
						<div className="shell-header-content">
							<HeaderSearchbar />
						</div>
					</div>
				</div>
			</header>
		);
	}
}
