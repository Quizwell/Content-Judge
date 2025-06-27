class Screen {
	constructor(title) {
		this.element = document.createElement("div");
		this.element.classList.add("screen");
		this.element.classList.add("hidden");
		this.element.style.display = "none";

		const header = document.createElement("div");
		header.classList.add("header");
		header.addEventListener("click", this.dismiss.bind(this));

		header.appendChild(new Icon("chevron-left"));

		this.titleElement = document.createElement("h1");
		this.titleElement.classList.add("title");
		this.titleElement.textContent = title;
		header.appendChild(this.titleElement);

		this.element.appendChild(header);

		this.contentElement = document.createElement("div");
		this.contentElement.classList.add("content");
		this.element.appendChild(this.contentElement);

		document.body.appendChild(this.element);
	}

	get title() {
		return this.element.querySelector(".title").textContent;
	}

	set title(value) {
		this.element.querySelector(".title").textContent = value;
	}

	present() {
		this.element.style.display = "block";
		requestAnimationFrame(() => {
			this.element.classList.remove("hidden");
		});
	}

	dismiss() {
		this.element.classList.add("hidden");
		setTimeout(() => {
			this.element.remove();
			this.element = null;
			this.contentElement = null;
			this.titleElement = null;
		}, 200);
	}
}
