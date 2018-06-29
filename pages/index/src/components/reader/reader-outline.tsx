import * as React from 'react';
import Folder from '../../app/models/folder.model';
import Chapter from '../../app/models/chapter.model';
import Volume from '../../app/models/volume.model';
import ReaderOutlineItem from './reader-outline-item';
import StringHelper from '../../app/string-helper';

type ReaderOutlineProps = {
	visible: boolean;
	outline: Folder[];
	currentFolder: Folder;
	currentVolume: Volume;
	currentChapter: Chapter;
	currentPageIndex: number;
	onSelectChapter: (chapter: Chapter) => void;
	onSelectVolume: (volume: Volume) => void;
	flatOutline: boolean;
};

export default class ReaderOutline extends React.Component<ReaderOutlineProps, any> {
	private renderFolder(folder: Folder) {
		if (folder.volumes.length === 1) {
			return this.renderVolume(folder.volumes[0], true);
		} else if (this.props.flatOutline) {
			return folder.volumes.map(v => this.renderVolume(v, true));
		} else {
			return (
				<ReaderOutlineItem
					key={folder.number}
					glyph="folder-open"
					textSub={folder.name}
					textMain={'Folder ' + folder.number.toString()}
					active={this.props.currentFolder === folder}
					collapsed={false}
				>
					{folder.volumes.map(v => this.renderVolume(v, false))}
				</ReaderOutlineItem>
			);
		}
	}

	private renderVolume(volume: Volume, onlyVolume: boolean) {
		if (onlyVolume) {
			return volume.chapters.map(c => this.renderChapter(c));
		} else {
			return (
				<ReaderOutlineItem
					key={volume.number}
					glyph="book"
					textSub=""
					textMain={'Volume ' + volume.number.toString()}
					active={this.props.currentVolume === volume}
					collapsed={false}
					onClick={() => this.props.onSelectVolume(volume)}
				>
					{volume.chapters.map(c => this.renderChapter(c))}
				</ReaderOutlineItem>
			);
		}
	}

	private renderChapter(chapter: Chapter) {
		return (
			<ReaderOutlineItem
				key={chapter.link}
				textMain={'Ch. ' + StringHelper.padStart(chapter.number.toString(), '0', 3)}
				textSub={chapter.name}
				active={this.props.currentChapter === chapter}
				collapsed={true}
				onClick={() => this.props.onSelectChapter(chapter)}
			/>
		);
	}

	public render() {
		if (!this.props.visible) {
			return null;
		}

		return (
			<div className="reader-outline-main">
				{this.props.outline.map(f => this.renderFolder(f))}
			</div>
		);
	}
}
