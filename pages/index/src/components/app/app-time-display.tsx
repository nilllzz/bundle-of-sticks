import * as React from 'react';
import * as moment from 'moment';

type AppTimeDisplayProps = {
	time: number;
	popover?: boolean;
};

export default class AppTimeDisplay extends React.Component<AppTimeDisplayProps, any> {
	private static readonly MINUTE = 60;
	private static readonly HOUR = AppTimeDisplay.MINUTE * 60;
	private static readonly DAY = AppTimeDisplay.HOUR * 24;
	private static readonly WEEK = AppTimeDisplay.DAY * 24;
	private static readonly MONTH = AppTimeDisplay.WEEK * 4 + AppTimeDisplay.DAY * 2;
	private static readonly YEAR = AppTimeDisplay.DAY * 365;

	// manually update the display every 2 seconds
	private timerRef: any;

	componentDidMount() {
		if (!this.timerRef) {
			this.timerRef = setInterval(() => {
				this.forceUpdate();
			}, 2000);
		}
	}

	componentWillUnmount() {
		if (this.timerRef) {
			clearInterval(this.timerRef);
			this.timerRef = undefined;
		}
	}

	private getDisplay() {
		const now = Date.now();
		const other = this.props.time;
		const diff = now - other;

		// past
		if (diff >= 0) {
			const seconds = diff / 1000;

			// first 59 seconds is "just now"
			if (seconds < AppTimeDisplay.MINUTE) {
				return 'just now';
			}

			// everything below 1 hour is "x minutes ago"
			if (seconds < AppTimeDisplay.HOUR) {
				const ago = Math.floor(seconds / AppTimeDisplay.MINUTE);
				if (ago === 1) {
					return ago.toString() + ' minute ago';
				} else {
					return ago.toString() + ' minutes ago';
				}
			}

			// everything below 1 day is "x hours ago"
			if (seconds < AppTimeDisplay.DAY) {
				const ago = Math.floor(seconds / AppTimeDisplay.HOUR);
				if (ago === 1) {
					return ago.toString() + ' hour ago';
				} else {
					return ago.toString() + ' hours ago';
				}
			}

			// everything below 1 week is "x days ago"
			if (seconds < AppTimeDisplay.WEEK) {
				const ago = Math.floor(seconds / AppTimeDisplay.DAY);
				if (ago === 1) {
					return ago.toString() + ' day ago';
				} else {
					return ago.toString() + ' days ago';
				}
			}

			// everything below 1 month is "x weeks ago"
			if (seconds < AppTimeDisplay.MONTH) {
				const ago = Math.floor(seconds / AppTimeDisplay.WEEK);
				if (ago === 1) {
					return ago.toString() + ' week ago';
				} else {
					return ago.toString() + ' weeks ago';
				}
			}
			// everything below 1 year is "x months ago"
			if (seconds < AppTimeDisplay.YEAR) {
				const ago = Math.floor(seconds / AppTimeDisplay.MONTH);
				if (ago === 1) {
					return ago.toString() + ' month ago';
				} else {
					return ago.toString() + ' months ago';
				}
			}

			// everything else is "x years ago"
			{
				const ago = Math.floor(seconds / AppTimeDisplay.YEAR);
				if (ago === 1) {
					return ago.toString() + ' year ago';
				} else {
					return ago.toString() + ' years ago';
				}
			}
		}
		// future
		else {
			return 'todo';
		}
	}

	private getTitle() {
		return moment(this.props.time).format('dddd, MMMM Do YYYY, h:mm:ss a');
	}

	public render() {
		return (
			<div className="app-time-display" title={this.getTitle()}>
				{this.getDisplay()}
			</div>
		);
	}
}
