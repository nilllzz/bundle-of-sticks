import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type AppTabProps = {
	index: number;
	title: string;
	glyph?: string;
};

export class AppTab extends React.Component<AppTabProps, any> {
	public render() {
		return <div className="app-tab-main">{this.props.children}</div>;
	}
}

type AppTabsProps = {
	activeTabIndex: number;
	changeTabs: (newTab: number) => void;
};

export default class AppTabs extends React.Component<AppTabsProps, any> {
	private renderTab(tabProps: AppTabProps) {
		const isActive = tabProps.index === this.props.activeTabIndex;
		const tabClass = 'app-tabs-tab clickable' + (isActive ? ' app-tabs-tab-active' : '');
		return (
			<div
				onClick={() => this.props.changeTabs(tabProps.index)}
				className={tabClass}
				key={tabProps.index}
			>
				{tabProps.glyph ? (
					<Glyphicon glyph={tabProps.glyph} className="app-tabs-tab-glyph" />
				) : null}
				{tabProps.title}
			</div>
		);
	}

	public render() {
		const children = React.Children.toArray(this.props.children) as any[];
		const activeChild = children.find(c => c.props.index === this.props.activeTabIndex);

		return (
			<div className="app-tabs-main">
				<div className="app-tabs-row">
					{children.map(child => {
						const props = child.props;
						return this.renderTab(props);
					})}
				</div>
				{activeChild}
			</div>
		);
	}
}
