class ListItem {
	constructor({ title, leading, trailing, value, color, callback } = {}) {
		const itemElement = document.createElement("div");
		itemElement.classList.add("item");
		if (color) {
			itemElement.style.setProperty("--item-color", color);
		}
		if (callback) {
			itemElement.classList.add("callback");
			itemElement.addEventListener("click", () => {
				callback();
			});
		}
		this.itemElement = itemElement;

		if (value) {
			itemElement.dataset.value = value;
			this.value = value;
		}

		if (leading?.icon) {
			itemElement.appendChild(new Icon(leading.icon));
		}

		const leadingWrapper = document.createElement("div");
		leadingWrapper.classList.add("leading");

		const titleElement = document.createElement("p");
		titleElement.classList.add("title");
		titleElement.textContent = leading ? leading.title : title;
		leadingWrapper.appendChild(titleElement);

		if (leading && leading.subtitle) {
			const subtitleElement = document.createElement("p");
			subtitleElement.classList.add("subtitle");
			subtitleElement.textContent = leading.subtitle;
			leadingWrapper.appendChild(subtitleElement);
		}

		itemElement.appendChild(leadingWrapper);

		if (trailing?.text) {
			const trailingWrapper = document.createElement("div");
			trailingWrapper.classList.add("trailing");

			const trailingElement = document.createElement("p");
			trailingElement.textContent = trailing.text;
			trailingWrapper.appendChild(trailingElement);

			itemElement.appendChild(trailingWrapper);
		}

		if (trailing?.icon) {
			itemElement.appendChild(new Icon(trailing.icon));
		}
	}
}
