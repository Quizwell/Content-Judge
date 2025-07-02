class FilterOptions {
	constructor({ items, multiple = true, onchange = () => {} } = {}) {
		const optionsElement = document.createElement("div");
		optionsElement.classList.add("options");
		optionsElement.classList.add("filter");
		this.optionsElement = optionsElement;

		optionsElement.appendChild(new Icon("filter"));

		const itemsWrapper = document.createElement("div");
		itemsWrapper.classList.add("itemsWrapper");
		optionsElement.appendChild(itemsWrapper);
		this.itemsWrapper = itemsWrapper;

		items.forEach((item) => {
			const itemElement = document.createElement("div");
			itemElement.classList.add("item");
			if (item.enabled) {
				itemElement.classList.add("enabled");
			}
			if (item.color) {
				itemElement.style.setProperty("--item-color", item.color);
			}
			itemElement.dataset.value = item.value;

			if (item.icon) {
				itemElement.appendChild(new Icon(item.icon));
			}

			const itemLabel = document.createElement("span");
			itemLabel.textContent = item.label;
			itemElement.appendChild(itemLabel);

			itemElement.addEventListener("click", () => {
				if (multiple === false) {
					for (const child of itemsWrapper.children) {
						if (child !== itemElement) {
							child.classList.remove("enabled");
						}
					}
				}
				itemElement.classList.toggle("enabled");
				this.onchange();
			});

			itemsWrapper.appendChild(itemElement);
		});

		this.onchange = () => {
			this.parentList.filteredItems = onchange(this.parentList._items, this.options);
		};
	}

	get options() {
		const options = {};
		for (const item of this.itemsWrapper.children) {
			options[item.dataset.value] = item.classList.contains("enabled");
		}
		return options;
	}
}
