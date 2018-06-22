import * as React from 'react';

export default class Header extends React.Component<any, any> {
	public render() {
		return (
			<header>
				<div className="shell-header-body">
					<div className="shell-header-inner">
						<span className="shell-header-title">
							<a href="/" className="unstyled-link">
								Bundle of Sticks
							</a>
						</span>
					</div>
				</div>
			</header>
		);
	}
}
