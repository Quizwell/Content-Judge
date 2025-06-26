const searchBar = {};

const UIReferences = {
	mainScreen: document.querySelector(".mainScreen"),

	homeScreen: document.querySelector(".homeScreen"),

	changelogScreen: document.querySelector(".changelogScreen"),
	changelogScreenVersion: document.querySelector(".changelogScreen .header .version"),
	changelogScreenChangesContainer: document.querySelector(".changelogScreen .changes"),

	settingsScreen: document.querySelector(".settingsScreen"),
};

const UIManager = {
	hide: function (element, transitionTime) {
		if (transitionTime) {
			element.classList.add("hidden");
			setTimeout(function () {
				element.style.display = "none";
			}, transitionTime);
		} else {
			element.classList.add("hidden");
		}
	},
	show: function (element, transitionTime) {
		if (transitionTime) {
			element.style.display = "";
			requestAnimationFrame(function () {
				element.classList.remove("hidden");
			});
		} else {
			element.classList.remove("hidden");
		}
	},

	buttonHandlers: {
		hideChangelogScreen: function () {
			UIManager.hide(UIReferences.changelogScreen, 200);
		},

		showSettingsScreen: function () {
			UIManager.settingsScreen.populateAndShowSettingsScreen();
		},
		closeSettingsScreen: function () {
			UIManager.settingsScreen.closeSettingsScreen();
		},
	},

	showChangelog: function () {
		UIReferences.changelogScreenVersion.textContent = "Version " + CONTENT_JUDGE_VERSION;
		while (UIReferences.changelogScreenChangesContainer.children[0]) {
			UIReferences.changelogScreenChangesContainer.removeChild(UIReferences.changelogScreenChangesContainer.children[0]);
		}
		for (var i = 0; i < CONTENT_JUDGE_CHANGELOG.length; i++) {
			var currentSection = CONTENT_JUDGE_CHANGELOG[i];
			if (currentSection.items.length > 0) {
				var titleElement = document.createElement("h3");
				titleElement.textContent = currentSection.title;
				UIReferences.changelogScreenChangesContainer.appendChild(titleElement);

				for (var c = 0; c < currentSection.items.length; c++) {
					var changeElement = document.createElement("div");
					changeElement.appendChild(new Icon(currentSection.items[c].icon));

					var textElement = document.createElement("p");
					textElement.textContent = currentSection.items[c].text;
					changeElement.appendChild(textElement);

					UIReferences.changelogScreenChangesContainer.appendChild(changeElement);
				}
			}
		}
		UIManager.show(UIReferences.changelogScreen, 200);
	},

	settingsScreen: {
		populateAndShowSettingsScreen: function () {
			//Update all checkboxes
			var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
			for (var i = 0; i < settingsScreenToggles.length; i++) {
				var currentToggle = settingsScreenToggles[i];
				var currentToggleSettingName = currentToggle.dataset.settingName;

				if (storageManager.get(currentToggleSettingName)) {
					currentToggle.classList.add("checked");
				} else {
					currentToggle.classList.remove("checked");
				}
			}

			//Update all color pickers
			var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
			for (var i = 0; i < settingsScreenColorPickers.length; i++) {
				var currentColorPicker = settingsScreenColorPickers[i];
				var currentColorPickerSettingName = currentColorPicker.dataset.settingName;

				currentColorPicker.value = storageManager.get(currentColorPickerSettingName);
			}

			//Show the screen
			UIManager.show(UIReferences.settingsScreen, 200);
		},

		closeSettingsScreen: function () {
			//Update all settings values
			var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
			for (var i = 0; i < settingsScreenToggles.length; i++) {
				var currentToggle = settingsScreenToggles[i];
				var currentToggleSettingName = currentToggle.dataset.settingName;

				storageManager.set(currentToggleSettingName, currentToggle.classList.contains("checked"));
			}

			//Update all color picker values
			var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
			for (var i = 0; i < settingsScreenColorPickers.length; i++) {
				var currentColorPicker = settingsScreenColorPickers[i];
				var currentColorPickerSettingName = currentColorPicker.dataset.settingName;

				storageManager.set(currentColorPickerSettingName, currentColorPicker.value);
			}

			//Run all settings update handlers
			var settingsUpdateHandlersKeys = Object.keys(UIManager.settingsScreen.settingUpdateHandlers);
			for (var i = 0; i < settingsUpdateHandlersKeys.length; i++) {
				UIManager.settingsScreen.settingUpdateHandlers[settingsUpdateHandlersKeys[i]]();
			}

			//Hide the screen
			UIManager.hide(UIReferences.settingsScreen, 200);
		},

		settingUpdateHandlers: {
			updateRareWordHighlightColors: function () {
				document.documentElement.style.setProperty("--unique-word-highlight-color", storageManager.get("uniqueWordHighlightColor"));
				document.documentElement.style.setProperty("--double-word-highlight-color", storageManager.get("doubleWordHighlightColor"));
				document.documentElement.style.setProperty("--triple-word-highlight-color", storageManager.get("tripleWordHighlightColor"));

				document.documentElement.style.setProperty("--unique-word-highlight-color-dark", storageManager.get("uniqueWordHighlightColorDark"));
				document.documentElement.style.setProperty("--double-word-highlight-color-dark", storageManager.get("doubleWordHighlightColorDark"));
				document.documentElement.style.setProperty("--triple-word-highlight-color-dark", storageManager.get("tripleWordHighlightColorDark"));
			},

			updateAppAccentColor: function () {
				function getContrastingColor(hexColor) {
					//If a leading # is provided, remove it
					if (hexColor.slice(0, 1) === "#") {
						hexColor = hexColor.slice(1);
					}

					//If a three-character hexcode is provided, make it six-character
					if (hexColor.length === 3) {
						hexColor = hexColor
							.split("")
							.map(function (hex) {
								return hex + hex;
							})
							.join("");
					}

					var r = parseInt(hexColor.substr(0, 2), 16);
					var g = parseInt(hexColor.substr(2, 2), 16);
					var b = parseInt(hexColor.substr(4, 2), 16);
					var yiq = (r * 299 + g * 587 + b * 114) / 1000;
					return yiq >= 130 ? "#000000" : "#ffffff";
				}

				document.documentElement.style.setProperty("--app-accent-color", storageManager.get("appAccentColor"));
				document.documentElement.style.setProperty("--app-accent-color-dark", storageManager.get("appAccentColorDark"));

				var lightModeTextColor = getContrastingColor(storageManager.get("appAccentColor"));
				var darkModeTextColor = getContrastingColor(storageManager.get("appAccentColorDark"));
				document.documentElement.style.setProperty("--accent-color-text-color", lightModeTextColor);
				document.documentElement.style.setProperty("--accent-color-text-color-dark", darkModeTextColor);

				document.documentElement.classList.remove("lightModeLightAccentColor");
				document.documentElement.classList.remove("lightModeDarkAccentColor");
				document.documentElement.classList.remove("darkModeLightAccentColor");
				document.documentElement.classList.remove("darkModeDarkAccentColor");
				document.documentElement.classList.add(lightModeTextColor === "#000000" ? "lightModeLightAccentColor" : "lightModeDarkAccentColor");
				document.documentElement.classList.add(darkModeTextColor === "#000000" ? "darkModeLightAccentColor" : "darkModeDarkAccentColor");
			},
		},

		resetButtonHandlers: {
			resetAppAccentColor: function () {
				var computedStyle = getComputedStyle(document.body);

				storageManager.set("appAccentColor", computedStyle.getPropertyValue("--default-app-accent-color").trim());
				storageManager.set("appAccentColorDark", computedStyle.getPropertyValue("--default-app-accent-color-dark").trim());

				UIManager.settingsScreen.settingUpdateHandlers.updateAppAccentColor();
				UIManager.settingsScreen.populateAndShowSettingsScreen();
			},

			resetRareWordHighlightColors: function () {
				var computedStyle = getComputedStyle(document.body);

				storageManager.set("uniqueWordHighlightColor", computedStyle.getPropertyValue("--orange-color").trim());
				storageManager.set("doubleWordHighlightColor", computedStyle.getPropertyValue("--blue-color").trim());
				storageManager.set("tripleWordHighlightColor", computedStyle.getPropertyValue("--purple-color").trim());

				storageManager.set("uniqueWordHighlightColorDark", computedStyle.getPropertyValue("--orange-color-dark").trim());
				storageManager.set("doubleWordHighlightColorDark", computedStyle.getPropertyValue("--blue-color-dark").trim());
				storageManager.set("tripleWordHighlightColorDark", computedStyle.getPropertyValue("--purple-color-dark").trim());

				UIManager.settingsScreen.settingUpdateHandlers.updateRareWordHighlightColors();
				UIManager.settingsScreen.populateAndShowSettingsScreen();
			},
		},
	},
};

