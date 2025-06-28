//REGULAR ONLOAD CODE

new ConcordanceListScreen().present();

//VERSION AND UPDATE HANDLING

if (storageManager.get("lastUsedVersion") && storageManager.get("lastUsedVersion") != CONTENT_JUDGE_VERSION) {
	//This code runs if the current version of Content Judge is newer than the last used version
	new BannerNotification({
		icon: "circle-check",
		title: "Version " + CONTENT_JUDGE_VERSION,
		message: "Tap to see what's new",
		duration: 10000,
		callback: UIManager.showChangelog,
	});
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);

window.addEventListener("error", function (e) {
	new BannerNotification({
		icon: "spaghetti-monster-flying",
		title: "Error",
		message: "Tap to send bug report",
		duration: 10000,
		callback: () => {
			var subject = "Flyswatter: Bug Report";
			var body = `Content Judge Version ${CONTENT_JUDGE_VERSION}%0D%0A%0D%0A${e.filename}:${e.lineno}%0D%0A${e.message}%0D%0A${e.error.stack}%0D%0A%0D%0APlease mention as much as possible about the problem you are experiencing below this line.`;

			var mailtoURL = "mailto:quizwell@icloud.com?subject=" + subject + "&body=" + body;

			window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);
		},
	});
});
