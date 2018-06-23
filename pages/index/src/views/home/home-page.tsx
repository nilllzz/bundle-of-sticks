import * as React from 'react';
import Nav from '../../components/nav/nav';

export default class HomePage extends React.Component<any, any> {
	public render() {
		return (
			<div className="home-main">
				<div className="home-left shell-split-content-left">
					<Nav location={this.props.location.pathname} />
				</div>
				<div className="home-right shell-split-content-right">some gay ass content</div>
			</div>
		);
	}
}
