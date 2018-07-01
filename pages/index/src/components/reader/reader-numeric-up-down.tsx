import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type ReaderNumericUpDownProps = {
	value: number;
	min: number;
	max: number;
	defaultValue: number;
	onChange: (value: number) => void;
	id: string;
};

export default class ReaderNumericUpDown extends React.Component<ReaderNumericUpDownProps, any> {
	constructor(props: ReaderNumericUpDownProps) {
		super(props);

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.onPlusClickHandler = this.onPlusClickHandler.bind(this);
		this.onMinusClickHandler = this.onMinusClickHandler.bind(this);
	}

	private static includesNonNumeric(value: string) {
		const numerics = '0123456789'.split('');
		for (let i = 0; i < value.length; i++) {
			const c = value.charAt(i);
			if (!numerics.includes(c)) {
				return true;
			}
		}
		return false;
	}

	private getValue(): number | '' {
		const inputElement = document.getElementById(
			'reader-numeric-up-down-input-' + this.props.id
		) as HTMLInputElement;
		if (inputElement) {
			let value = inputElement.value;
			if (value === '') {
				return '';
			}

			const numerics = '0123456789'.split('');
			while (value.length > 0 && ReaderNumericUpDown.includesNonNumeric(value)) {
				for (let i = 0; i < value.length; i++) {
					const c = value.charAt(i);
					if (!numerics.includes(c)) {
						value = value.substr(0, i) + value.substr(i + 1);
					}
				}
			}
			if (value.length === 0) {
				return '';
			}
			return Number.parseInt(value);
		}
		return '';
	}

	private onChangeHandler() {
		const value = this.getValue();
		if (value === '') {
			this.props.onChange(this.props.value);
		} else {
			if (value > this.props.max) {
				this.props.onChange(this.props.max);
			} else if (value < this.props.min) {
				this.props.onChange(this.props.min);
			} else {
				this.props.onChange(value);
			}
		}
	}

	private onPlusClickHandler() {
		let value = this.getValue();
		if (value === '') {
			this.props.onChange(this.props.defaultValue + 1);
		} else {
			value += 10;
			if (value >= this.props.max) {
				this.props.onChange(this.props.max);
			} else {
				this.props.onChange(value);
			}
		}
	}

	private onMinusClickHandler() {
		let value = this.getValue();
		if (value === '') {
			this.props.onChange(this.props.defaultValue - 1);
		} else {
			value -= 10;
			if (value <= this.props.min) {
				this.props.onChange(this.props.min);
			} else {
				this.props.onChange(value);
			}
		}
	}

	public render() {
		return (
			<div className="reader-numeric-up-down-main">
				<div
					className="reader-numeric-up-down-button clickable"
					onClick={this.onMinusClickHandler}
				>
					<Glyphicon glyph="minus" />
				</div>
				<input
					type="text"
					className="unstyled-textinput reader-numeric-up-down-input"
					value={this.props.value}
					onChange={this.onChangeHandler}
					id={'reader-numeric-up-down-input-' + this.props.id}
				/>
				<div
					className="reader-numeric-up-down-button clickable"
					onClick={this.onPlusClickHandler}
				>
					<Glyphicon glyph="plus" />
				</div>
			</div>
		);
	}
}