//Set up events for all checkboxes
var checkboxes = document.querySelectorAll(".checkbox");
for (var i = 0; i < checkboxes.length; i++) {
	var currentCheckbox = checkboxes[i];

	(function (checkbox) {
		checkbox.addEventListener("click", function () {
			checkbox.classList.toggle("checked");
		});
	})(currentCheckbox);
}

//Update colors
UIManager.settingsScreen.settingUpdateHandlers.updateAppAccentColor();
UIManager.settingsScreen.settingUpdateHandlers.updateRareWordHighlightColors();

// When the window is being resized, don't let elements transition.
var resizeTimer;
window.addEventListener("resize", () => {
	document.body.classList.add("no-transition");
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function () {
		document.body.classList.remove("no-transition");
	}, 200);
});

//Listen for Option key updates
var optionKeyDown = false;

document.body.onkeydown = function (e) {
	if (e.which === 18) {
		optionKeyDown = true;
	}
};

document.body.onkeyup = function (e) {
	if (e.which === 18) {
		optionKeyDown = false;
	}
};

function checkOptionKey() {
	if (document.webkitHidden) return;
	window.addEventListener(
		"mousemove",
		function onMove(e) {
			optionKeyDown = e.altKey;
			window.removeEventListener("mousemove", onMove, false);
		},
		false
	);
}

document.addEventListener("webkitvisibilitychange", checkOptionKey, false);
window.addEventListener("load", checkOptionKey, false);

//Perform UI setup

document.querySelector(".settingsScreen .about .version").textContent = "Version " + CONTENT_JUDGE_VERSION;

const searchByReference = new ReferenceSelector({ anchored: true });
document.querySelector(".searchByReference").appendChild(searchByReference.anchorElement);
