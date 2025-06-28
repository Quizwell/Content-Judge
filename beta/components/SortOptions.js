class SortOptions {
	constructor({ items, order = "ascending", onchange = () => {} } = {}) {
		const optionsElement = document.createElement("div");
		optionsElement.classList.add("options");
		optionsElement.classList.add("sort");
		this.optionsElement = optionsElement;

		var iconContainer = document.createElement("div");
		iconContainer.classList.add("iconContainer");
		if (order === "descending") {
			iconContainer.classList.add("descending");
		}
		iconContainer.addEventListener("click", () => {
			// Toggle the order between ascending and descending
			this.order = this.order === "ascending" ? "descending" : "ascending";
		});
		iconContainer.appendChild(new Icon("arrow-down-up-across-line"));
		optionsElement.appendChild(iconContainer);
		this.iconContainer = iconContainer;

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
				for (const child of itemsWrapper.children) {
					child.classList.remove("enabled");
				}
				itemElement.classList.add("enabled");
				this.onchange();
			});

			itemsWrapper.appendChild(itemElement);
		});
		this.items = items;

		this.onchange = () => {
			this.parentList.items = onchange(this.parentList.items, this.options, this.order);
		};
		this._order = order;
	}

	get order() {
		return this._order;
	}

	set order(value) {
		this._order = value;
		this.iconContainer.classList.toggle("descending", value === "descending");
		// If any of the item elements have an iconDescending property specified, update their icons accordingly
		for (var itemElement of this.itemsWrapper.children) {
			const item = this.items.find((i) => i.value === itemElement.dataset.value);
			if (item && item.iconDescending) {
				itemElement.firstChild.classList.toggle("fa-" + item.icon);
				itemElement.firstChild.classList.toggle("fa-" + item.iconDescending);
			}
		}
		this.onchange();
	}

	get options() {
		const enabledItem = this.itemsWrapper.querySelector(".item.enabled");
		return enabledItem.dataset.value;
	}
}
