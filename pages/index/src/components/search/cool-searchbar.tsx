import * as React from 'react';
import { Collapse, Fade } from 'react-bootstrap';
import ProviderSelector, { ProviderSelectorProps } from './provider-selector';
import { Provider } from '../../app/providers';
import { Link } from 'react-router-dom';

type CoolSearchbarState = {
	clicked: boolean;
	showProviderSelector: boolean;
	nextQuery: string | null;
};

type CoolSearchbarProps = ProviderSelectorProps & {
	text: string;
	highlight: string;
};

export default class CoolSearchbar extends React.Component<CoolSearchbarProps, CoolSearchbarState> {
	readonly providers: Provider[];

	constructor(props: CoolSearchbarProps) {
		super(props);

		this.state = { clicked: false, showProviderSelector: false, nextQuery: null };

		this.onClick = this.onClick.bind(this);
		this.onUnFocus = this.onUnFocus.bind(this);
		this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
	}

	private onClick() {
		this.setState({ clicked: true, showProviderSelector: true }, () => {
			const inputElement = document.getElementById('cool-searchbar');
			inputElement.focus();
		});
	}

	private onUnFocus() {
		const inputElement = document.getElementById('cool-searchbar') as HTMLInputElement;
		if (inputElement.value.length === 0) {
			this.setState({
				clicked: false,
			});
		}
	}

	private onKeyPressHandler(e: React.KeyboardEvent<HTMLInputElement>) {
		const inputElement = document.getElementById('cool-searchbar') as HTMLInputElement;
		if (inputElement.value.length > 0) {
			e.which = e.which || e.keyCode;
			// 13 => enter
			if (e.keyCode === 13) {
				this.startSearch(inputElement.value);
				inputElement.value = '';
				inputElement.blur();
				this.setState({
					clicked: false,
					showProviderSelector: false,
				});
			}
		}
	}

	private startSearch(query: string) {
		this.setState(
			{
				nextQuery: query,
			},
			() => {
				const element = document.getElementById('cool-searchbar-search-next');
				element.click();
			}
		);
	}

	public render() {
		return (
			<div className="cool-searchbar-main">
				{!this.state.clicked ? (
					<div className="cool-searchbar-placeholder" onClick={this.onClick}>
						{this.props.text}
						<b className="accent-gradient-text">{this.props.highlight}</b>
					</div>
				) : (
					<div className="cool-searchbar-container">
						<input
							id="cool-searchbar"
							className="cool-searchbar-input unstyled-textinput accent-gradient-text"
							placeholder="Start typing to find Manga"
							onBlur={this.onUnFocus}
							onKeyUp={this.onKeyPressHandler}
						/>
					</div>
				)}
				<Collapse in={this.state.showProviderSelector}>
					<div>
						<ProviderSelector
							providers={this.props.providers}
							updateActiveProviders={this.props.updateActiveProviders}
							activeProviders={this.props.activeProviders}
						/>{' '}
					</div>
				</Collapse>
				<Link
					to={'/search?query=' + this.state.nextQuery}
					hidden
					id="cool-searchbar-search-next"
				/>
			</div>
		);
	}
}
