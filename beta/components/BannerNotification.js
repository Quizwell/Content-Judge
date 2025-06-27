const bannerNotificationQueue = [];

class BannerNotification {
	constructor({
		icon,
		title,
		message,
		priority = false,
		dismissable = true,
		callback = null,
		duration = 5000, //5 sec
	} = {}) {
		var notificationElement = document.createElement("div");
		notificationElement.classList.add("bannerNotification");
		if (callback) {
			notificationElement.addEventListener(
				"click",
				function () {
					callback();
					this.dismiss();
				}.bind(this)
			);
		} else if (dismissable) {
			notificationElement.addEventListener(
				"click",
				function () {
					this.dismiss();
				}.bind(this)
			);
		}
		this.notificationElement = notificationElement;

		var iconElement = document.createElement("div");
		iconElement.classList.add("icon");
		iconElement.appendChild(Icon(icon));
		notificationElement.appendChild(iconElement);

		var contentElement = document.createElement("div");
		contentElement.classList.add("content");

		var titleElement = document.createElement("h2");
		titleElement.classList.add("title");
		titleElement.textContent = title;
		contentElement.appendChild(titleElement);

		var messageElement = document.createElement("p");
		messageElement.classList.add("message");
		messageElement.textContent = message;
		contentElement.appendChild(messageElement);

		notificationElement.appendChild(contentElement);

		notificationElement.classList.add("hidden");
		document.body.appendChild(notificationElement);

		this.notificationElement = notificationElement;

		if (priority) {
			if (bannerNotificationQueue[0]) {
				bannerNotificationQueue[0].interrupt();
			}
			bannerNotificationQueue.unshift(this);
		} else {
			bannerNotificationQueue.push(this);
		}

		if (bannerNotificationQueue.length === 1 || priority) {
			this.present();
		}
	}

	present() {
		requestAnimationFrame(() => {
			this.otificationElement.classList.remove("hidden");
		});
		if (duration > 0) {
			this.timeout = setTimeout(() => {
				this.dismiss();
			}, duration);
		}
	}

	interrupt() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.notificationElement.classList.add("hidden");
	}

	dismiss() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}

		this.notificationElement.addEventListener("transitionend", () => {
			this.notificationElement.remove();
			this.notificationElement = null;
		});
		this.notificationElement.classList.add("hidden");

		if (bannerNotificationQueue[0] === this) {
			bannerNotificationQueue.shift();
		}
		if (bannerNotificationQueue[0]) {
			bannerNotificationQueue[0].present();
		}
	}
}
