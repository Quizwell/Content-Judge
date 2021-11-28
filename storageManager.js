const CONTENT_JUDGE_VERSION = "1.0.0";
const CONTENT_JUDGE_BUILD = "CJ-RC0001";
const CONTENT_JUDGE_CHANGELOG = [
    {
        title: "Release Cantidate 1",
        items: [
            "App is feature-complete and needs only a few more bug fixes.",
            "Pronoun Clarifications are complete for all of Romans and James."
        ]
    }
];

var storageManager = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var storedValue = localStorage.getItem(key);
        if (storedValue === undefined || storedValue === "undefined") {
            return undefined;
        } else {
            return JSON.parse(localStorage.getItem(key));
        }
    },
    setDefault: function (key, value) {
        //This function will set a value only if that value hasn't been set before
        if (localStorage.getItem(key)) {
            return true;
        } else {
            storageManager.set(key, value);
        }
    }
}

//Set defaults for settings
with (storageManager) {
    setDefault("highlightPrejump", true);
    setDefault("highlightRareWords", true);
}

//Set defaults for settings screen settings
var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
for (var i = 0; i < settingsScreenToggles.length; i++) {
    var currentToggle = settingsScreenToggles[i];
    var currentToggleSettingName = currentToggle.dataset.settingName;
    storageManager.setDefault(currentToggleSettingName, currentToggle.classList.contains("checked"));
}

var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
for (var i = 0; i < settingsScreenColorPickers.length; i++) {
    var currentColorPicker = settingsScreenColorPickers[i];
    var currentColorPickerSettingName = currentColorPicker.dataset.settingName;
    storageManager.setDefault(currentColorPickerSettingName, currentColorPicker.value);
}