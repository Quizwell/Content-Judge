const CONTENT_JUDGE_VERSION = "1.3.0";
const CONTENT_JUDGE_BUILD = "CJ-R0022";
const CONTENT_JUDGE_CHANGELOG = [
	{
		title: "Version 1.3.0",
		items: [
			"Added Luke content and enhanced support for single-book years.",
			"Added support for cross-section verses.",
			"Verses are now alphabetized when the Prejump filter is enabled.",
			"Fixed UI issues with long chapters.",
		],
	},
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
	},
};

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
