class List {
	constructor({ items, itemConstructor, filterOptions, sortOptions, searchOptions, fullScreen = false, scrollable = true } = {}) {
		this.batchSize = 50;
		this.renderedCount = 0;

		this.itemConstructor = itemConstructor;
		this.filterOptions = filterOptions;
		this.sortOptions = sortOptions;
		this.searchOptions = searchOptions;

		const listElement = document.createElement("div");
		listElement.classList.add("list");
		if (fullScreen) {
			listElement.classList.add("fullScreen");
		}
		if (scrollable) {
			listElement.classList.add("scrollable");
		}

		if (filterOptions) {
			filterOptions.parentList = this;
			listElement.appendChild(filterOptions.optionsElement);
		}
		if (sortOptions) {
			sortOptions.parentList = this;
			listElement.appendChild(sortOptions.optionsElement);
		}
		if (searchOptions) {
			searchOptions.parentList = this;
			listElement.appendChild(searchOptions.optionsElement);
		}

		this.listWrapper = document.createElement("div");
		this.listWrapper.classList.add("listWrapper");
		listElement.appendChild(this.listWrapper);

		this.listElement = listElement;

		this.items = items;
	}

	get items() {
		return this._items;
	}

	set items(value) {
		this._items = value;
		if (this.filterOptions) {
			this.filterOptions.onchange();
		} else {
			this.filteredItems = value;
		}
	}

	get filteredItems() {
		return this._filteredItems;
	}
	set filteredItems(value) {
		this._filteredItems = value;
		if (this.sortOptions) {
			this.sortOptions.onchange();
		} else {
			this.sortedItems = value;
		}
	}

	get sortedItems() {
		return this._sortedItems;
	}
	set sortedItems(value) {
		this._sortedItems = value;
		if (this.searchOptions) {
			this.searchOptions.onchange();
		} else {
			this.searchedItems = value;
		}
	}

	get searchedItems() {
		return this._searchedItems;
	}
	set searchedItems(value) {
		this._searchedItems = value;
		this._rerenderList();
	}

	_rerenderList() {
		this.renderedCount = 0;
		while (this.listWrapper.firstChild) {
			this.listWrapper.removeChild(this.listWrapper.lastChild);
		}

		this._renderNextBatch();

		this.listWrapper.scrollTop = 0;

		// Remove previous listener to avoid duplicates
		this.listWrapper.removeEventListener("scroll", this._onScroll.bind(this));
		this.listWrapper.addEventListener("scroll", this._onScroll.bind(this));
	}

	_renderNextBatch() {
		const renderItems = this.searchedItems;
		if (renderItems === undefined) {
			console.warn("No items to render");
			return;
		}
		let count = 0;
		for (let i = this.renderedCount; i < renderItems.length && count < this.batchSize; i++) {
			const item = renderItems[i];
			if (item.section) {
				const sectionTitleElement = document.createElement("h3");
				sectionTitleElement.classList.add("sectionTitle");
				sectionTitleElement.textContent = item.section;
				this.listWrapper.appendChild(sectionTitleElement);
			} else {
				item.itemElement = this.itemConstructor(item).itemElement;
				this.listWrapper.appendChild(item.itemElement);
			}
			count++;
			this.renderedCount++;
		}
	}

	_onScroll() {
		const { scrollTop, scrollHeight, clientHeight } = this.listWrapper;
		if (scrollTop + clientHeight >= scrollHeight - 200) {
			if (this.renderedCount < this._items.length) {
				this._renderNextBatch();
			}
		}
	}
}
