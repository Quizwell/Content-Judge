//REGULAR ONLOAD CODE

console.log("Begone, ugly performance-intensive animated gradient!");

//VERSION AND UPDATE HANDLING

if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedVersion") != CONTENT_JUDGE_VERSION)
) {
    //This code runs if the current version of Content Judge is newer than the last used version
    UIReferences.changelogScreenVersion.textContent = "Version " + CONTENT_JUDGE_VERSION;
    for (var i = 0; i < CONTENT_JUDGE_CHANGELOG.length; i++) {
        var currentSection = CONTENT_JUDGE_CHANGELOG[i];
        if (currentSection.items.length > 0) {
            var titleElement = document.createElement("h3");
            titleElement.textContent = currentSection.title;
            UIReferences.changelogScreenChangesContainer.appendChild(titleElement);

            for (var c = 0; c < currentSection.items.length; c++) {
                var changeElement = document.createElement("p");
                changeElement.textContent = currentSection.items[c];
                UIReferences.changelogScreenChangesContainer.appendChild(changeElement);
            }
        }
    }
    UIManager.show(UIReferences.changelogScreen, 200);
}

if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedBuild") != CONTENT_JUDGE_BUILD)
) {
    //This code runs if the current build of Content Judge is newer than the last used build
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);
storageManager.set("lastUsedBuild", CONTENT_JUDGE_BUILD);