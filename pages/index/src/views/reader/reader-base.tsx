import * as React from 'react';
import Manga from '../../app/models/manga.model';
import { Fade } from 'react-bootstrap';
import ReaderTop from '../../components/reader/reader-top';
import ReaderOutline from '../../components/reader/reader-outline';
import Folder from '../../app/models/folder.model';
import Chapter from '../../app/models/chapter.model';
import Volume from '../../app/models/volume.model';
import Page from '../../app/models/page.models';
import ReaderNotFound from '../../components/reader/reader-not-found';
import AppLoading from '../../components/app/app-loading';
import { Settings } from '../../components/reader/reader-settings';
import LocalState from '../../app/local-state';
import ReadingRecords from '../../app/reading-records';

type ReaderBaseState = {
	manga: Manga;
	outline: Folder[];
	visible: boolean;
	outlineVisible: boolean;
	loading: boolean;
	pageLoadError: boolean;

	currentFolder: Folder;
	currentVolume: Volume;
	currentChapter: Chapter;
	currentPageIndex: number;

	settings: Settings;
};

export default class ReaderBase extends React.Component<any, ReaderBaseState> {
	private static _handle: ReaderBase;

	constructor(props: any) {
		super(props);

		const settings = LocalState.readDefault('reader-settings', {
			pageAlignment: 'scroll',
		}) as Settings;

		this.state = {
			visible: false,
			outline: null,
			manga: null,
			outlineVisible: false,
			loading: true,
			pageLoadError: false,

			currentFolder: null,
			currentVolume: null,
			currentChapter: null,
			currentPageIndex: null,

			settings: settings,
		};

		this.onClickCloseHandler = this.onClickCloseHandler.bind(this);
		this.onClickToggleOutlineHandler = this.onClickToggleOutlineHandler.bind(this);
		this.advancePage = this.advancePage.bind(this);
		this.onSelectChapter = this.onSelectChapter.bind(this);
		this.onSelectVolume = this.onSelectVolume.bind(this);
		this.onRefreshPage = this.onRefreshPage.bind(this);
		this.onUpdateSettings = this.onUpdateSettings.bind(this);

		ReaderBase._handle = this;
	}

	public static show(manga: Manga, outline: Folder[]) {
		// apply overflow hidden to body to make it not scrollable
		const bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.style.overflow = 'hidden';

		this._handle.setState(
			{
				visible: true,
				manga: manga,
				outline: outline,
			},
			() => {
				// try to load reading record
				const record = ReadingRecords.read(manga);
				if (record) {
					const folder = outline.find(f => f.getId() === record.folderId);
					if (folder) {
						const volume = folder.volumes.find(v => v.number === record.volume);
						if (volume) {
							const chapter = volume.chapters.find(c => c.number === record.chapter);
							if (chapter) {
								const pageIndex = record.page;
								this._handle.showPage(folder, volume, chapter, pageIndex);
								return;
							}
						}
					}
				}

				// no valid reading record exists, start at the beginning
				const folder = outline[0]; // show the first folder
				const volume = folder.volumes[folder.volumes.length - 1]; // show the first volume (sorted to the end)
				const chapter = volume.chapters[volume.chapters.length - 1]; // show the first chapter (sorted to the end)
				this._handle.showPage(folder, volume, chapter, 0);
			}
		);
	}

	private showPage(folder: Folder, volume: Volume, chapter: Chapter, pageIndex: number) {
		this.setState(
			{
				loading: true,
			},
			async () => {
				await chapter.loadPages();
				const shownPage = chapter.pages[pageIndex];

				const pageLoadSuccess = await this.tryLoadPage(shownPage);
				const newState = {
					loading: false,
					pageLoadError: !pageLoadSuccess,
					currentFolder: folder,
					currentVolume: volume,
					currentChapter: chapter,
					currentPageIndex: pageIndex,
				};

				this.setState(newState, () => {
					if (!this.state.pageLoadError) {
						this.updateRecord();
					}
				});
			}
		);
	}

	private updateRecord() {
		ReadingRecords.track(
			this.state.manga,
			this.state.currentPageIndex,
			this.state.currentChapter,
			this.state.currentVolume,
			this.state.currentFolder
		);
	}

