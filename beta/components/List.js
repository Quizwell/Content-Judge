function List({ items, itemConstructor, filterOptions, sortOptions } = {}) {
	const listElement = document.createElement("div");
	listElement.classList.add("list");

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

	const listWrapper = document.createElement("div");
	listWrapper.classList.add("listWrapper");
	listElement.appendChild(listWrapper);

	this.render = function () {
		while (listWrapper.firstChild) {
			listWrapper.removeChild(listWrapper.firstChild);
		}

		items.forEach((item) => {
			if (item.section) {
				const sectionTitleElement = document.createElement("h3");
				sectionTitleElement.classList.add("sectionTitle");
				sectionTitleElement.textContent = item.section;
				listWrapper.appendChild(sectionTitleElement);
			} else {
				item.itemElement = itemConstructor(item).itemElement;
				listWrapper.appendChild(item.itemElement);
			}
		});
		if (filterOptions) {
			filterOptions.onchange();
		}
	};

	if (sortOptions) {
		sortOptions.onchange(items);
	}
	this.render();

	this.listElement = listElement;
}
