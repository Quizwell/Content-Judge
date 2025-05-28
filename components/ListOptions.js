function ListOptions(
	type,
	items,
	{
		multiple,
		evaluateItem = () => {
			return true;
		},
		sort,
		order,
	} = {}
) {
	const optionsElement = document.createElement("div");
	optionsElement.classList.add("options");
	optionsElement.classList.add(type);
	this.optionsElement = optionsElement;

	this.onchange = () => {};
	if (type === "sort") {
		this.sort = sort;
	}
	this.evaluateItem = evaluateItem;

	Object.defineProperty(this, "order", {
		get: function () {
			return order || "ascending"; // Default to ascending if not specified
		},
		set: function (newOrder) {
			order = newOrder;
			// Update the class of the icon container based on the new order
			iconContainer.classList.toggle("descending", newOrder === "descending");
			// If any of the item elements have an iconDescending property specified, update their icons accordingly
			itemsWrapper.querySelectorAll(".item").forEach((itemElement) => {
				const item = items.find((i) => i.value === itemElement.dataset.value);
				if (item && item.iconDescending) {
					itemElement.querySelector("svg").classList.toggle("fa-" + item.icon);
					itemElement.querySelector("svg").classList.toggle("fa-" + item.iconDescending);
				}
			});
			this.onchange();
		},
	});

	if (type === "filter") {
		optionsElement.appendChild(new Icon("filter"));
	} else if (type === "sort") {
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
	}

	const itemsWrapper = document.createElement("div");
	itemsWrapper.classList.add("itemsWrapper");
	optionsElement.appendChild(itemsWrapper);

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
			if (type === "filter") {
				if (multiple === false) {
					for (const child of itemsWrapper.children) {
						if (child !== itemElement) {
							child.classList.remove("enabled");
						}
					}
				}
				itemElement.classList.toggle("enabled");
			} else if (type === "sort") {
				for (const child of itemsWrapper.children) {
					child.classList.remove("enabled");
				}
				itemElement.classList.add("enabled");
			}
			this.onchange();
		});

		itemsWrapper.appendChild(itemElement);
	});

	Object.defineProperty(this, "options", {
		get: function () {
			if (type === "filter") {
				const options = {};
				for (const item of itemsWrapper.children) {
					options[item.dataset.value] = item.classList.contains("enabled");
				}
				options.order = this.order;
				return options;
			} else if (type === "sort") {
				const enabledItem = itemsWrapper.querySelector(".item.enabled");
				return enabledItem.dataset.value;
			}
		},
	});
}