	private advancePage() {
		let newPageIndex = this.state.currentPageIndex + 1;

		// check to advance a chapter:
		if (newPageIndex >= this.state.currentChapter.pages.length) {
			let newVolume = this.state.currentVolume;
			let newChapter = this.state.currentChapter;

			newPageIndex = 0;
			const chapterPosition = this.state.currentVolume.chapters.indexOf(
				this.state.currentChapter
			);
			// advance the volume
			if (chapterPosition === 0) {
				const volumePosition = this.state.currentFolder.volumes.indexOf(
					this.state.currentVolume
				);
				// end of the last volume's last chapter
				if (volumePosition === 0) {
					alert('huzzah');
				} else {
					newVolume = this.state.currentFolder.volumes[volumePosition - 1];
					newChapter = newVolume.chapters[newVolume.chapters.length - 1];
				}
			} else {
				newChapter = newVolume.chapters[chapterPosition - 1];
			}

			this.setState(
				{
					loading: true,
					currentVolume: newVolume,
					currentChapter: newChapter,
					currentPageIndex: newPageIndex,
				},
				async () => {
					await this.state.currentChapter.loadPages();
					const pageLoadSuccess = await this.tryLoadPage(
						this.state.currentChapter.pages[this.state.currentPageIndex]
					);
					this.setState(
						{
							loading: false,
							pageLoadError: !pageLoadSuccess,
						},
						() => {
							if (!this.state.pageLoadError) {
								this.updateRecord();
							}
						}
					);
				}
			);
		} else {
			const newPage = this.state.currentChapter.pages[newPageIndex];
			this.setState(
				{
					currentPageIndex: newPageIndex,
					loading: !newPage.src,
				},
				async () => {
					const pageLoadSuccess = await this.tryLoadPage(newPage);
					if (pageLoadSuccess === this.state.pageLoadError || this.state.loading) {
						this.setState(
							{
								loading: false,
								pageLoadError: !pageLoadSuccess,
							},
							() => {
								if (!this.state.pageLoadError) {
									this.updateRecord();
								}
							}
						);
					}
				}
			);
		}
	}

	private async tryLoadPage(page: Page) {
		await page.loadSrc();
		return !!page.src;
	}

	private onClickCloseHandler() {
		this.setState({
			visible: false,
		});
		// remove the overflow hidden from the body again
		const bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.style.overflow = 'auto';
	}

	private onClickToggleOutlineHandler() {
		this.setState({
			outlineVisible: !this.state.outlineVisible,
		});
	}

	private onSelectChapter(newChapter: Chapter) {
		for (const folder of this.state.outline) {
			for (const volume of folder.volumes) {
				for (const chapter of volume.chapters) {
					if (chapter === newChapter) {
						this.setState(
							{
								loading: true,
								currentFolder: folder,
								currentVolume: volume,
								currentChapter: newChapter,
								currentPageIndex: 0,
							},
							async () => {
								await this.state.currentChapter.loadPages();

								const pageLoadSuccess = await this.tryLoadPage(
									this.state.currentChapter.pages[this.state.currentPageIndex]
								);
								this.setState(
									{
										loading: false,
										pageLoadError: !pageLoadSuccess,
									},
									() => {
										if (!this.state.pageLoadError) {
											this.updateRecord();
										}
									}
								);
							}
						);
					}
				}
			}
		}
	}

	private onSelectVolume(volume: Volume) {
		this.onSelectChapter(volume.chapters[volume.chapters.length - 1]);
	}

	private onRefreshPage() {
		this.setState(
			{
				loading: true,
				pageLoadError: false,
			},
			async () => {
				const pageLoadSuccess = await this.tryLoadPage(
					this.state.currentChapter.pages[this.state.currentPageIndex]
				);
				this.setState(
					{
						loading: false,
						pageLoadError: !pageLoadSuccess,
					},
					() => {
						if (!this.state.pageLoadError) {
							this.updateRecord();
						}
					}
				);
			}
		);
	}

	private onUpdateSettings(newSettings: Settings) {
		LocalState.write('reader-settings', newSettings);
		this.setState({
			settings: newSettings,
		});
	}

	private renderMain() {
		if (!this.state.visible) {
			return <div />;
		}

		const pageSrc = this.state.loading
			? null
			: this.state.currentChapter.pages[this.state.currentPageIndex].src;
		return (
			<div className="reader-base-main">
				<ReaderTop
					manga={this.state.manga}
					onClose={this.onClickCloseHandler}
					onToggleOutline={this.onClickToggleOutlineHandler}
					updateSettings={this.onUpdateSettings}
					settings={this.state.settings}
				/>
				<div className="reader-base-body">
					<ReaderOutline
						visible={this.state.outlineVisible}
						outline={this.state.outline}
						currentFolder={this.state.currentFolder}
						currentVolume={this.state.currentVolume}
						currentChapter={this.state.currentChapter}
						currentPageIndex={this.state.currentPageIndex}
						onSelectChapter={this.onSelectChapter}
						onSelectVolume={this.onSelectVolume}
					/>
					<div className="reader-base-content">
						{this.state.loading ? (
							<div className="reader-base-loading">
								<AppLoading />
							</div>
						) : this.state.pageLoadError ? (
							<ReaderNotFound
								onNextPage={this.advancePage}
								onRefresh={this.onRefreshPage}
								page={this.state.currentChapter.pages[this.state.currentPageIndex]}
							/>
						) : (
							<img
								className={'reader-base-image-' + this.state.settings.pageAlignment}
								onClick={this.advancePage}
								src={pageSrc}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	public render() {
		return <Fade in={this.state.visible}>{this.renderMain()}</Fade>;
	}
}
