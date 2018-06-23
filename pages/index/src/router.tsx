import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './views/home/home-page';
import Shell from './views/shell/main';
import NotFoundPage from './views/not-found/not-found-page';
import SearchPage from './views/search/search-page';

export default class PageRouter extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	public render() {
		return (
			<BrowserRouter>
				<div>
					<Shell>
						<Switch>
							<Route path="/" exact component={HomePage} />
							<Route path="/search" component={SearchPage} />
							<Route component={NotFoundPage} />
						</Switch>
					</Shell>
				</div>
			</BrowserRouter>
		);
	}
}
