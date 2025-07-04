class VerseDisplay {
	constructor(verse, { selectable = false, showRareWords = true, showPrejump = true, selectionCallback } = {}) {
		if (typeof verse === "string") {
			this.verse = new Verse(verse);
			this.reference = verse;
		} else if (verse instanceof Verse) {
			this.verse = verse;
			this.reference = verse.reference;
		}

		this.element = document.createElement("div");
		this.element.className = "verseDisplay";
		this.selectable = selectable;
		this.showRareWords = showRareWords;
		this.showPrejump = showPrejump;
		this.select = selectionCallback;

		// Add event listeners for word selection
		this.element.addEventListener("mousedown", this.dragStart.bind(this));
		this.element.addEventListener("touchstart", this.dragStart.bind(this));
		this.element.addEventListener("mousemove", this.dragMove.bind(this));
		this.element.addEventListener("touchmove", this.dragMove.bind(this));
		this.element.addEventListener("mouseup", this.dragEnd.bind(this));
		this.element.addEventListener("touchend", this.dragEnd.bind(this));
		this.dragData = {};

		const prejumpLength = this.verse.memory.prejump?.split(" ").length;
		const splitWords = this.verse.text.split(" ");
		for (var w = 0; w < splitWords.length; w++) {
			const word = splitWords[w];

			const wordWrapper = document.createElement("span");
			wordWrapper.className = "word";
			this.element.appendChild(wordWrapper);

			if (this.verse.memory.status && this.verse.memory.start.reference === this.verse.reference && w < prejumpLength) {
				wordWrapper.classList.add("prejump");
			}

			// Filter out punctuation and quotation marks at the start and end of the word
			var startCharacters;
			startCharacters = word.match(/^[^\w]+/);
			// Get all of the punctuation and footnotes following the word
			var endCharacters = word.match(/([\.,:;?!()\[\]"']|\[\w+\])+$/);

			var filteredWord = word.slice(startCharacters ? startCharacters[0].length : 0, word.length - (endCharacters ? endCharacters[0].length : 0));

			if (filteredWord === "") {
				// If the filtered word is empty, skip this iteration
				continue;
			}

			if (startCharacters) {
				const startElement = document.createElement("span");
				startElement.textContent = startCharacters[0];
				wordWrapper.appendChild(startElement);
			}

			const wordElement = document.createElement("span");
			wordElement.className = "selectable";
			wordElement.textContent = filteredWord;
			if (!scriptureEngine.currentYearObject.concordance[filteredWord.toLowerCase()]) {
				console.warn(`Concordance entry not found for word: ${filteredWord}`);
			}
			const occurrenceCount = scriptureEngine.currentYearObject.concordance[filteredWord.toLowerCase()].references.length;
			switch (occurrenceCount) {
				case 1:
					wordElement.classList.add("unique");
					break;
				case 2:
					wordElement.classList.add("double");
					break;
				case 3:
					wordElement.classList.add("triple");
					break;
			}
			wordElement.textContent = filteredWord;
			wordWrapper.appendChild(wordElement);

			if (endCharacters) {
				// If there are footnotes (e.g. [a]) in the end characters, each one
				// needs to be a separate element, so create an array of each block
				// of special characters and each footnotes
				const endCharactersArray = endCharacters[0].split(/(\[\w+\])/).filter(Boolean);
				for (const endChar of endCharactersArray) {
					const endElement = document.createElement("span");
					if (endChar.startsWith("[")) {
						endElement.classList.add("footnote");
					}
					endElement.textContent = endChar;
					wordWrapper.appendChild(endElement);
				}
			}
		}
	}

	updateDragHighlight() {
		const words = this.element.children;
		const startIndex = this.dragData.startIndex;
		const currentIndex = this.dragData.currentIndex;
		const minIndex = Math.min(startIndex, currentIndex);
		const maxIndex = Math.max(startIndex, currentIndex);

		// Clear previous highlights
		for (let i = 0; i < words.length; i++) {
			words[i].classList.remove("multiselected");
			words[i].classList.remove("start");
			words[i].classList.remove("end");
		}

		if (!this.dragData.isDragging) return;

		// Highlight the range of words
		for (let i = minIndex; i <= maxIndex; i++) {
			words[i].classList.add("multiselected");
			if (i === minIndex) {
				words[i].classList.add("start");
			}
			if (i === maxIndex) {
				words[i].classList.add("end");
			}
		}
	}
	dragStart(event) {
		if (!this.selectable) return;
		if (event.touches && event.touches.length > 1) {
			// Ignore multi-touch events
			return;
		}

		if (event.type === "touchstart") {
			event.preventDefault();
		}

		// Find the starting word
		const target = event.target.closest(".word");
		if (!target) {
			return;
		}
		this.dragData.isDragging = true;
		this.dragData.startPosition = {
			x: event.touches ? event.touches[0].clientX : event.clientX,
			y: event.touches ? event.touches[0].clientY : event.clientY,
		};
		this.dragData.startIndex = Array.from(this.element.children).indexOf(target);
		this.dragData.currentIndex = this.dragData.startIndex;
	}
	dragMove(event) {
		if (!this.selectable || !this.dragData.isDragging) return;

		// Check if the drag has moved significantly. If not, return.
		const currentPosition = {
			x: event.touches ? event.touches[0].clientX : event.clientX,
			y: event.touches ? event.touches[0].clientY : event.clientY,
		};
		if (Math.abs(currentPosition.x - this.dragData.startPosition.x) < 10 && Math.abs(currentPosition.y - this.dragData.startPosition.y) < 10) {
			return;
		}

		this.dragData.hasMovedSignificantly = true;
		this.deselect({ clearSelection: false, clearMultiword: false });
		this.dragData.startPosition = {};
		event.preventDefault();

		// Find the current word
		const target = document.elementFromPoint(currentPosition.x, currentPosition.y).closest(".word");
		if (!target || !this.element.contains(target)) {
			return;
		}
		const currentIndex = Array.from(this.element.children).indexOf(target);
		if (currentIndex !== this.dragData.currentIndex) {
			this.dragData.currentIndex = currentIndex;
			this.updateDragHighlight();
		}
	}
	dragEnd(event) {
		if (!this.selectable) return;

		// If the mousedown and mouseup events occured on the same word
		if (this.dragData.startIndex === this.dragData.currentIndex) {
			// Make sure the click wasn't on a footnote
			if (event.target.classList.contains("footnote")) {
				this.deselect({ clearSelection: false });
				this.select("footnote", event.target.textContent.slice(1, -1));
				return;
			}

			// If the word was already selected, deselect it
			const wordElement = this.element.children[this.dragData.startIndex];
			if (wordElement.classList.contains("selected") || (wordElement.classList.contains("multiselected") && !this.dragData.hasMovedSignificantly)) {
				this.deselect();
			} else {
				// Otherwise, select the word
				this.deselect({ clearSelection: false });
				const wordText = wordElement.querySelector(".selectable").textContent;
				this.select("word", wordText);
				wordElement.classList.add("selected");
			}
			return;
		}

		if (event.touches && event.touches.length > 1) {
			// Ignore multi-touch events
			return;
		}

		this.dragData.isDragging = false;
		this.dragData.hasMovedSignificantly = false;
		event.preventDefault();

		// Select the range of words
		const words = this.element.children;
		const startIndex = this.dragData.startIndex;
		const currentIndex = this.dragData.currentIndex;
		const minIndex = Math.min(startIndex, currentIndex);
		const maxIndex = Math.max(startIndex, currentIndex);
		const selectedWords = [];
		for (let i = minIndex; i <= maxIndex; i++) {
			const wordElement = words[i].querySelector(".selectable");
			if (wordElement) {
				selectedWords.push(wordElement.textContent);
			}
		}
		if (selectedWords.length > 0) {
			this.select("multiword", selectedWords.join(" "));
		}
	}

	select(type, value) {
		switch (type) {
			case "footnote":
				console.log(`Footnote selected: ${value}`);
				break;
			case "word":
				console.log(`Word selected: ${value}`);
				break;
			case "multiword":
				console.log(`Multiword selected: ${value}`);
				break;
		}
	}

	deselect({ clearSelection = true, clearMultiword = true } = {}) {
		this.element.querySelectorAll(".word.selected").forEach((selectedWord) => {
			selectedWord.classList.remove("selected");
		});
		if (clearMultiword) {
			this.dragData.isDragging = false;
			this.updateDragHighlight();
		}
		if (clearSelection) {
			this.select(null);
		}
	}

	get selectable() {
		return this._selectable;
	}
	set selectable(value) {
		this._selectable = value;
		if (value) {
			this.element.classList.add("selectable");
		} else {
			this.element.querySelectorAll(".word.multiselected").forEach((selectedWord) => {
				selectedWord.classList.remove("multiselected");
				selectedWord.classList.remove("start");
				selectedWord.classList.remove("end");
			});
			this.dragData = {};
			this.deselect({ clearSelection: false });
			this.element.classList.remove("selectable");
		}
	}

	get showRareWords() {
		return this._showRareWords;
	}
	set showRareWords(value) {
		this._showRareWords = value;
		if (value) {
			this.element.classList.add("showRareWords");
		} else {
			this.element.classList.remove("showRareWords");
		}
	}

	get showPrejump() {
		return this._showPrejump;
	}
	set showPrejump(value) {
		this._showPrejump = value;
		if (value) {
			this.element.classList.add("showPrejump");
		} else {
			this.element.classList.remove("showPrejump");
		}
	}
}
