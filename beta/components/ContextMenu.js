class ContextMenu {
	constructor({ items, multiple = false, onchange } = {}) {
		this.items = items;
		this.onchange = function () {
			var enabledItems = [];
			for (var itemElement of this.menuElement.children) {
				if (itemElement.classList.contains("enabled")) {
					enabledItems.push(itemElement.dataset.value);
				}
			}
			onchange(enabledItems);
		};

		this.menuElement = document.createElement("div");
		this.menuElement.classList.add("contextMenu");
		this.menuElement.classList.add("hidden");

		this.items.forEach((item) => {
			const itemElement = document.createElement("div");
			itemElement.classList.add("item");
			itemElement.dataset.value = item.value;
			if (item.enabled) {
				itemElement.classList.add("enabled");
			}
			if (item.color) {
				itemElement.style.setProperty("--item-color", item.color);
			}
			if (item.icon) {
				itemElement.appendChild(new Icon(item.icon));
			}
			const itemLabel = document.createElement("span");
			itemLabel.textContent = item.label;
			itemElement.appendChild(itemLabel);

			itemElement.addEventListener("click", () => {
				if (multiple === false) {
					for (const child of this.menuElement.children) {
						if (child !== itemElement) {
							child.classList.remove("enabled");
						}
					}
				}
				itemElement.classList.toggle("enabled");
				this.onchange();
				this.dismiss();
			});

			this.menuElement.appendChild(itemElement);
		});

		document.body.appendChild(this.menuElement);
	}

	present(x, y) {
		this.menuElement.style.left = `${x}px`;
		this.menuElement.style.top = `${y}px`;
		requestAnimationFrame(() => {
			this.menuElement.classList.remove("hidden");
			document.addEventListener("click", this.dismiss.bind(this), { once: true });
		});
	}

	dismiss(e) {
		if (e && e.target.closest(".contextMenu")) {
			document.addEventListener("click", this.dismiss.bind(this), { once: true });
			return;
		}
		if (this.menuElement) {
			this.menuElement.classList.add("hidden");
			setTimeout(() => {
				this.menuElement.remove();
				this.menuElement = null;
			}, 200);
		}
	}
}
