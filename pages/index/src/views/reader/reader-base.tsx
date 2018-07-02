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
import ReaderSettings, { Settings } from '../../components/reader/reader-settings';
import LocalState from '../../app/local-state';
import ReadingRecords, { ReadingRecord } from '../../app/reading-records';
import ReaderPageCache from '../../app/reader-page-cache';
import { Keys, KeyboardEventBus } from '../../app/keyboard-helper';
import ReaderPageInput from '../../components/reader/reader-page-input';
import Growls from '../shell/growls';

type ReaderBaseState = {
	manga: Manga;
	outline: Folder[];
	loading: boolean;
	pageLoadError: boolean;

	visible: boolean;
	outlineVisible: boolean;
	topCollapsed: boolean;

	currentFolder: Folder;
	currentVolume: Volume;
	currentChapter: Chapter;
	currentPageIndex: number;

	settings: Settings;
	settingsVisible: boolean;
};

export default class ReaderBase extends React.Component<any, ReaderBaseState> {
	private static _handle: ReaderBase;

	private keyboardEventBus = new KeyboardEventBus();

	constructor(props: any) {
		super(props);

		const settings = LocalState.readDefault<Settings>(
			'reader-settings',
			ReaderSettings.getDefaultSettings()
		);

		this.state = {
			outline: null,
			manga: null,
			loading: true,
			pageLoadError: false,

			visible: false,
			outlineVisible: false,
			topCollapsed: false,

			currentFolder: null,
			currentVolume: null,
			currentChapter: null,
			currentPageIndex: null,

			settings: settings,
			settingsVisible: false,
		};

		this.onClickCloseHandler = this.onClickCloseHandler.bind(this);
		this.onClickToggleOutlineHandler = this.onClickToggleOutlineHandler.bind(this);
		this.advancePage = this.advancePage.bind(this);
		this.onSelectPage = this.onSelectPage.bind(this);
		this.onSelectChapter = this.onSelectChapter.bind(this);
		this.onSelectVolume = this.onSelectVolume.bind(this);
		this.onRefreshPage = this.onRefreshPage.bind(this);
		this.onUpdateSettings = this.onUpdateSettings.bind(this);
		this.onKeyDownContentHandler = this.onKeyDownContentHandler.bind(this);
		this.onToggleCollapseTop = this.onToggleCollapseTop.bind(this);
		this.onToggleSettingsVisibleHandler = this.onToggleSettingsVisibleHandler.bind(this);
		this.onClickImg = this.onClickImg.bind(this);

		ReaderBase._handle = this;
	}

	public static show(manga: Manga, outline: Folder[], record: ReadingRecord = null) {
		// apply overflow hidden to body to make it not scrollable
		const bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.style.overflow = 'hidden';

		this._handle.setState(
			{
				visible: true,
				manga: manga,
				outline: outline,
				loading: true,
				// reset current state
				currentFolder: null,
				currentVolume: null,
				currentChapter: null,
				currentPageIndex: null,
			},
			() => {
				// focus on the reader's main div so key events work
				const mainElement = document.getElementById('reader-main');
				mainElement.focus();

				// try to load reading record
				if (!record) {
					record = ReadingRecords.read(manga);
				}
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

				this.setState(newState, this.changedPage);
			}
		);
	}

	private async tryLoadPage(page: Page) {
		if (page.srcBase64) {
			return true;
		}
		await page.loadSrc();
		return !!page.src;
	}

	private changedPage() {
		if (this.state.settings.cacheChapter) {
			// ReaderPageCache.cacheChapter(this.state.currentChapter, this.state.currentPageIndex);
			ReaderPageCache.cacheChapters(
				this.state.currentVolume.chapters,
				this.state.currentChapter,
				this.state.currentPageIndex
			);
		}
		if (!this.state.pageLoadError) {
			// update reading record
			ReadingRecords.track(
				this.state.manga,
				this.state.currentPageIndex,
				this.state.currentChapter,
				this.state.currentVolume,
				this.state.currentFolder
			);
		}

		this.applyCSSFilters();
	}

	private getShareLink() {
		if (
			!this.state.manga ||
			!this.state.currentFolder ||
			!this.state.currentVolume ||
			!this.state.currentChapter
		) {
			return null;
		}
		return (
			location.protocol +
			'//' +
			location.hostname +
			(location.port ? ':' + location.port : '') +
			'/reader/' +
			encodeURIComponent(this.state.manga.host.id) +
			'/' +
			encodeURIComponent(this.state.manga.link) +
			'/' +
			encodeURIComponent(this.state.currentFolder.getId()) +
			'/' +
			this.state.currentVolume.number.toString() +
			'/' +
			this.state.currentChapter.number.toString() +
			'/' +
			(this.state.currentPageIndex + 1).toString() // do not show the index
		);
	}

