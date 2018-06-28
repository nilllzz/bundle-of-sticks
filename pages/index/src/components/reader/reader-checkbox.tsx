import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type ReaderCheckboxProps = {
	checked: boolean;
	onChecked: () => void;
};

export default class ReaderCheckbox extends React.Component<ReaderCheckboxProps, any> {
	public render() {
		return (
			<div className="reader-checkbox-main clickable" onClick={this.props.onChecked}>
				<Glyphicon
					glyph={this.props.checked ? 'check' : 'unchecked'}
					className="reader-checkbox-icon"
				/>
				{this.props.children}
			</div>
		);
	}
}
