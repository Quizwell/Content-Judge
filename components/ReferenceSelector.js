function ReferenceSelector({ anchored } = {}) {
	this.currentSearchObject = {
		bookAbbreviation: undefined,
		chapter: undefined,
		verse: undefined,
	};

	this.present = function () {
		if (anchored) {
			const rect = this.anchorElement.getBoundingClientRect();
			const top = rect.top - 45;
			this.containerElement.style.top = Math.max(top, 20) + "px";
		}

		document.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Escape") {
					this.back();
				}
			},
			{ once: true }
		);

		this.overlay.show();
		requestAnimationFrame(() => {
			this.containerElement.classList.remove("hidden");
		});
	};
	this.dismiss = function () {
		this.chaptersContainer.classList.add("hidden");
		this.versesContainer.classList.add("hidden");
		this.containerElement.classList.add("hidden");
		this.overlay.hide();
	};

	this.showBookSelection = function () {
		var booksContainer;
		if (anchored) {
			booksContainer = document.createElement("div");
			booksContainer.classList.add("book");
			this.anchorElement.appendChild(booksContainer);
		} else {
			booksContainer = this.booksContainer;
		}

		while (booksContainer.firstChild) {
			booksContainer.removeChild(booksContainer.firstChild);
		}

		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];

			var bookElement = document.createElement("div");
			bookElement.classList.add("item");
			(function (bookAbbreviation) {
				bookElement.addEventListener(
					"click",
					function () {
						this.currentSearchObject.bookAbbreviation = bookAbbreviation;
						this.currentSearchObject.chapter = undefined;
						this.currentSearchObject.verse = undefined;
						this.showChapterSelection();
					}.bind(this)
				);
			}).bind(this)(currentBook.abbreviation);

			var abbreviationElement = document.createElement("h1");
			abbreviationElement.classList.add("abbreviation");
			abbreviationElement.textContent = currentBook.abbreviation;

			var bookNameElement = document.createElement("p");
			bookNameElement.classList.add("name");
			bookNameElement.textContent = currentBook.name;

			bookElement.appendChild(abbreviationElement);
			bookElement.appendChild(bookNameElement);
			bookElement.appendChild(new Icon("chevron-right"));

			booksContainer.appendChild(bookElement);
		}

		if (!anchored) {
			this.headerTitle.textContent = "Select a Book";
			this.backIcon.classList.remove("fa-circle-chevron-left");
			this.backIcon.classList.add("fa-circle-xmark");
			this.doneButton.classList.add("hidden");
			this.booksContainer.classList.remove("hidden");
			this.present();
		}
	};

	this.showChapterSelection = function () {
		while (this.chaptersContainer.firstChild) {
			this.chaptersContainer.removeChild(this.chaptersContainer.firstChild);
		}

		var bookAbbreviation = this.currentSearchObject.bookAbbreviation;
		var selectedBookObject = scriptureEngine.getBookByAbbreviation(bookAbbreviation);

		var numberOfChapters = selectedBookObject.chapters.length;
		for (var i = 0; i < numberOfChapters; i++) {
			var chapterElement = document.createElement("div");
			chapterElement.textContent = i + 1;
			(function (chapterNumber) {
				chapterElement.addEventListener(
					"click",
					function () {
						this.currentSearchObject.chapter = chapterNumber;
						this.showVerseSelection();
					}.bind(this)
				);
			}).bind(this)(i + 1);

			this.chaptersContainer.appendChild(chapterElement);
		}

		this.chaptersContainer.scrollTop = 0;

		this.headerTitle.textContent = scriptureEngine.unabbreviateBookNamesInString(bookAbbreviation);
		this.backIcon.classList.remove("fa-circle-xmark");
		this.backIcon.classList.add("fa-circle-chevron-left");
		this.doneButton.classList.add("hidden");

		this.booksContainer.classList.add("hidden");
		this.chaptersContainer.classList.remove("hidden");

		if (anchored) {
			this.present();
		}
	};

	this.showVerseSelection = function () {
		while (this.versesContainer.firstChild) {
			this.versesContainer.removeChild(this.versesContainer.firstChild);
		}

		var selectedBookAbbreviation = this.currentSearchObject.bookAbbreviation;
		var selectedBook = scriptureEngine.getBookByAbbreviation(this.currentSearchObject.bookAbbreviation);
		var chapterNumber = this.currentSearchObject.chapter;

		var numberOfVerses = new Verse(selectedBookAbbreviation + " " + chapterNumber + ":1").chapterLength;
		for (var i = 0; i < numberOfVerses; i++) {
			var verseElement = document.createElement("div");
			// If the verse is a memory verse, add a class to the element
			var memoryStatus = new Verse(selectedBookAbbreviation + " " + chapterNumber + ":" + (i + 1)).memory;
			if (memoryStatus.status) {
				verseElement.classList.add("memory");
				if (memoryStatus.start.reference === selectedBookAbbreviation + " " + chapterNumber + ":" + (i + 1)) {
					verseElement.classList.add("start");
				}
			}
			verseElement.textContent = i + 1;
			(function (verseNumber) {
				verseElement.addEventListener(
					"click",
					function () {
						this.dismiss();
						this.currentSearchObject.verse = verseNumber;

						var bookAbbreviation = this.currentSearchObject.bookAbbreviation;
						var chapterNumber = this.currentSearchObject.chapter;
						var referenceString = bookAbbreviation + " " + chapterNumber + ":" + verseNumber;

						UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(referenceString);
					}.bind(this)
				);
			}).bind(this)(i + 1);

			this.versesContainer.appendChild(verseElement);
		}

		this.versesContainer.scrollTop = 0;

		this.headerTitle.textContent = scriptureEngine.unabbreviateBookNamesInString(this.currentSearchObject.bookAbbreviation) + " " + chapterNumber;
		this.backIcon.classList.remove("fa-circle-xmark");
		this.backIcon.classList.add("fa-circle-chevron-left");
		this.doneButton.classList.remove("hidden");

		this.chaptersContainer.classList.add("hidden");
		this.versesContainer.classList.remove("hidden");

		var floatingRect = this.versesContainer.getBoundingClientRect();
		if (floatingRect.height > window.innerHeight - 90) {
			// If the floating element is taller than the viewport, limit its height
			this.versesContainer.style.maxHeight = window.innerHeight - 90 + "px";
			floatingRect = this.versesContainer.getBoundingClientRect();
		}
		if (floatingRect.bottom + 50 > window.innerHeight) {
			// If the bottom edge is below the viewport, adjust the top position
			this.containerElement.style.top = window.innerHeight - floatingRect.height - 70 + "px";
		}
	};

	this.resetNavigation = function () {
		this.hideVerseSelection();
		if (scriptureEngine.currentYearObject.books.length > 1) {
			this.hideChapterSelection();
		}
	};

	this.back = function () {
		if (!this.versesContainer.classList.contains("hidden")) {
			this.versesContainer.classList.add("hidden");
			this.showChapterSelection();
		} else if (!this.chaptersContainer.classList.contains("hidden")) {
			this.chaptersContainer.classList.add("hidden");
			if (!anchored) {
				this.showBookSelection();
			} else {
				this.dismiss();
			}
		} else {
			this.dismiss();
		}
	};

	this.done = function () {
		this.dismiss();
		var referenceString = this.currentSearchObject.bookAbbreviation + " " + this.currentSearchObject.chapter;
		UIManager.chapterDisplayScreen.populateAndShowChapterDisplayScreen(referenceString);
	};

	this.containerElement = document.createElement("div");
	this.containerElement.classList.add("referenceSelector");
	this.containerElement.classList.add("floating");
	this.containerElement.classList.add("hidden");

	var headerContainer = document.createElement("div");
	headerContainer.classList.add("header");

	var backButton = document.createElement("div");
	backButton.classList.add("back");
	backButton.appendChild(new Icon("circle-xmark"));
	backButton.addEventListener("click", this.back.bind(this));
	headerContainer.appendChild(backButton);

	Object.defineProperty(this, "backIcon", {
		get: function () {
			return backButton.firstElementChild;
		},
	});

	this.headerTitle = document.createElement("h1");
	this.headerTitle.classList.add("title");
	headerContainer.appendChild(this.headerTitle);

	this.doneButton = document.createElement("div");
	this.doneButton.classList.add("done");
	this.doneButton.appendChild(new Icon("circle-check"));
	this.doneButton.addEventListener("click", this.done.bind(this));
	headerContainer.appendChild(this.doneButton);

	this.containerElement.appendChild(headerContainer);

	this.itemsWrapper = document.createElement("div");
	this.itemsWrapper.classList.add("items");
	this.containerElement.appendChild(this.itemsWrapper);

	this.booksContainer = document.createElement("div");
	this.booksContainer.classList.add("book");
	this.itemsWrapper.appendChild(this.booksContainer);

	this.chaptersContainer = document.createElement("div");
	this.chaptersContainer.classList.add("chapter");
	this.chaptersContainer.classList.add("smallGrid");
	this.chaptersContainer.classList.add("hidden");
	this.itemsWrapper.appendChild(this.chaptersContainer);

	this.versesContainer = document.createElement("div");
	this.versesContainer.classList.add("verse");
	this.versesContainer.classList.add("smallGrid");
	this.versesContainer.classList.add("hidden");
	this.itemsWrapper.appendChild(this.versesContainer);

	this.overlay = new Overlay();

	document.body.appendChild(this.overlay.element);
	document.body.appendChild(this.containerElement);

	if (anchored) {
		this.anchorElement = document.createElement("div");
		this.anchorElement.classList.add("referenceSelector");
		this.anchorElement.classList.add("anchored");
		this.showBookSelection();
	}
}
