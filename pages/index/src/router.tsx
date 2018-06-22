import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './views/home/homePage';
import Shell from './views/shell/main';

export default class PageRouter extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	public render() {
		return (
			<BrowserRouter basename="bos">
				<div>
					<Shell>
						<Switch>
							<Route path="/">
								<Switch>
									<Route path="/" exact component={HomePage} />
								</Switch>
							</Route>
						</Switch>
					</Shell>
				</div>
			</BrowserRouter>
		);
	}
}
