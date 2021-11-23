//REGULAR ONLOAD CODE

//If the user is running iOS 15, show the alternate web clip text
if (navigator.userAgent.indexOf("iPhone OS 15_0") != -1) {
    UIManager.hide(document.querySelector(".addWebClipScreen p.regularText"));
} else {
    UIManager.hide(document.querySelector(".addWebClipScreen p.iOS15Text"));
}

console.log("Begone, ugly performance-intensive animated gradient!");

//VERSION AND UPDATE HANDLING

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

var MOSTPCS = 0;
var MOSTPCSREF = null;
for (var c = 0; c < scriptureEngine.currentYearObject.books.Romans.chapters.length; c++) {
    var CURRENTCHAPTER = scriptureEngine.currentYearObject.books.Romans.chapters[c];
    for (var s = 0; s < CURRENTCHAPTER.sections.length; s++) {
        var CURRENTSECTION = CURRENTCHAPTER.sections[s];
        for (var v = 0; v < CURRENTSECTION.verses.length; v++) {
            var numberOfClarifications = scriptureEngine.getPronounClarificationsByReference("R " + (c + 1) + ":" + (v + 1)).length
            if (numberOfClarifications > MOSTPCS) {
                MOSTPCS = numberOfClarifications;
                MOSTPCSREF = "R " + (c + 1) + ":" + (v + 1);
            }
        }
    }
}