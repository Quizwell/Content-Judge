//REGULAR ONLOAD CODE

console.log("Begone, ugly performance-intensive animated gradient!");

//VERSION AND UPDATE HANDLING

if (storageManager.get("lastUsedVersion") && storageManager.get("lastUsedVersion") != CONTENT_JUDGE_VERSION) {
	//This code runs if the current version of Content Judge is newer than the last used version
	UIManager.showChangelog();
}

if (storageManager.get("lastUsedVersion") && storageManager.get("lastUsedBuild") != CONTENT_JUDGE_BUILD) {
	//This code runs if the current build of Content Judge is newer than the last used build
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);
storageManager.set("lastUsedBuild", CONTENT_JUDGE_BUILD);
