import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

type MangaRatingProps = {
	rating: number;
};

export default class MangaRating extends React.Component<MangaRatingProps, any> {
	componentDidMount() {
		const element = document.getElementById('rating-stars');
		element.style.backgroundSize = (this.props.rating * 100).toString() + '%';
	}

	private getScoreBig() {
		return (this.props.rating * 5).toString().charAt(0);
	}

	private getScoreSmall() {
		const score = this.props.rating * 5;
		return ((score - Number.parseInt(this.getScoreBig())) * 100).toFixed();
	}

	public render() {
		return (
			<div className="manga-rating-main">
				<div className="manga-rating-stars" id="rating-stars">
					<Glyphicon glyph="star" className="manga-rating-star" />
					<Glyphicon glyph="star" className="manga-rating-star" />
					<Glyphicon glyph="star" className="manga-rating-star" />
					<Glyphicon glyph="star" className="manga-rating-star" />
					<Glyphicon glyph="star" className="manga-rating-star" />
				</div>
				<div className="manga-rating-score">
					<span className="manga-rating-score-big">{this.getScoreBig()}</span>
					<span className="manga-rating-score-small">.{this.getScoreSmall()}</span>
				</div>
			</div>
		);
	}
}
