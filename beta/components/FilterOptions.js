class FilterOptions {
	constructor({ items, multiple = true, onchange = () => {} } = {}) {
		this.options = {};
		for (const item of items) {
			if (item.options) {
				this.options[item.value] = {};
				for (const option of item.options) {
					this.options[item.value][option.value] = option.enabled || false;
				}
			} else {
				this.options[item.value] = item.enabled || false;
			}
		}

		const optionsElement = document.createElement("div");
		optionsElement.classList.add("options");
		optionsElement.classList.add("filter");
		this.optionsElement = optionsElement;

		var resetButton = document.createElement("div");
		resetButton.classList.add("iconContainer");
		resetButton.addEventListener("click", this.reset.bind(this));
		resetButton.appendChild(new Icon("filter-circle-xmark"));
		optionsElement.appendChild(resetButton);
		this.resetButton = resetButton;

		const itemsWrapper = document.createElement("div");
		itemsWrapper.classList.add("itemsWrapper");
		optionsElement.appendChild(itemsWrapper);
		this.itemsWrapper = itemsWrapper;

		items.forEach((item) => {
			if (!item.options) {
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
								this.options[child.dataset.value] = false;
							}
						}
					}
					itemElement.classList.toggle("enabled");
					this.options[item.value] = itemElement.classList.contains("enabled");
					this.onchange();
				});

				itemsWrapper.appendChild(itemElement);
			} else {
				const itemElement = document.createElement("div");
				itemElement.classList.add("item");
				itemElement.dataset.value = item.value;

				const itemLabel = document.createElement("span");
				itemLabel.textContent = item.label;
				itemElement.appendChild(itemLabel);

				itemElement.appendChild(new Icon("caret-down"));

				itemElement.addEventListener("click", (e) => {
					new ContextMenu({
						items: item.options.map((option) => {
							return {
								label: option.label,
								value: option.value,
								icon: option.icon,
								color: option.color,
								enabled: this.options[item.value][option.value] || false,
							};
						}),
						multiple: item.multiple,
						onchange: (enabledItems) => {
							if (Object.keys(enabledItems).length > 0) {
								itemElement.classList.add("enabled");
							} else {
								itemElement.classList.remove("enabled");
							}
							this.options[item.value] = {};
							enabledItems.forEach((enabledItem) => {
								this.options[item.value][enabledItem] = true;
							});
							this.onchange();
						},
					}).present(e.clientX, e.clientY);
				});

				itemsWrapper.appendChild(itemElement);
			}
		});

		this.onchange = () => {
			// If any options are enabled, enable the reset button
			const anyEnabled = Object.values(this.options).some((value) => {
				if (typeof value === "object") {
					return Object.values(value).some((v) => v);
				}
				return value;
			});
			if (anyEnabled) {
				this.resetButton.classList.remove("disabled");
			} else {
				this.resetButton.classList.add("disabled");
			}
			this.parentList.filteredItems = onchange(this.parentList._items, this.options);
		};
	}

	reset() {
		for (const key in this.options) {
			if (typeof this.options[key] === "object") {
				for (const subKey in this.options[key]) {
					this.options[key][subKey] = false;
				}
			} else {
				this.options[key] = false;
			}
		}
		for (const itemElement of this.itemsWrapper.children) {
			itemElement.classList.remove("enabled");
		}
		this.onchange();
	}
}
