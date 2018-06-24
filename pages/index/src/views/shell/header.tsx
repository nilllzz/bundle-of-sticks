import * as React from 'react';
import { Link } from 'react-router-dom';
import PrivacyModeSwitcher from '../../components/shell/privacy-mode-switcher';

export default class Header extends React.Component<any, any> {
	public render() {
		return (
			<header>
				<div className="shell-header-body">
					<div className="shell-header-inner">
						<span className="shell-header-title accent-gradient-text-hover">
							<Link to="/" className="unstyled-link">
								Bundle of Sticks
							</Link>
						</span>
						<div className="shell-header-content">
							<PrivacyModeSwitcher />
						</div>
					</div>
				</div>
			</header>
		);
	}
}
