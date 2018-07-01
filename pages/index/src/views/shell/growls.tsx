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

		this.removeGrowl = this.removeGrowl.bind(this);
	}

	public static add(title: string, body = '', timeOnScreen = 2500) {
		const container = new GrowlContainer(timeOnScreen);
		this._handle.addGrowl(container, title, body);
	}

	private addGrowl(container: GrowlContainer, title: string, body: string) {
		container.model = (
			<Growl
				title={title}
				body={body}
				container={container}
				key={container.id}
				removeThis={this.removeGrowl}
			/>
		);

		const growls = this.state.growls;
		growls.push(container);

		this.setState({
			growls: growls,
		});
	}

	private removeGrowl(container: GrowlContainer) {
		const growls = this.state.growls.filter(g => g.id !== container.id);
		this.setState({
			growls: growls,
		});
	}

	public render() {
		return <div className="growls-main">{this.state.growls.map(g => g.model)}</div>;
	}
}
