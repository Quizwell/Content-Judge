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
		closeButton.appendChild(new Icon("circle-chevron-left"));
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
		this.list = new List({
			items: [],
			itemConstructor: (listItem) => {
				var listItemElement;
				var currentVerse = new Verse(listItem.reference);
				listItemElement = new ListItem({
					leading: {
						title: listItem.footnote ? listItem.reference + " [" + listItem.footnote.letter + "]" : listItem.reference,
						subtitle: listItem.footnote ? listItem.footnote.text : currentVerse.text,
					},
					trailing: {
						icon: "chevron-right",
					},
					callback: () => {
						new ChapterDisplay(listItem.reference, {
							allowVerseSelection: true,
						}).present();
					},
				});
				return listItemElement;
			},
			fullScreen: true,
			scrollable: true,
		});
		this.element.appendChild(this.list.listElement);

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
	onblur() {
		if (this.input.value.trim().length === 0) {
			this.dismiss();
		}
	}
	oninput() {
		this.element.classList.add("loading");
		this.list.listElement.classList.add("hidden");
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
		this.input.focus();
	}

	get query() {
		return this._query;
	}

	set query(query) {
		if (this._query === query) {
			this.element.classList.remove("loading");
			return;
		}

		this._query = query;
		if (query.length === 0) {
			this.element.classList.remove("loading");
			return;
		}

		//Remove all current search results
		this.list.items = [];

		var footnoteSearchResults = scriptureEngine.getFootnotesByContent(query, storageManager.get("useAdvancedSearch"));
		var contentSearchResults = scriptureEngine.getVersesByContent(query, storageManager.get("useAdvancedSearch"));

		contentSearchResults = footnoteSearchResults.concat(contentSearchResults);

		if (contentSearchResults.length > 0) {
			this.list.items = contentSearchResults;
		} else {
			//There are no search results, so show a message indicating so.
			var messageElement = document.createElement("p");
			messageElement.classList.add("message");
			messageElement.textContent = "There are no matches for your search.";
			this.list.appendChild(messageElement);
		}

		this.element.classList.remove("loading");
		this.list.listElement.classList.remove("hidden");
	}

	dismiss() {
		this.overlay.hide();
		this.element.classList.add("hidden");
		setTimeout(() => {
			this.overlay.destroy();
			this.element.remove();
		}, 200);
	}
}
