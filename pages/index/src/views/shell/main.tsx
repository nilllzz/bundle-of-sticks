import * as React from 'react';
import Footer from './footer';
import Header from './header';
import Nav from '../../components/nav/nav';
import Growls from './growls';
import ReaderBase from '../reader/reader-base';

export default class Shell extends React.Component<any, any> {
	public render() {
		const path = window.location.pathname;
		return (
			<div className="shell-main-body">
				<Header />
				<div className="shell-main-content">
					<div className="shell-split-content">
						<div className="shell-split-content-left">
							<Nav location={path} />
						</div>
						<div className="shell-split-content-right">
							<div className="shell-main-children">{this.props.children}</div>
						</div>
					</div>
				</div>
				<Footer />
				<ReaderBase />
				<Growls />
			</div>
		);
	}
}
