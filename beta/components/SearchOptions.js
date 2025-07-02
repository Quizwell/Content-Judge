class SearchOptions {
	constructor({ onchange = () => {} } = {}) {
		const optionsElement = document.createElement("div");
		optionsElement.classList.add("options");
		optionsElement.classList.add("search");
		this.optionsElement = optionsElement;

		optionsElement.appendChild(new Icon("magnifying-glass"));

		const searchBarWrapper = document.createElement("div");
		searchBarWrapper.classList.add("searchBarWrapper");

		const searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.placeholder = "Search";
		searchInput.classList.add("searchBar");
		searchInput.onfocus = this.onfocus.bind(this);
		searchInput.onblur = this.onblur.bind(this);
		searchInput.oninput = this.oninput.bind(this);
		searchInput.onchange = this.oninputchange.bind(this);
		searchBarWrapper.appendChild(searchInput);

		this.input = searchInput;

		const clearButton = document.createElement("div");
		clearButton.classList.add("clearButton");
		clearButton.appendChild(new Icon("circle-xmark"));
		clearButton.onclick = this.clear.bind(this);
		searchBarWrapper.appendChild(clearButton);

		optionsElement.appendChild(searchBarWrapper);

		this.onchange = () => {
			this.parentList.searchedItems = onchange(this.parentList._sortedItems, this.value);
		};
	}

	onfocus() {}
	onblur() {}
	oninput() {
		if (this.inputTimeout) {
			clearTimeout(this.inputTimeout);
		}
		this.inputTimeout = setTimeout(() => {
			this.value = this.input.value.trim();
		}, 300); // Delay to avoid excessive calls
	}
	oninputchange() {
		this.value = this.input.value.trim();
	}

	clear() {
		this.input.value = "";
		this.oninputchange();
	}

	get value() {
		return this._value || "";
	}
	set value(value) {
		if (this._value === value) {
			return;
		}
		this._value = value;
		this.onchange();
		if (value.length === 0) {
			return;
		}
	}
}
