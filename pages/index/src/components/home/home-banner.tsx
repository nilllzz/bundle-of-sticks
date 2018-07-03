import * as React from 'react';
import Emojis from '../../app/emojis';

export default class HomeBanner extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.onClickHandler = this.onClickHandler.bind(this);
	}

	private getTitle() {
		let titleText = 'BUNDLE OF STICKS ';
		let startIndex = 0;
		while (titleText.includes(' ', startIndex)) {
			const spaceIndex = titleText.indexOf(' ', startIndex);
			const emoji = Emojis.getRandom();
			titleText =
				titleText.substring(0, spaceIndex) +
				' ' +
				emoji +
				' ' +
				titleText.substring(spaceIndex + 1);
			startIndex = spaceIndex + 2 + emoji.length;
		}
		return titleText.trim();
	}

	private onClickHandler() {
		// update emojis, most important feature
		this.forceUpdate();
	}

	public render() {
		let mainClass = 'home-banner-main';
		const now = new Date(Date.now());
		const day = now.getDate();
		const month = now.getMonth() + 1;
		if (month === 7 && day === 4) {
			mainClass += ' home-banner-us';
		} else if (month === 10 && day === 3) {
			mainClass += ' home-banner-de';
		}

		return (
			<div className={mainClass} onClick={this.onClickHandler}>
				<div className="page-main-header no-user-select">{this.getTitle()}</div>
			</div>
		);
	}
}
