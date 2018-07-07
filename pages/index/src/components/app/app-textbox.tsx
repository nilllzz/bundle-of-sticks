import * as React from 'react';

type AppTextboxProps = {
	text: string;
	id: string;
	placeholder?: string;
	onChange?: (text: string) => void;
	onKeyDown?: (keycode: number) => void;
};

export default class AppTextbox extends React.Component<AppTextboxProps, any> {
	constructor(props: AppTextboxProps) {
		super(props);

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
	}

	private onChangeHandler() {
		const inputElement = document.getElementById(
			'app-textbox-' + this.props.id
		) as HTMLInputElement;
		if (inputElement) {
			this.props.onChange(inputElement.value);
		}
	}

	private onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
		if (this.props.onKeyDown) {
			this.props.onKeyDown(event.keyCode);
		}
	}

	public render() {
		return (
			<input
				type="text"
				className="app-textbox unstyled-textinput"
				onChange={this.onChangeHandler}
				onKeyDown={this.onKeyDownHandler}
				id={'app-textbox-' + this.props.id}
				value={this.props.text}
				placeholder={this.props.placeholder}
			/>
		);
	}
}
