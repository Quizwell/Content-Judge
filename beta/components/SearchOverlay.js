class SearchOverlay {
	constructor() {
		this.element = document.createElement("div");
		this.element.classList.add("searchOverlay");
		this.element.classList.add("hidden");

		const headerContainer = document.createElement("div");
		headerContainer.classList.add("header");

		// Close Button
		const closeButton = document.createElement("div");
		closeButton.classList.add("closeButton");
		closeButton.appendChild(new Icon("chevron-left"));
		closeButton.onclick = () => {
			this.dismiss();
		};
		headerContainer.appendChild(closeButton);

		// Wrapper
		const searchBarWrapper = document.createElement("div");
		searchBarWrapper.classList.add("searchBarWrapper");

		// Icon
		const searchIcon = document.createElement("i");
		searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
		searchBarWrapper.appendChild(searchIcon);

		// Input
		const searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.placeholder = "Search...";
		searchInput.classList.add("searchBar");
		searchInput.onfocus = this.onfocus.bind(this);
		searchInput.onblur = this.onblur.bind(this);
		searchInput.oninput = this.oninput.bind(this);
		searchInput.onchange = this.onchange.bind(this);
		searchBarWrapper.appendChild(searchInput);

		this.input = searchInput;

		// Clear Button
		const clearButton = document.createElement("div");
		clearButton.classList.add("clearButton");
		clearButton.appendChild(new Icon("circle-xmark"));
		clearButton.onclick = this.clear.bind(this);
		searchBarWrapper.appendChild(clearButton);

		headerContainer.appendChild(searchBarWrapper);

		this.element.appendChild(headerContainer);

		// List
		this.list = document.createElement("div");
		this.list.classList.add("list");
		this.element.appendChild(this.list);

		this.overlay = new Overlay();

		document.body.appendChild(this.overlay.element);
		document.body.appendChild(this.element);

		this.query = "";
		this.inputTimeout = null;

		searchInput.focus();
		requestAnimationFrame(() => {
			this.overlay.show();
			this.element.classList.remove("hidden");
		});
	}

	onfocus() {}
	onblur() {}
	oninput() {
		this.element.classList.add("loading");
		this.list.classList.add("hidden");
		if (this.inputTimeout) {
			clearTimeout(this.inputTimeout);
		}
		this.inputTimeout = setTimeout(() => {
			this.query = this.input.value.trim();
		}, 300); // Delay to avoid excessive calls
	}
	onchange() {
		this.query = this.input.value.trim();
	}

	clear() {
		this.input.value = "";
		this.oninput();
	}

	get query() {
		return this._query;
	}

	set query(query) {
		if (this._query === query) {
			return;
		}

		this._query = query;

		this.list.classList.add("hidden");

		if (query.length === 0) {
			return;
		}

		//Remove all current search results
		while (this.list.firstChild) {
			this.list.removeChild(this.list.lastChild);
		}

		var footnoteSearchResults = scriptureEngine.getFootnotesByContent(query, storageManager.get("useAdvancedSearch"));
		var contentSearchResults = scriptureEngine.getVersesByContent(query, storageManager.get("useAdvancedSearch"));

		contentSearchResults = footnoteSearchResults.concat(contentSearchResults);

		if (contentSearchResults.length > 0) {
			const listWrapper = document.createElement("div");
			listWrapper.classList.add("listWrapper");
			this.list.appendChild(listWrapper);

			//Loop through every search result and create an element for each
			for (var i = 0; i < contentSearchResults.length; i++) {
				var currentSearchResult = contentSearchResults[i];
				var listItemElement;

				(function (currentSearchResult) {
					var currentVerse = new Verse(currentSearchResult.reference);
					listItemElement = new ListItem({
						leading: {
							title: currentSearchResult.footnote ? currentSearchResult.reference + " [" + currentSearchResult.footnote.letter + "]" : currentSearchResult.reference,
							subtitle: currentSearchResult.footnote ? currentSearchResult.footnote.text : currentVerse.text,
						},
						trailing: {
							icon: "chevron-right",
						},
						callback: () => {
							new ChapterDisplay(currentSearchResult.reference, {
								allowVerseSelection: true,
								showRareWords: true,
								showPrejump: true,
							}).present();
						},
					}).itemElement;
				})(currentSearchResult);

				listItemElement.style.animationDelay = i * 50 + "ms";

				listWrapper.appendChild(listItemElement);
			}
		} else {
			//There are no search results, so show a message indicating so.
			var messageElement = document.createElement("p");
			messageElement.classList.add("message");
			messageElement.textContent = "There are no matches for your search.";
			this.list.appendChild(messageElement);
		}

		this.element.classList.remove("loading");
		this.list.classList.remove("hidden");
	}

	dismiss() {
		this.overlay.hide();
		this.element.classList.add("hidden");
		setTimeout(() => {
			this.element.remove();
		}, 200);
	}
}
