class Overlay {
	constructor({ dismissable = true, callback } = {}) {
		this.element = document.createElement("div");
		this.element.classList.add("overlay");
		this.element.classList.add("hidden");
		this.element.style.display = "none";
		if (dismissable && callback) {
			this.element.classList.add("dismissable");
			this.element.addEventListener(
				"click",
				function () {
					this.hide();
					callback();
				}.bind(this)
			);
		}
	}

	show() {
		this.element.style.display = "block";
		requestAnimationFrame(() => {
			this.element.classList.remove("hidden");
		});
	}

	hide() {
		this.element.classList.add("hidden");
		setTimeout(() => {
			this.element.style.display = "none";
		}, 200);
	}

	destroy() {
		if (this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
		this.element = null;
	}
}
