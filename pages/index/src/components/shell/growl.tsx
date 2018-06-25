import * as React from 'react';

export class GrowlContainer {
	private static idCounter = 0;

	public readonly timeOnScreen: number;
	public readonly id: number;
	public model: any;
	public isHovering = false;

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
};

export default class Growl extends React.Component<GrowlProps, any> {
	constructor(props: GrowlProps) {
		super(props);

		this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
		this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
	}

	private onMouseEnterHandler() {
		this.props.container.isHovering = true;
	}

	private onMouseLeaveHandler() {
		this.props.container.isHovering = false;
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
