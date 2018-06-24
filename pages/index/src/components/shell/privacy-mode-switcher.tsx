import * as React from 'react';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import PrivacyMode from '../../app/privacy-mode';

type PrivacyModeSwitcherState = {
	active: boolean;
};

export default class PrivacyModeSwitcher extends React.Component<any, PrivacyModeSwitcherState> {
	constructor() {
		super();

		const active = PrivacyMode.isActive();
		this.state = { active: active };

		this.onClickHandler = this.onClickHandler.bind(this);
	}

	private onClickHandler() {
		PrivacyMode.set(!this.state.active);
		this.setState({
			active: !this.state.active,
		});
	}

	public render() {
		let tooltip;
		if (this.state.active) {
			tooltip = (
				<Tooltip>
					<strong className="accent-gradient-text">Privacy mode engaged</strong>
					<br />p-please don't b-bully me, Mr. NSA man
				</Tooltip>
			);
		} else {
			tooltip = (
				<Tooltip>
					<strong>Privacy mode NOT engaged</strong>
					<br />just like you aren't.
				</Tooltip>
			);
		}

		return (
			<div
				className={
					'privacy-mode-switcher-main clickable' +
					(this.state.active ? ' accent-gradient-text' : '')
				}
				onClick={this.onClickHandler}
			>
				<OverlayTrigger placement="bottom" overlay={tooltip}>
					<Glyphicon glyph="sunglasses" />
				</OverlayTrigger>
			</div>
		);
	}
}
