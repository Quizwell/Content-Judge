class List {
	constructor({ items, itemConstructor, filterOptions, sortOptions, fullScreen = false, scrollable = true } = {}) {
		this.batchSize = 50;
		this.renderedCount = 0;

		this.itemConstructor = itemConstructor;
		this.filterOptions = filterOptions;
		this.sortOptions = sortOptions;

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

		this.listWrapper = document.createElement("div");
		this.listWrapper.classList.add("listWrapper");
		listElement.appendChild(this.listWrapper);

		this.listElement = listElement;

		if (!this.filterOptions && !this.sortOptions) {
			this.items = items;
		} else {
			this._items = items;
			if (this.filterOptions) {
				this.filterOptions.onchange();
			}
			if (this.sortOptions) {
				this.sortOptions.onchange();
			}
		}
	}

	get items() {
		return this._items;
	}

	set items(value) {
		this._items = value;
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
		let count = 0;
		for (let i = this.renderedCount; i < this._items.length && count < this.batchSize; i++) {
			const item = this._items[i];
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
