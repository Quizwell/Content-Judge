class ChapterDisplay {
	constructor(reference, { allowVerseSelection = false, showRareWords = true, showPrejump = true } = {}) {
		this.allowVerseSelection = allowVerseSelection;
		this.showRareWords = showRareWords;
		this.showPrejump = showPrejump;

		this.element = document.createElement("div");
		this.element.classList.add("chapterDisplay");
		if (this.allowVerseSelection) {
			this.element.classList.add("allowVerseSelection");
		}
		this.element.classList.add("screen");
		this.element.classList.add("hidden");
		this.element.style.display = "none";
		document.body.appendChild(this.element);

		this.versesContainer = document.createElement("div");
		this.versesContainer.classList.add("verses");
		this.versesContainer.addEventListener("click", this.verseClick.bind(this));
		this.element.appendChild(this.versesContainer);

		// Header
		{
			let headerElement = document.createElement("div");
			headerElement.classList.add("header");

			let leading = document.createElement("div");
			leading.classList.add("leading");

			let titleContainer = document.createElement("div");
			titleContainer.classList.add("title");
			titleContainer.addEventListener("click", () => {
				this.dismiss();
			});
			titleContainer.appendChild(new Icon("chevron-left"));
			this.titleElement = document.createElement("h1");
			titleContainer.appendChild(this.titleElement);
			leading.appendChild(titleContainer);

			this.memoryWrapper = document.createElement("p");
			this.memoryWrapper.classList.add("memory");
			this.memoryWrapper.classList.add("hidden");
			this.memoryWrapper.appendChild(new Icon("star"));
			this.memoryReference = document.createElement("span");
			this.memoryWrapper.appendChild(this.memoryReference);
			leading.appendChild(this.memoryWrapper);

			headerElement.appendChild(leading);

			let trailing = document.createElement("div");
			trailing.classList.add("trailing");

			let referenceSelectorButton = document.createElement("div");
			referenceSelectorButton.classList.add("changeReference");
			referenceSelectorButton.appendChild(new Icon("grip"));
			referenceSelectorButton.addEventListener("click", () => {
				const referenceSelector = new ReferenceSelector({
					disposable: true,
					reference: this.reference,
					callback: function (reference) {
						this.reference = reference;
					}.bind(this),
				});
				referenceSelector.present();
			});
			trailing.appendChild(referenceSelectorButton);

			headerElement.appendChild(trailing);

			this.element.appendChild(headerElement);
			this.header = headerElement;
		}

		// Footer
		{
			let footerElement = document.createElement("div");
			footerElement.classList.add("footer");

			let pronounClarificationButton = document.createElement("div");
			pronounClarificationButton.classList.add("pronounClarification");
			pronounClarificationButton.appendChild(new Icon("people-arrows"));
			let pronounClarificationText = document.createElement("p");
			pronounClarificationText.textContent = "Pronoun Clarifications";
			pronounClarificationButton.appendChild(pronounClarificationText);
			pronounClarificationButton.addEventListener("click", this.togglePronounClarificationPanel.bind(this));
			footerElement.appendChild(pronounClarificationButton);
			this.pronounClarificationButton = pronounClarificationButton;

			let footnotesButton = document.createElement("div");
			footnotesButton.classList.add("footnotes");
			footnotesButton.appendChild(new Icon("square-poll-horizontal"));
			let footnotesText = document.createElement("p");
			footnotesText.textContent = "Footnotes";
			footnotesButton.appendChild(footnotesText);
			footnotesButton.addEventListener("click", this.toggleFootnotesPanel.bind(this));
			footerElement.appendChild(footnotesButton);
			this.footnotesButton = footnotesButton;

			this.element.appendChild(footerElement);
			this.footer = footerElement;
		}

		// Panel
		{
			this.panel = document.createElement("div");
			this.panel.classList.add("panel");
			this.panel.classList.add("hidden");

			this.panelTitle = document.createElement("h1");
			this.panel.appendChild(this.panelTitle);

			this.panelContent = document.createElement("div");
			this.panelContent.classList.add("content");
			this.panel.appendChild(this.panelContent);

			this.element.appendChild(this.panel);
		}

		this.reference = reference;
	}

	verseClick(event) {
		if (!this.allowVerseSelection) {
			return;
		}

		const target = event.target.closest(".verseDisplay");
		if (!target) return;

		const verseDisplay = this.verseDisplays.find((verseDisplay) => verseDisplay.element === target);
		this.selectVerse(verseDisplay);

		event.stopPropagation();
	}

	selectVerse(verse) {
		var verseDisplay = null;
		if (typeof verse === "string") {
			verseDisplay = this.verseDisplays.find((verseDisplay) => verseDisplay.verse.reference === verse);
		} else if (verse instanceof Verse) {
			verseDisplay = this.verseDisplays.find((verseDisplay) => verseDisplay.verse.reference === verse.reference);
		} else if (verse instanceof VerseDisplay) {
			verseDisplay = verse;
		}
		if (verseDisplay.selectable) {
			// This verse display is already highlighted.
			return;
		} else {
			this.deselectVerses(false);

			// Select the chosen verse.
			verseDisplay.selectable = true;
			this.footer.classList.remove("hidden");

			this.activeVerseDisplay = verseDisplay;
			this.reference = verseDisplay.verse.reference;

			this.recenterActiveVerse();
		}
	}

	deselectVerses(clearSelection = true) {
		this.verseDisplays.forEach((verseDisplay) => {
			verseDisplay.selectable = false;
		});
		this.activeVerseDisplay = null;
		if (clearSelection) {
			this.reference = this.reference.split(":")[0];
			this.titleElement.textContent = scriptureEngine.unabbreviateBookNamesInString(this.reference);
			this.memoryWrapper.classList.add("hidden");
			this.footer.classList.add("hidden");
		}
		this.hidePanel();
	}

	showConcordancePanel(word) {
		this.pronounClarificationButton.classList.remove("active");
		this.footnotesButton.classList.remove("active");

		var concordanceUses = scriptureEngine.currentYearObject.concordance[word.toLowerCase()].references;
		concordanceUses = [...new Set(concordanceUses)];
		const concordanceListItems = [];
		concordanceUses.forEach((use) => {
			concordanceListItems.push({
				leading: {
					title: use,
					subtitle: new VerseDisplay(use, {
						showPrejump: true,
						showRareWords: false,
					}).element,
				},
				trailing: { icon: "chevron-right" },
				color: new Verse(use).memory.status ? "var(--memory-element-color)" : undefined,
				callback: () => {
					this.hidePanel();
					this.reference = use;
				},
			});
		});
		var usesList = new List({
			items: concordanceListItems,
			itemConstructor: (item) => new ListItem(item),
			filterOptions: new FilterOptions({
				items: [
					{
						label: "Memory",
						value: "memory",
						icon: "star",
						color: "var(--memory-element-color)",
					},
				],
				onchange: (listItems, options) => {
					return listItems.filter((item) => {
						if (options.memory) {
							return item.color === "var(--memory-element-color)";
						} else {
							return true;
						}
					});
				},
			}),
			counter: (listItems) => {
				return listItems.length.toLocaleString() + (listItems.length === 1 ? " verse" : " verses");
			},
			fullScreen: true,
			scrollable: true,
		});

		var color = null;
		if (concordanceUses.length === 1) {
			color = "var(--unique-word-highlight-color)";
		} else if (concordanceUses.length === 2) {
			color = "var(--double-word-highlight-color)";
		} else if (concordanceUses.length === 3) {
			color = "var(--triple-word-highlight-color)";
		}

		this.showPanel(word, color, usesList.listElement);
	}

	showMultiwordPanel(value) {
		this.pronounClarificationButton.classList.remove("active");
		this.footnotesButton.classList.remove("active");

		const multiwordUses = scriptureEngine.getVersesByContent(value);

		const concordanceListItems = [];
		multiwordUses.forEach((use) => {
			concordanceListItems.push({
				leading: { title: use.reference, subtitle: new Verse(use.reference).text },
				trailing: { icon: "chevron-right" },
				callback: () => {
					this.hidePanel();
					this.reference = use.reference;
				},
			});
		});
		var usesList = new List({
			items: concordanceListItems,
			itemConstructor: (item) => new ListItem(item),
			counter: (listItems) => {
				return listItems.length.toLocaleString() + (listItems.length === 1 ? " verse" : " verses");
			},
			fullScreen: true,
			scrollable: true,
		});

		this.showPanel(value, null, usesList.listElement);
	}

	togglePronounClarificationPanel() {
		if (this.pronounClarificationButton.classList.contains("active")) {
			this.hidePanel();
			return;
		}

		this.activeVerseDisplay.deselect({ clearSelection: false }); // Deselect highlighted words in the active verse.
		this.footnotesButton.classList.remove("active");
		this.pronounClarificationButton.classList.add("active");

		this.showPanel("Pronoun Clarifications", null, new FormattedText("Pronoun clarifications coming soon."));
	}

	toggleFootnotesPanel(footnoteLetter) {
		if (this.footnotesButton.classList.contains("active")) {
			this.hidePanel();
			return;
		}

		this.activeVerseDisplay.deselect({ clearSelection: false }); // Deselect highlighted words in the active verse.
		this.pronounClarificationButton.classList.remove("active");
		this.footnotesButton.classList.add("active");

		var chapterFootnotes = [];
		var footnotesKeys = Object.keys(this.chapter.footnotes);
		for (var i = 0; i < footnotesKeys.length; i++) {
			chapterFootnotes.push({
				leading: { title: "[" + footnotesKeys[i] + "]", subtitle: new FormattedText(this.chapter.footnotes[footnotesKeys[i]]) },
			});
		}
		var footnotesList = new List({
			items: chapterFootnotes,
			itemConstructor: (item) => new ListItem(item),
			counter: false,
		});

		this.showPanel("Footnotes", null, footnotesList.listElement);
	}

	showPanel(title, color, content) {
		var timeoutLength = 0;
		if (!this.panel.classList.contains("hidden")) {
			this.panel.classList.add("hidden");
			timeoutLength = 200;
		}

		setTimeout(() => {
			this.panelTitle.textContent = title;
			this.panelTitle.style.color = color || "";

			this.panelContent.replaceChildren(content);
			this.panelContent.scrollTop = 0;

			this.redrawPanelSize();
			this.panel.classList.remove("hidden");
		}, timeoutLength);
	}

	hidePanel() {
		this.pronounClarificationButton.classList.remove("active");
		this.footnotesButton.classList.remove("active");
		this.panel.classList.add("hidden");
		this.recenterActiveVerse();
	}

	redrawPanelSize() {
		this.panel.style.minHeight = "";

		const safeAreaTop = Number(window.getComputedStyle(document.documentElement).getPropertyValue("--safe-area-top").slice(0, -2));
		var verseRect = this.activeVerseDisplay.element.getBoundingClientRect();
		const headerHeight = this.header.getBoundingClientRect().height;
		const footerHeight = this.footer.getBoundingClientRect().height;

		const maxPanelHeight = window.innerHeight - headerHeight - safeAreaTop - footerHeight - verseRect.height - 80;
		this.panel.style.maxHeight = maxPanelHeight + "px";

		requestAnimationFrame(() => {
			this.recenterActiveVerse();
			const panelRect = this.panel.getBoundingClientRect();
			this.panel.style.minHeight = panelRect.height + "px";
		});
	}

	recenterActiveVerse() {
		if (!this.activeVerseDisplay) {
			return;
		}
		if (this.panel.classList.contains("hidden")) {
			const verseRect = this.activeVerseDisplay.element.getBoundingClientRect();
			const containerRect = this.versesContainer.getBoundingClientRect();
			const scrollTop = verseRect.top - containerRect.top + this.versesContainer.scrollTop - containerRect.height / 2 + verseRect.height / 2;
			this.versesContainer.scrollTo({
				top: scrollTop,
				behavior: "smooth",
			});
		} else {
			const safeAreaTop = Number(window.getComputedStyle(document.documentElement).getPropertyValue("--safe-area-top").slice(0, -2));
			const headerHeight = this.element.querySelector(".header").getBoundingClientRect().height;
			var panelRect = this.panel.getBoundingClientRect();
			var activeVerseRect = this.activeVerseDisplay.element.getBoundingClientRect();
			const availableVerseSpace = panelRect.top - headerHeight - safeAreaTop;
			this.versesContainer.scrollTo({
				top: this.versesContainer.scrollTop + activeVerseRect.top - headerHeight - safeAreaTop - (availableVerseSpace - activeVerseRect.height) / 2,
				behavior: "smooth",
			});
		}
	}

	present() {
		this.element.style.display = "block";
		requestAnimationFrame(() => {
			this.element.classList.remove("hidden");
			if (this.reference.indexOf(":") !== -1) {
				this.selectVerse(this.reference);
				this.recenterActiveVerse();
			}
		});
		return this;
	}

	dismiss() {
		this.element.classList.add("hidden");
		setTimeout(() => {
			if (this.element.parentNode) {
				this.element.parentNode.removeChild(this.element);
			}
			this.element = null;
		}, 200);
	}

	get reference() {
		return this._reference;
	}
	set reference(value) {
		var oldReference = this.reference || "";
		this._reference = value;
		if (this.reference.split(":")[0] !== oldReference.split(":")[0]) {
			this.hidePanel();
			this.chapter = new Verse(this.reference).chapter;

			while (this.versesContainer.firstChild) {
				this.versesContainer.removeChild(this.versesContainer.firstChild);
			}
			this.verseDisplays = [];
			this.activeVerseDisplay = null;

			var verseCount = 0;
			for (var s = 0; s < this.chapter.sections.length; s++) {
				var sectionTitleElement = document.createElement("h3");
				sectionTitleElement.classList.add("sectionTitle");
				sectionTitleElement.textContent = this.chapter.sections[s].title;
				sectionTitleElement.addEventListener(
					"click",
					function () {
						this.deselectVerses(true);
					}.bind(this)
				);
				this.versesContainer.appendChild(sectionTitleElement);

				for (var v = 0; v < this.chapter.sections[s].verses.length; v++) {
					verseCount++;
					this.verseDisplays.push(
						new VerseDisplay(this.reference.split(":")[0] + ":" + verseCount, {
							selectable: false,
							showRareWords: this.showRareWords,
							showPrejump: this.showPrejump,
							selectionCallback: (type, value) => {
								switch (type) {
									case "footnote":
										this.toggleFootnotesPanel(value);
										break;
									case "word":
										this.showConcordancePanel(value);
										break;
									case "multiword":
										this.showMultiwordPanel(value);
										break;
									case null:
										this.hidePanel();
										break;
								}
							},
						})
					);
					this.versesContainer.appendChild(this.verseDisplays[this.verseDisplays.length - 1].element);
				}
			}

			this.versesContainer.scrollTop = 0;
		}

		if (this.reference.indexOf(":") !== -1) {
			this.selectVerse(this.reference);
		}

		this.titleElement.textContent = scriptureEngine.unabbreviateBookNamesInString(this.reference);
		if (this.activeVerseDisplay?.verse.memory.status) {
			if (this.activeVerseDisplay.verse.memory.multiple) {
				this.memoryReference.textContent = this.activeVerseDisplay.verse.memory.reference;
			} else {
				this.memoryReference.textContent = "Memory";
			}
			this.memoryWrapper.classList.remove("hidden");
		} else {
			this.memoryWrapper.classList.add("hidden");
		}
	}

	get showRareWords() {
		return this._showRareWords;
	}
	set showRareWords(value) {
		this._showRareWords = value;
		this.verseDisplays?.forEach((verseDisplay) => {
			verseDisplay.showRareWords = value;
		});
	}

	get showPrejump() {
		return this._showPrejump;
	}
	set showPrejump(value) {
		this._showPrejump = value;
		this.verseDisplays?.forEach((verseDisplay) => {
			verseDisplay.showPrejump = value;
		});
	}
}
