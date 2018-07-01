import * as React from 'react';
import LocalState from '../../app/local-state';
import AppButton from '../app/app-button';

type CookieMessageState = {
	visible: boolean;
};

export default class CookieMessage extends React.Component<any, CookieMessageState> {
	constructor(props: any) {
		super(props);

		const consent = LocalState.readDefault<boolean>('cookie-consent', false);
		this.state = { visible: !consent };

		this.onClickOkHandler = this.onClickOkHandler.bind(this);
	}

	private onClickOkHandler() {
		LocalState.write('cookie-consent', true);
		this.setState({
			visible: false,
		});
	}

	public render() {
		if (!this.state.visible) {
			return null;
		}

		return (
			<div className="cookie-message-main reader-popup">
				<div className="cookie-message-title">
					And now, a few words from our{' '}
					<span className="accent-gradient-text">cookies</span> 🍪
				</div>
				<div className="cookie-message-body">
					This site is storing "cookies" (actually HTML5 LocalStorage) to save your state
					across sessions. By using this website, you agree to storing those cookies in
					your browser.
				</div>
				<div className="cookie-message-controls">
					<AppButton dark onClick={this.onClickOkHandler}>
						I don't care
					</AppButton>
				</div>
			</div>
		);
	}
}
