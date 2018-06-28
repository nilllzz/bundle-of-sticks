import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import AppExternalLink from '../app/app-external-link';
import Page from '../../app/models/page.models';
import AppButton from '../app/app-button';

type ReaderNotFoundProps = {
	page: Page;
	onRefresh: () => void;
	onNextPage: () => void;
};

export default class ReaderNotFound extends React.Component<ReaderNotFoundProps, any> {
	public render() {
		return (
			<div className="reader-not-found-main">
				<div className="reader-not-found-content">
					<div className="reader-not-found-header">
						<div className="reader-not-found-icon">
							<Glyphicon glyph="exclamation-sign" className="accent-color-text" />
						</div>
						<div className="reader-not-found-title">
							<span className="text-muted">Uh-Oh!</span> This page failed to load.
						</div>
					</div>
					<div className="reader-not-found-body">
						<div className="reader-not-found-message text-muted">
							Either the{' '}
							<AppExternalLink href={this.props.page.getUrl()}>
								source
							</AppExternalLink>{' '}
							was unable to respond or it doesn't exist.
						</div>
						<div className="reader-not-found-controls">
							<AppButton main icon="refresh" onClick={this.props.onRefresh}>
								Retry
							</AppButton>
							<AppButton dark onClick={this.props.onNextPage}>
								Next page
							</AppButton>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
