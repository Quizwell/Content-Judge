//REGULAR ONLOAD CODE

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

if (storageManager.get("lastUsedVersion") && storageManager.get("lastUsedBuild") != CONTENT_JUDGE_BUILD) {
	//This code runs if the current build of Content Judge is newer than the last used build
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);
storageManager.set("lastUsedBuild", CONTENT_JUDGE_BUILD);
