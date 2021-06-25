if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedVersion") != CONTENT_JUDGE_VERSION)
) {

    //This code runs if the current version of Content Judge is newer than the last used version

}

if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedBuild") != CONTENT_JUDGE_BUILD)
) {

    //This code runs if the current build of Content Judge is newer than the last used build

}

if (
    storageManager.get("lastUsedVersion") &&
    storageManager.get("lastUsedBuild") &&
    (storageManager.get("lastUsedVersion") == CONTENT_JUDGE_VERSION) &&
    (storageManager.get("lastUsedBuild") != CONTENT_JUDGE_BUILD)
) {
    
    //This code tuns only if the build has changed, but the version hasn't.
    
    UIManager.bannerNotificationManager.showMessage("Build Updated", CONTENT_JUDGE_BUILD, true);
    
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);
storageManager.set("lastUsedBuild", CONTENT_JUDGE_BUILD);

alert("PLEASE NOTE: Matthew database building is incomplete. Only chapters 1-12 are available, and all concordance information for Matthew is inaccurate.");