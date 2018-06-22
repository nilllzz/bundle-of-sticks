import * as React from 'react';

export default class NotFoundPage extends React.Component<any, any> {
	public render() {
		return (
			<div className="not-found-main">
				<div className="not-found-inner">
					<h2>404</h2>
					<div className="not-found-img-container">
						<div className="not-found-img" />
					</div>
					<div className="not-found-text">
						<span>S-Sorry, I wasn't able to give y-you the page you w-wanted</span>
						<span>You can c-click my face as punishment if you w-want ~~</span>
					</div>
				</div>
			</div>
		);
	}
}
