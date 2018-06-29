import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './views/home/home-page';
import Shell from './views/shell/main';
import NotFoundPage from './views/not-found/not-found-page';
import SearchPage from './views/search/search-page';
import MangaViewPage from './views/manga/manga-view-page';
import ReaderShare from './views/reader/reader-share';

export default class PageRouter extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	public render() {
		return (
			<BrowserRouter>
				<div>
					<Switch>
						<Route
							path="/reader/:provider/:link/:folder/:volume/:chapter/:pageNumber"
							component={ReaderShare}
						/>
						<Route>
							<Shell>
								<Switch>
									<Route path="/" exact component={HomePage} />
									<Route path="/search" component={SearchPage} />
									<Route
										path="/manga/:provider/:link"
										component={MangaViewPage}
									/>
									<Route component={NotFoundPage} />
								</Switch>
							</Shell>
						</Route>
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}
