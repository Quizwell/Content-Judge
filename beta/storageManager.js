const CONTENT_JUDGE_VERSION = "2.0 Beta 4";
const CONTENT_JUDGE_CHANGELOG = [
	{
		title: "New Features",
		items: [
			{
				icon: "magnifying-glass",
				text: "Search by content from the new home screen.",
			},
			{
				icon: "highlighter",
				text: "Tap and drag across multiple words in a verse to see all other uses of that phrase in the material.",
			},
		],
	},
	{
		title: "Bug Fixes",
		items: [
			{
				icon: "image",
				text: "Fixed broken changelog image and removed unused icons.",
			},
		],
	},
	{
		title: "Known Issues",
		items: [
			{
				icon: "bug",
				text: "Search by Content is missing filter options.",
			},
			{
				icon: "spider",
				text: "Concordance entries in the verse viewer cannot be filtered and may take up too much UI space displaying each verse.",
			},
			{
				icon: "bugs",
				text: "Pronoun Clarifications and Footnotes buttons do not yet work in the verse viewer. To view footnotes, tap a footnote letter in the scripture.",
			},
			{
				icon: "mosquito",
				text: "Lists are not yet available.",
			},
		],
	},
	{
		title: "Feedback",
		items: [
			{
				icon: "bug-slash",
				text: "If you run into any unexpected issues or content errors, let us know using the new error notifications or the Report a Problem button.",
			},
		],
	},
];
/* const CONTENT_JUDGE_CHANGELOG = [
	{
		title: "Redesigned Interface",
		items: [
			{
				icon: "wand-magic-sparkles",
				text: "Refreshed look with more vibrant colors, more legible typography, and smoother animations.",
			},
			{
				icon: "bars-staggered",
				text: "Redesigned verse viewer with less obtrusive buttons and scrollable access to all verses in the chapter.",
			},
		],
	},
	{
		title: "New Features",
		items: [
            {
                icon: "highlighter",
                text: "Multiword selection in the verse viewer displays all other uses of the same phrase in the material.",
            },
			{
				icon: "list-ol",
				text: "New concordance browser with filters for unique, double, and triple words.",
			},
			{
				icon: "user-group",
				text: "New Names, Groups, and Places list with category filters and Alphabetical and Verse Order sorting.",
			},
			{
				icon: "hashtag",
				text: "New Numbers list with Alphabetical and Numerical sorting.",
			},
			{
				icon: "book-bible",
				text: "New Old/New Testament References list with Verse Order and Source Order sorting.",
			},
			{
				icon: "star",
				text: "New Memory verses list with Single and Multiple filters and Verse Order and Alphabetical by Prejump sorting.",
			},
		],
	},
	{
		title: "Technical Improvements",
		items: [
			{
				icon: "bolt",
				text: "Rebuilt object-oriented Scripture Engine for more efficient performance.",
			},
			{
				icon: "window-restore",
				text: "New component-based UI system designed for better maintainability and scalability.",
			},
		],
	},
	{
		title: "Issues",
		items: [
			{
				icon: "bug-slash",
				text: "If you find any unexpected issues or content errors, let us know using the Report a Problem button.",
			},
		],
	},
]; */

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
