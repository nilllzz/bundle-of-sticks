import * as React from 'react';

type MangaCoverimgProps = {
	src: string;
	width: number;
	height: number;
};

type MangaCoverimgState = {
	error: boolean;
};

export default class MangaCoverimg extends React.Component<MangaCoverimgProps, MangaCoverimgState> {
	constructor(props: MangaCoverimgProps) {
		super(props);

		this.state = { error: !this.props.src };

		this.onErrorHandler = this.onErrorHandler.bind(this);
	}

	componentDidMount() {
		const element = document.getElementById(this.getId());
		if (element) {
			element.style.width = this.props.width + 'px';
			element.style.height = this.props.height + 'px';
			element.style.minWidth = this.props.width + 'px';
		}
	}

	private getId() {
		return 'manga-cover-img-' + this.props.src;
	}

	private onErrorHandler() {
		this.setState({
			error: true,
		});
	}

	public render() {
		return (
			<div className="manga-coverimg accent-gradient-background" id={this.getId()}>
				{!this.state.error ? (
					<img src={this.props.src} onError={this.onErrorHandler} />
				) : (
					<div className="manga-coverimg-fail no-user-select">No cover</div>
				)}
			</div>
		);
	}
}
