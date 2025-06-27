class NavigationLink {
	constructor({ title, subtitle, icon, style, color, disabled, callback } = {}) {
		const linkElement = document.createElement("div");
		linkElement.classList.add("navigationLink");
		if (disabled) {
			linkElement.setAttribute("disabled", true);
		}
		if (style) {
			linkElement.classList.add(style);
		} else if (color) {
			linkElement.style.setProperty("--link-color", color);
		}
		if (callback) {
			linkElement.classList.add("callback");
			linkElement.addEventListener("click", () => {
				callback();
			});
		}

		if (icon) {
			linkElement.appendChild(new Icon(icon));
		}

		const leadingWrapper = document.createElement("div");
		leadingWrapper.classList.add("leading");

		const titleElement = document.createElement("p");
		titleElement.classList.add("title");
		titleElement.textContent = title;
		leadingWrapper.appendChild(titleElement);

		if (subtitle) {
			const subtitleElement = document.createElement("p");
			subtitleElement.classList.add("subtitle");
			subtitleElement.textContent = subtitle;
			leadingWrapper.appendChild(subtitleElement);
		}

		linkElement.appendChild(leadingWrapper);
		linkElement.appendChild(new Icon("chevron-right"));

		return linkElement;
	}
}
