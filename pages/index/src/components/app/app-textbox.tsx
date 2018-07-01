import * as React from 'react';

type AppTextboxProps = {
	text: string;
	id: string;
	placeholder?: string;
	onChange: (text: string) => void;
};

export default class AppTextbox extends React.Component<AppTextboxProps, any> {
	constructor(props: AppTextboxProps) {
		super(props);

		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	private onChangeHandler() {
		const inputElement = document.getElementById(
			'app-textbox-' + this.props.id
		) as HTMLInputElement;
		if (inputElement) {
			this.props.onChange(inputElement.value);
		}
	}

	public render() {
		return (
			<input
				type="text"
				className="app-textbox unstyled-textinput"
				onChange={this.onChangeHandler}
				id={'app-textbox-' + this.props.id}
				value={this.props.text}
				placeholder={this.props.placeholder}
			/>
		);
	}
}
