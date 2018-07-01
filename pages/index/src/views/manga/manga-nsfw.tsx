import * as React from 'react';
import AppButton from '../../components/app/app-button';
import { Glyphicon } from 'react-bootstrap';
import Manga from '../../app/models/manga.model';
import { Link } from 'react-router-dom';

type MangaNSFWProps = {
	manga: Manga;
	onContinue: () => void;
};

export default class MangaNSFW extends React.Component<MangaNSFWProps, any> {
	public render() {
		return (
			<div className="manga-nsfw-main shell-content-padded">
				<div className="manga-nsfw-content">
					<div className="manga-nsfw-icon">
						<Glyphicon glyph="flag" className="accent-color-text" />
					</div>
					<div className="manga-nsfw-text">
						<div className="manga-nsfw-notice text-muted">
							Woah, hold on there partner!
						</div>
						<div className="manga-nsfw-warning">
							There's some <span className="accent-gradient-text">nasty stuff</span>{' '}
							going on.
						</div>
						<div className="manga-nsfw-notice">
							Are you sure you want to view <strong>{this.props.manga.name}</strong>?
						</div>
						<div className="manga-nsfw-controls">
							<AppButton onClick={this.props.onContinue} main>
								Continue
							</AppButton>
							<Link to="/" className="unstyled-link">
								<AppButton>Get me out of here</AppButton>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
