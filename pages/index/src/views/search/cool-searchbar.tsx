import * as React from 'react';

type CoolSearchbarState = {
	clicked: boolean;
};

type CoolSearchbarProps = {
	onSearch: (query: string) => void;
	text: string;
	highlight: string;
};

export default class CoolSearchbar extends React.Component<CoolSearchbarProps, CoolSearchbarState> {
	constructor(props: CoolSearchbarProps) {
		super(props);

		this.state = { clicked: false };

		this.onClick = this.onClick.bind(this);
		this.onUnFocus = this.onUnFocus.bind(this);
		this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
	}

	private onClick() {
		this.setState({ clicked: true }, () => {
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
				this.props.onSearch(inputElement.value);
				inputElement.value = '';
				inputElement.blur();
				this.setState({
					clicked: false,
				});
			}
		}
	}

	public render() {
		return (
			<div className="cool-searchbar-main">
				{!this.state.clicked ? (
					<div className="cool-searchbar-placeholder" onClick={this.onClick}>
						{this.props.text}
						<b className="accent-color-text">{this.props.highlight}</b>
					</div>
				) : (
					<div className="cool-searchbar-container">
						<input
							id="cool-searchbar"
							className="cool-searchbar-input unstyled-textinput accent-color-text"
							placeholder="Start typing to find Manga"
							onBlur={this.onUnFocus}
							onKeyUp={this.onKeyPressHandler}
						/>
					</div>
				)}
			</div>
		);
	}
}
