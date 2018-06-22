import * as React from 'react';
import Footer from './footer';
import Header from './header';

export default class Shell extends React.Component<any, any> {
	public render() {
		return (
			<div className="shell-main-body">
				<Header />
				<div className="shell-main-content">
					<div className="shell-main-children">{this.props.children}</div>
				</div>
				<Footer />
			</div>
		);
	}
}
