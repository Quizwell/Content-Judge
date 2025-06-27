class List {
	constructor({ items, itemConstructor, filterOptions, sortOptions, scrollable = true } = {}) {
		this.items = items;
		this.itemConstructor = itemConstructor;
		this.filterOptions = filterOptions;
		this.sortOptions = sortOptions;

		const listElement = document.createElement("div");
		listElement.classList.add("list");
		if (scrollable) {
			listElement.classList.add("scrollable");
		}

		if (filterOptions) {
			filterOptions.onchange = () => {
				// Loop thruogh all item elements and toggle their visibility based on the filter options
				const updatedOptions = filterOptions.options;
				items.forEach((item) => {
					if (!item.section) {
						if (filterOptions.evaluateItem(item, updatedOptions)) {
							item.itemElement.classList.remove("hidden");
						} else {
							item.itemElement.classList.add("hidden");
						}
					}
				});
			};
			listElement.appendChild(filterOptions.optionsElement);
		}
		if (sortOptions) {
			sortOptions.onchange = () => {
				sortOptions.sort(items, sortOptions.order, sortOptions.options);
				this.render();
			};
			listElement.appendChild(sortOptions.optionsElement);
		}

		this.listWrapper = document.createElement("div");
		this.listWrapper.classList.add("listWrapper");
		listElement.appendChild(this.listWrapper);

		if (sortOptions) {
			sortOptions.onchange(items);
		}
		this.render();

		this.listElement = listElement;
	}

	render() {
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
		if (this.filterOptions) {
			this.filterOptions.onchange();
		}
	}
}
