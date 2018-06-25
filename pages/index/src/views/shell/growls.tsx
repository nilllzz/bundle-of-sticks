import * as React from 'react';
import Growl from '../../components/shell/growl';
import { GrowlContainer } from '../../components/shell/growl';

type GrowlsState = {
	growls: GrowlContainer[];
};

export default class Growls extends React.Component<any, GrowlsState> {
	private static _handle: Growls;

	constructor(props: any) {
		super(props);

		Growls._handle = this;

		this.state = { growls: [] };
	}

	public static add(title: string, body = '', timeOnScreen = 2500) {
		const container = new GrowlContainer(timeOnScreen);
		container.model = (
			<Growl title={title} body={body} container={container} key={container.id} />
		);
		this._handle.addGrowl(container);
	}

	private addGrowl(growl: GrowlContainer) {
		const growls = this.state.growls;
		growls.push(growl);

		this.setState(
			{
				growls: growls,
			},
			() => {
				this.tryRemoveGrowl(growl);
			}
		);
	}

	private tryRemoveGrowl(growl: GrowlContainer) {
		setTimeout(() => {
			if (growl.isHovering) {
				this.tryRemoveGrowl(growl);
			} else {
				this.removeGrowl(growl);
			}
		}, growl.timeOnScreen);
	}

	private removeGrowl(growl: GrowlContainer) {
		const growls = this.state.growls.filter(g => g.id !== growl.id);
		this.setState({
			growls: growls,
		});
	}

	public render() {
		return <div className="growls-main">{this.state.growls.map(g => g.model)}</div>;
	}
}
