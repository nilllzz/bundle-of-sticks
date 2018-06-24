import * as React from 'react';
import AppButton from '../../components/app/app-button';
import Providers, { Provider } from '../../app/providers';
import LocalState from '../../app/local-state';
import CoolSearchbar from '../../components/search/cool-searchbar';

type HomePageState = {
	nextQuery: string | null;
	activeProviders: string[];
};

export default class HomePage extends React.Component<any, HomePageState> {
	readonly providers: Provider[];

	constructor(props: any) {
		super(props);

		this.providers = Providers.getList();

		const selectedProviders = LocalState.readDefault(
			'selected-providers',
			this.providers.map(p => p.id)
		) as string[];

		this.state = {
			nextQuery: null,
			activeProviders: selectedProviders,
		};

		this.onUpdateActiveProviders = this.onUpdateActiveProviders.bind(this);
	}

	private onUpdateActiveProviders(activeProviders: string[]) {
		LocalState.write('selected-providers', activeProviders);
		this.setState({
			activeProviders: activeProviders,
		});
	}

	public render() {
		return (
			<div className="home-main">
				<div className="home-banner accent-gradient-background">
					<div className="page-main-header">BUNDLE 👏 OF 👏 STICKS 👏</div>
				</div>

				<div className="shell-content-padded">
					<CoolSearchbar
						text="Click to search "
						highlight="Mangas"
						updateActiveProviders={this.onUpdateActiveProviders}
						activeProviders={this.state.activeProviders}
						providers={this.providers}
					/>
				</div>
			</div>
		);
	}
}
