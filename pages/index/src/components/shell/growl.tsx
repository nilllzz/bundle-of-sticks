import * as React from 'react';

export class GrowlContainer {
	private static idCounter = 0;

	public readonly timeOnScreen: number;
	public readonly id: number;
	public model: any;

	constructor(timeOnScreen: number) {
		this.id = GrowlContainer.idCounter;
		GrowlContainer.idCounter++;

		this.timeOnScreen = timeOnScreen;
	}
}

type GrowlProps = {
	title: string;
	body: string;
	container: GrowlContainer;
	removeThis: (container: GrowlContainer) => void;
};

export default class Growl extends React.Component<GrowlProps, any> {
	private _timeoutHandle: number = null;

	constructor(props: GrowlProps) {
		super(props);

		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
	}

	componentDidMount() {
		this.startRemove();
	}

	private startRemove() {
		this.clearRemove();
		this._timeoutHandle = setTimeout(() => {
			this.props.removeThis(this.props.container);
		}, this.props.container.timeOnScreen) as any;
	}

	private clearRemove() {
		if (this._timeoutHandle) {
			clearTimeout(this._timeoutHandle);
			this._timeoutHandle = null;
		}
	}

	private onMouseEnterHandler() {
		this.clearRemove();
	}

	private onMouseLeaveHandler() {
		this.startRemove();
	}

	public render() {
		return (
			<div
				className="growl-main"
				onMouseEnter={this.onMouseEnterHandler}
				onMouseLeave={this.onMouseLeaveHandler}
			>
				<div className="growl-top-border accent-gradient-background" />
				<div className="growl-content">
					<div className="growl-title">{this.props.title}</div>
					<div className="growl-body">{this.props.body}</div>
				</div>
			</div>
		);
	}
}
