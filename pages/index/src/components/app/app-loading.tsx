import * as React from 'react';

type AppLoadingState = {
	num: number;
};

export default class AppLoading extends React.Component<any, AppLoadingState> {
	constructor() {
		super();

		this.state = { num: 0 };
	}

	// update the ...
	private timerRef: any;

	componentDidMount() {
		if (!this.timerRef) {
			this.timerRef = setInterval(() => {
				let newNum = this.state.num + 1;
				if (newNum >= 4) {
					newNum = 0;
				}
				this.setState({
					num: newNum,
				});
			}, 300);
		}
	}

	componentWillUnmount() {
		if (this.timerRef) {
			clearInterval(this.timerRef);
			this.timerRef = undefined;
		}
	}

	public render() {
		return (
			<div className="app-loading">
				<div className="app-loading-circle" />
				<div className="app-loading-text">Loading{'.'.repeat(this.state.num)}</div>
			</div>
		);
	}
}
