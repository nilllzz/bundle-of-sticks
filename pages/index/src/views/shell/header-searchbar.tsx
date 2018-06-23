import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type HeaderSearchbarState = {
	query: string;
};

export default class HeaderSearchbar extends React.Component<any, HeaderSearchbarState> {
	constructor(props: any) {
		super(props);

		this.state = { query: '' };

		this.setQuery = this.setQuery.bind(this);
		this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
	}

	private setQuery() {
		const inputElement = document.getElementById('header-searchbar') as HTMLInputElement;
		this.setState({
			query: inputElement.value,
		});
	}

	private onKeyPressHandler(e: React.KeyboardEvent<HTMLInputElement>) {
		e.which = e.which || e.keyCode;
		// 13 => enter
		if (e.keyCode === 13 && this.state.query) {
			const element = document.getElementById('header-searchbar-search');
			element.click();
		}
	}

	public render() {
		return (
			<div className="header-searchbar-main">
				<input
					id="header-searchbar"
					className="header-searchbar-input"
					type="text"
					placeholder="Search Mangas"
					value={this.state.query}
					onChange={this.setQuery}
					onKeyUp={this.onKeyPressHandler}
				/>
				<Glyphicon className="header-searchbar-icon" glyph="search" />
				<Link
					to={'/search?query=' + this.state.query}
					hidden
					id="header-searchbar-search"
				/>
				<div />
			</div>
		);
	}
}
