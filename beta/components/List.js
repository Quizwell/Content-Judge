class List {
	constructor({ items, itemConstructor, filterOptions, sortOptions, fullScreen = false, scrollable = true } = {}) {
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

		while (this.listWrapper.firstChild) {
			this.listWrapper.removeChild(this.listWrapper.lastChild);
		}

		this.items.forEach((item) => {
			if (item.section) {
				const sectionTitleElement = document.createElement("h3");
				sectionTitleElement.classList.add("sectionTitle");
				sectionTitleElement.textContent = item.section;
				this.listWrapper.appendChild(sectionTitleElement);
			} else {
				item.itemElement = this.itemConstructor(item).itemElement;
				this.listWrapper.appendChild(item.itemElement);
			}
		});

		this.listWrapper.scrollTop = 0;
	}
}