	private applyCSSFilters() {
		const imgElement = document.getElementById('reader-base-image');
		if (imgElement) {
			const brightness = `brightness(${this.state.settings.brightness}%) `;
			const sepia = `sepia(${this.state.settings.sepia}%) `;
			imgElement.style.filter = brightness + sepia;
		}
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
					Growls.add(
						'End of Manga',
						'You have reached the last page of "' + this.state.manga.name + '".'
					);
					return;
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
						this.changedPage
					);
				}
			);
		} else {
			const newPage = this.state.currentChapter.pages[newPageIndex];
			this.setState(
				{
					currentPageIndex: newPageIndex,
					loading: !newPage.src && !newPage.srcBase64,
				},
				async () => {
					const pageLoadSuccess = await this.tryLoadPage(newPage);
					if (pageLoadSuccess === this.state.pageLoadError || this.state.loading) {
						this.setState(
							{
								loading: false,
								pageLoadError: !pageLoadSuccess,
							},
							this.changedPage
						);
					} else {
						this.changedPage();
					}
				}
			);
		}
	}

	private previousPage() {
		// check if the current reading position is the very start of the current folder
		// if that's the case, do nothing
		if (
			this.state.currentPageIndex === 0 &&
			this.state.currentVolume.chapters.indexOf(this.state.currentChapter) ===
				this.state.currentVolume.chapters.length - 1 &&
			this.state.currentFolder.volumes.indexOf(this.state.currentVolume) ===
				this.state.currentFolder.volumes.length - 1
		) {
			return;
		}
		let newPageIndex = this.state.currentPageIndex - 1;
		if (newPageIndex < 0) {
			let newVolume = this.state.currentVolume;
			let newChapter = this.state.currentChapter;
			// go to the previous chapter
			let newChapterIndex =
				this.state.currentVolume.chapters.indexOf(this.state.currentChapter) + 1;

			if (newChapterIndex === this.state.currentVolume.chapters.length) {
				// go to the previous volume
				newChapterIndex = 0; // last chapter of prev volume
				const newVolumeIndex =
					this.state.currentFolder.volumes.indexOf(this.state.currentVolume) + 1;
				newVolume = this.state.currentFolder.volumes[newVolumeIndex];
			}
			newChapter = newVolume.chapters[newChapterIndex];

			this.setState(
				{
					loading: true,
					currentVolume: newVolume,
					currentChapter: newChapter,
				},
				async () => {
					await this.state.currentChapter.loadPages();
					newPageIndex = this.state.currentChapter.pages.length - 1;
					const pageLoadSuccess = await this.tryLoadPage(
						this.state.currentChapter.pages[newPageIndex]
					);
					this.setState(
						{
							loading: false,
							pageLoadError: !pageLoadSuccess,
							currentPageIndex: newPageIndex,
						},
						this.changedPage
					);
				}
			);
		} else {
			const newPage = this.state.currentChapter.pages[newPageIndex];
			this.setState(
				{
					currentPageIndex: newPageIndex,
					loading: !newPage.src && !newPage.srcBase64,
				},
				async () => {
					const pageLoadSuccess = await this.tryLoadPage(newPage);
					if (pageLoadSuccess === this.state.pageLoadError || this.state.loading) {
						this.setState(
							{
								loading: false,
								pageLoadError: !pageLoadSuccess,
							},
							this.changedPage
						);
					} else {
						this.changedPage();
					}
				}
			);
		}
	}

	private onClickCloseHandler() {
		this.setState({
			visible: false,
			settingsVisible: false,
		});

		// clear all cached pages
		ReaderPageCache.clearCache(this.state.outline);

		// remove the overflow hidden from the body again
		const bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.style.overflow = 'auto';
	}

	private onClickToggleOutlineHandler() {
		this.setState({
			outlineVisible: !this.state.outlineVisible,
		});
	}

	private async onSelectPage(pageIndex: number) {
		const newPage = this.state.currentChapter.pages[pageIndex];
		this.setState(
			{
				currentPageIndex: pageIndex,
				loading: !newPage.src && !newPage.srcBase64,
			},
			async () => {
				const pageLoadSuccess = await this.tryLoadPage(newPage);
				if (pageLoadSuccess === this.state.pageLoadError || this.state.loading) {
					this.setState(
						{
							loading: false,
							pageLoadError: !pageLoadSuccess,
						},
						this.changedPage
					);
				} else {
					this.changedPage();
				}
			}
		);
	}

	private onSelectChapter(newChapter: Chapter) {
		for (const folder of this.state.outline) {
			for (const volume of folder.volumes) {
				for (const chapter of volume.chapters) {
					if (chapter === newChapter) {
						// before going to a new chapter, clear the cache
						// ReaderPageCache.clearCache(this.state.outline);

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
									this.changedPage
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
					this.changedPage
				);
			}
		);
	}

	private onUpdateSettings(newSettings: Settings) {
		LocalState.write('reader-settings', newSettings);
		this.setState({
			settings: newSettings,
		});
		this.applyCSSFilters();
	}

	private onKeyDownContentHandler(e: React.KeyboardEvent<HTMLDivElement>) {
		if (!this.state.loading && !this.state.settingsVisible) {
			this.keyboardEventBus.push(e.keyCode);
			switch (e.keyCode) {
				case Keys.ArrowRight:
					this.advancePage();
					break;
				case Keys.ArrowLeft:
					this.previousPage();
					break;
				case Keys.T:
					this.onToggleCollapseTop();
					break;
			}
		}
	}

	private onToggleSettingsVisibleHandler() {
		this.setState({
			settingsVisible: !this.state.settingsVisible,
		});
	}

	private onToggleCollapseTop() {
		this.setState({
			topCollapsed: !this.state.topCollapsed,
		});
	}

	private onClickImg() {
		this.setState(
			{
				settingsVisible: false,
			},
			this.advancePage
		);
	}

	private onImgLoad() {
		// scroll to top of page
		const container = document.getElementById('reader-content');
		container.scrollTo(0, 0);
	}

	private renderMain() {
		if (!this.state.visible) {
			return <div />;
		}

		let pageSrc = null;
		if (!this.state.loading) {
			const currentPage = this.state.currentChapter.pages[this.state.currentPageIndex];
			if (currentPage.srcBase64) {
				pageSrc = currentPage.srcBase64;
			} else if (currentPage.src) {
				pageSrc = currentPage.src;
			}
		}

		const pageCount =
			this.state.currentChapter && this.state.currentChapter.pages
				? this.state.currentChapter.pages.length
				: 0;

		const contentClass =
			'reader-base-content reader-base-content-top-' +
			(this.state.topCollapsed ? 'collapsed' : 'visible');

		return (
			<div
				className="reader-base-main"
				tabIndex={0}
				onKeyDown={this.onKeyDownContentHandler}
				id="reader-main"
			>
				<ReaderTop
					manga={this.state.manga}
					onClose={this.onClickCloseHandler}
					onToggleOutline={this.onClickToggleOutlineHandler}
					updateSettings={this.onUpdateSettings}
					settings={this.state.settings}
					currentPage={this.state.currentPageIndex + 1}
					pageCount={pageCount}
					shareLink={this.getShareLink()}
					collapsed={this.state.topCollapsed}
					toggleCollapsed={this.onToggleCollapseTop}
					settingsVisible={this.state.settingsVisible}
					toggleSettingsVisible={this.onToggleSettingsVisibleHandler}
				/>
				<div className="reader-base-body">
					<ReaderOutline
						visible={this.state.outlineVisible && !this.state.topCollapsed}
						outline={this.state.outline}
						currentFolder={this.state.currentFolder}
						currentVolume={this.state.currentVolume}
						currentChapter={this.state.currentChapter}
						currentPageIndex={this.state.currentPageIndex}
						onSelectChapter={this.onSelectChapter}
						onSelectVolume={this.onSelectVolume}
						flatOutline={this.state.settings.flatOutline}
					/>
					<div className={contentClass} id="reader-content" tabIndex={1}>
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
								id="reader-base-image"
								onClick={this.onClickImg}
								onLoad={this.onImgLoad}
								src={pageSrc}
							/>
						)}
						<ReaderPageInput
							keyboardEventBus={this.keyboardEventBus}
							onSelect={this.onSelectPage}
							pageCount={pageCount}
						/>
					</div>
				</div>
			</div>
		);
	}

	public render() {
		return <Fade in={this.state.visible}>{this.renderMain()}</Fade>;
	}
}
