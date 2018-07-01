import * as React from 'react';
import { KeyboardEventBus, Keys } from '../../app/keyboard-helper';
import { Glyphicon } from 'react-bootstrap';

type ReaderPageInputProps = {
	keyboardEventBus: KeyboardEventBus;
	onSelect: (pageIndex: number) => void;
	pageCount: number;
};

type ReaderPageInputState = {
	visible: boolean;
	input: string;
};

export default class ReaderPageInput extends React.Component<
	ReaderPageInputProps,
	ReaderPageInputState
> {
	private _timeoutHandle: number = null;
	private mouseEntered: boolean = false;

	constructor(props: ReaderPageInputProps) {
		super(props);

		this.state = { visible: false, input: '' };

		this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
		this.close = this.close.bind(this);
		this.go = this.go.bind(this);
		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
		// sub after bind
		this.props.keyboardEventBus.subscribe('reader-page-input', this.onKeyDownHandler);
	}

	componentDidMount() {
		this.props.keyboardEventBus.subscribe('reader-page-input', this.onKeyDownHandler);
	}

	componentWillUnmount() {
		this.clearCountdown();
		this.props.keyboardEventBus.unsubscribe('reader-page-input');
	}

	private onKeyDownHandler(keyCode: number) {
		if (this.state.visible) {
			if (keyCode === Keys.Escape) {
				this.close();
				return true;
			}

			if (keyCode === Keys.Enter) {
				this.go();
				return true;
			}

			if (keyCode === Keys.Backspace) {
				if (this.state.input.length > 1) {
					this.setState({
						input: this.state.input.substr(0, this.state.input.length - 1),
					});
					this.startCountdown();
				} else if (this.state.input !== '1') {
					this.setState({
						input: '1',
					});
					this.startCountdown();
				} else {
					this.close();
				}
				return true;
			}
		}

		if (this.props.pageCount > 0) {
			const numeric = Keys.getNumericalValue(keyCode);
			if (numeric > -1) {
				let newPageNumber = Number.parseInt(this.state.input + numeric.toString());
				if (newPageNumber > this.props.pageCount) {
					newPageNumber = this.props.pageCount;
				} else if (newPageNumber < 1) {
					newPageNumber = 1;
				}
				this.setState({
					input: newPageNumber.toString(),
					visible: true,
				});
				this.startCountdown();
				return true;
			}
		}
		return false;
	}

	private startCountdown() {
		this.clearCountdown();

		// after inputting a page number, a 1 second countdown starts after which it will navigate to the page
		// only do this if the mouse is not in the div
		if (!this.mouseEntered) {
			this._timeoutHandle = setTimeout(this.go, 1000) as any;
		}
	}

	private clearCountdown() {
		if (this._timeoutHandle) {
			clearTimeout(this._timeoutHandle);
			this._timeoutHandle = null;
		}
	}

	private go() {
		const pageIndex = Number.parseInt(this.state.input) - 1;
		this.props.onSelect(pageIndex);
		this.close();
	}

	private close() {
		this.clearCountdown();
		this.setState({
			visible: false,
			input: '',
		});
	}

	private onMouseEnterHandler() {
		this.mouseEntered = true;
		this.clearCountdown();
	}

	private onMouseLeaveHandler() {
		this.mouseEntered = false;
		this.startCountdown();
	}

	public render() {
		if (!this.state.visible || this.props.pageCount === 0) {
			return null;
		}

		return (
			<div
				className="reader-page-input-main reader-popup"
				onMouseEnter={this.onMouseEnterHandler}
				onMouseLeave={this.onMouseLeaveHandler}
			>
				<div className="reader-page-input-header">
					<div className="reader-page-input-title">Go to page</div>
					<Glyphicon glyph="remove" className="clickable" onClick={this.close} />
				</div>
				<div className="reader-page-input-body">
					<span className="accent-color-text">
						<strong>{this.state.input}</strong>
					</span>
					<span className="text-muted">/{this.props.pageCount}</span>
				</div>
			</div>
		);
	}
}
