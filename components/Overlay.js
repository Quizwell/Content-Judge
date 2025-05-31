function Overlay({ dismissable = true, callback } = {}) {
	this.element = document.createElement("div");
	this.element.classList.add("overlay");
	this.element.classList.add("hidden");
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

	this.show = function () {
		this.element.classList.remove("hidden");
	};
	this.hide = function () {
		this.element.classList.add("hidden");
	};
}
