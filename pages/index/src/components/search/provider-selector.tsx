import * as React from 'react';
import { Provider } from '../../app/providers';
import { Glyphicon } from 'react-bootstrap';

export type ProviderSelectorProps = {
	updateActiveProviders: (activeProviders: string[]) => void;
	activeProviders: string[];
	providers: Provider[];
};

export default class ProviderSelector extends React.Component<ProviderSelectorProps, any> {
	constructor(props: ProviderSelectorProps) {
		super(props);

		this.clickInActive = this.clickInActive.bind(this);
		this.clickActive = this.clickActive.bind(this);
	}

	private isProviderActive(providerId: string) {
		return this.props.activeProviders.includes(providerId);
	}

	private clickInActive() {
		this.setState({ active: true });
	}

	private clickActive(providerId: string) {
		let activeProviders = this.props.activeProviders.concat([]);
		if (!activeProviders.includes(providerId)) {
			activeProviders.push(providerId);
		} else {
			activeProviders = activeProviders.filter(p => p !== providerId);
		}
		this.props.updateActiveProviders(activeProviders);
	}

	public render() {
		return (
			<div className="provider-selector-main">
				{this.props.providers.map(p => {
					return (
						<div
							id={'provider-selector-' + p.id}
							key={p.id}
							className={
								'provider-selector-card' +
								(this.isProviderActive(p.id)
									? ' provider-selector-card-active'
									: ' provider-selector-card-inactive')
							}
							onClick={() => this.clickActive(p.id)}
						>
							{p.name}
						</div>
					);
				})}
			</div>
		);
	}
}
