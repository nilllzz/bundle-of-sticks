import * as React from 'react';
import NavItem from './nav-item';
import NavSeparator from './nav-separator';

type NavProps = {
	location: string;
};

export default class Nav extends React.Component<NavProps, any> {
	public render() {
		return (
			<nav className="nav-main">
				<div className="nav-list">
					<NavItem text="Home" icon="home" linkTo="/" location={this.props.location} />
					<NavItem
						text="Search"
						icon="search"
						linkTo="/search"
						location={this.props.location}
					/>
					<NavSeparator />
					<NavItem
						text="Collection"
						icon="bookmark"
						linkTo="/collection"
						location={this.props.location}
					/>
					<NavItem
						text="History"
						linkTo="/history"
						location={this.props.location}
						icon="time"
					/>
					<NavSeparator />
					<NavItem text="Sources" linkTo="/sources" location={this.props.location} />
				</div>
			</nav>
		);
	}
}
