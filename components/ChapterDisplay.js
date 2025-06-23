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
			pronounClarificationButton.addEventListener("click", () => {
				console.log("Pronoun Clarifications clicked");
				pronounClarificationButton.classList.toggle("active");
			});
			footerElement.appendChild(pronounClarificationButton);

			let footnotesButton = document.createElement("div");
			footnotesButton.classList.add("footnotes");
			footnotesButton.appendChild(new Icon("square-poll-horizontal"));
			let footnotesText = document.createElement("p");
			footnotesText.textContent = "Footnotes";
			footnotesButton.appendChild(footnotesText);
			footnotesButton.addEventListener("click", () => {
				console.log("Footnotes clicked");
				footnotesButton.classList.toggle("active");
			});
			footerElement.appendChild(footnotesButton);

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
		if (clearSelection) {
			this.reference = this.reference.split(":")[0];
			this.titleElement.textContent = scriptureEngine.unabbreviateBookNamesInString(this.reference);
			this.memoryWrapper.classList.add("hidden");
			this.footer.classList.add("hidden");
			this.hidePanel();
		}
	}

	showConcordancePanel(word) {
		const concordanceUses = scriptureEngine.currentYearObject.concordance[word.toLowerCase()].references;

		this.panelTitle.textContent = word;
		if (concordanceUses.length === 1) {
			this.panelTitle.style.color = "var(--unique-word-highlight-color)";
		} else if (concordanceUses.length === 2) {
			this.panelTitle.style.color = "var(--double-word-highlight-color)";
		} else if (concordanceUses.length === 3) {
			this.panelTitle.style.color = "var(--triple-word-highlight-color)";
		} else {
			this.panelTitle.style.color = "";
		}

		const concordanceListItems = [];
		concordanceUses.forEach((use) => {
			concordanceListItems.push({
				leading: { title: use, subtitle: new Verse(use).text },
				trailing: { icon: "chevron-right" },
				callback: () => {
					this.hidePanel();
					this.reference = use;
				},
			});
		});
		var usesList = new List({
			items: concordanceListItems,
			itemConstructor: (item) => new ListItem(item),
		});
		this.panelContent.replaceChildren(usesList.listElement);

		this.redrawPanelSize();
		this.panel.classList.remove("hidden");
	}

	showFootnotesPanel(footnoteLetter) {
		this.panelTitle.textContent = "Footnotes";
		this.panelTitle.style.color = "";

		var chapterFootnotes = [];
		var footnotesKeys = Object.keys(this.chapter.footnotes);
		for (var i = 0; i < footnotesKeys.length; i++) {
			chapterFootnotes.push({
				leading: { title: footnotesKeys[i], subtitle: this.chapter.footnotes[footnotesKeys[i]] },
			});
		}
		var footnotesList = new List({
			items: chapterFootnotes,
			itemConstructor: (item) => new ListItem(item),
		});
		this.panelContent.replaceChildren(footnotesList.listElement);

		this.redrawPanelSize();
		this.panel.classList.remove("hidden");
	}

	showPanel(title) {
		this.panelTitle.textContent = title;

		while (this.panelContent.firstChild) {
			this.panelContent.removeChild(this.panelContent.lastChild);
		}

		this.redrawPanelSize();
		this.panel.classList.remove("hidden");
	}

	hidePanel() {
		this.panel.classList.add("hidden");
		this.recenterActiveVerse();
	}

	redrawPanelSize() {
		var verseRect = this.activeVerseDisplay.element.getBoundingClientRect();
		const headerHeight = this.element.querySelector(".header").getBoundingClientRect().height;
		const footerHeight = this.footer.getBoundingClientRect().height;

		const maxPanelHeight = window.innerHeight - headerHeight - footerHeight - verseRect.height - 80;
		this.panel.style.maxHeight = maxPanelHeight + "px";

		requestAnimationFrame(this.recenterActiveVerse.bind(this));
	}

	recenterActiveVerse() {
		if (this.panel.classList.contains("hidden")) {
			const verseRect = this.activeVerseDisplay.element.getBoundingClientRect();
			const containerRect = this.versesContainer.getBoundingClientRect();
			const scrollTop = verseRect.top - containerRect.top + this.versesContainer.scrollTop - containerRect.height / 2 + verseRect.height / 2;
			this.versesContainer.scrollTo({
				top: scrollTop,
				behavior: "smooth",
			});
		} else {
			const headerHeight = this.element.querySelector(".header").getBoundingClientRect().height;
			var panelRect = this.panel.getBoundingClientRect();
			var activeVerseRect = this.activeVerseDisplay.element.getBoundingClientRect();
			const availableVerseSpace = panelRect.top - headerHeight;
			this.versesContainer.scrollTo({
				top: this.versesContainer.scrollTop + activeVerseRect.top - headerHeight - (availableVerseSpace - activeVerseRect.height) / 2,
				behavior: "smooth",
			});
		}
	}

	present() {
		if (this.reference.indexOf(":") !== -1) {
			this.selectVerse(this.reference);
		}
		requestAnimationFrame(() => {
			this.element.classList.remove("hidden");
		});
		return this;
	}

	dismiss() {
		this.element.classList.add("hidden");
	}

	get reference() {
		return this._reference;
	}
	set reference(value) {
		var oldReference = this.reference || "";
		this._reference = value;
		if (this.reference.split(":")[0] !== oldReference.split(":")[0]) {
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
				sectionTitleElement.addEventListener("click", this.deselectVerses.bind(this));
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
										this.showFootnotesPanel(value);
										break;
									case "word":
										this.showConcordancePanel(value);
										break;
									case "multiword":
										this.showPanel("Multiword Selection Coming Soon");
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
			}
			this.memoryWrapper.classList.remove("hidden");
		} else {
			this.memoryWrapper.classList.add("hidden");
			this.memoryReference.textContent = "Memory";
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
