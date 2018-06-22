import * as React from 'react';

export default class Footer extends React.Component<any, any> {
	public render() {
		return (
			<footer>
				<div className="shell-footer-body">
					<div className="shell-footer-upper">
						<span className="shell-footer-subbody">
							Outsourced to chinese slave labours with{' '}
							<span className="shell-footer-heart">❤️</span>
						</span>
					</div>
					<div className="shell-footer-lower">
						<span className="shell-footer-subbody">Copyright 20XX</span>
					</div>
				</div>
			</footer>
		);
	}
}
