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

type ReaderOutlineState = {
	openedFolders: string[];
};

export default class ReaderOutline extends React.Component<ReaderOutlineProps, ReaderOutlineState> {
	constructor(props: ReaderOutlineProps) {
		super(props);

		this.state = { openedFolders: [this.props.outline[0].getId()] };

		this.toggleOpenFolder = this.toggleOpenFolder.bind(this);
	}

	private toggleOpenFolder(folder: Folder) {
		const id = folder.getId();
		if (this.state.openedFolders.includes(id)) {
			this.setState({
				openedFolders: this.state.openedFolders.filter(s => s !== id),
			});
		} else {
			const openedFolders = this.state.openedFolders.concat();
			openedFolders.push(id);
			this.setState({
				openedFolders: openedFolders,
			});
		}
	}

	private renderFolder(folder: Folder) {
		return (
			<ReaderOutlineItem
				key={folder.number}
				glyph="folder-open"
				textSub={folder.name}
				textMain={'Folder ' + folder.number.toString()}
				active={this.props.currentFolder === folder}
				collapsed={!this.state.openedFolders.includes(folder.getId())}
				onClick={() => this.toggleOpenFolder(folder)}
			>
				{folder.volumes.map(v => this.renderVolume(v, folder.volumes.length === 1))}
			</ReaderOutlineItem>
		);
	}

	private renderVolume(volume: Volume, onlyVolume: boolean) {
		if (onlyVolume || this.props.flatOutline) {
			return volume.chapters.map(c => this.renderChapter(c));
		} else {
			const title =
				volume.number > -1 ? 'Volume ' + volume.number.toString() : 'Rogue chapters';
			return (
				<ReaderOutlineItem
					key={volume.number}
					glyph="book"
					textSub=""
					textMain={title}
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

	private renderMain() {
		if (this.props.outline.length === 1) {
			// single folder, render just its contents
			const folder = this.props.outline[0];
			return folder.volumes.map(v => this.renderVolume(v, folder.volumes.length === 1));
		} else {
			return this.props.outline.map(f => this.renderFolder(f));
		}
	}

	public render() {
		if (!this.props.visible) {
			return null;
		}

		return <div className="reader-outline-main">{this.renderMain()}</div>;
	}
}
