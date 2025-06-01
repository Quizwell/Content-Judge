const searchBar = {};

const UIReferences = {
	mainScreen: document.querySelector(".mainScreen"),

	homeScreen: document.querySelector(".homeScreen"),

	changelogScreen: document.querySelector(".changelogScreen"),
	changelogScreenVersion: document.querySelector(".changelogScreen .header .version"),
	changelogScreenChangesContainer: document.querySelector(".changelogScreen .changes"),

	addWebClipScreen: document.querySelector(".addWebClipScreen"),
	flyswatterScreen: document.querySelector(".flyswatterScreen"),
	settingsScreen: document.querySelector(".settingsScreen"),

	searchModeSelectionScreen: document.querySelector(".searchModeSelectionScreen"),
	quizCycleYearSelector: document.querySelector(".searchModeSelectionScreen select"),
	searchByReferenceContainer: document.querySelector(".searchByReferenceContainer"),
	bookSelectionContainer: document.querySelector(".bookSelectionContainer"),
	bookSelectionElementContainer: document.querySelector(".bookSelectionContainer .selectionElementContainer"),
	chapterSelectionContainer: document.querySelector(".chapterSelectionContainer"),
	chapterSelectionContainerLabel: document.querySelector(".chapterSelectionContainer .label"),
	chapterSelectionElementContainer: document.querySelector(".chapterSelectionContainer .selectionElementContainer"),
	verseSelectionContainer: document.querySelector(".verseSelectionContainer"),
	verseSelectionContainerLabel: document.querySelector(".verseSelectionContainer .label"),
	verseSelectionElementContainer: document.querySelector(".verseSelectionContainer .selectionElementContainer"),

	searchBarFilterMode: document.querySelector(".filterMode"),
	searchBarContainer: document.querySelector(".searchBarContainer"),
	searchBar: document.querySelector(".searchModeSelectionScreen .searchBar"),
	searchBarClearButton: document.querySelector(".searchBarWrapper .clearButton"),
	searchResultsContainer: document.querySelector(".searchModeSelectionScreen .searchResultsContainer"),

	chapterDisplayScreen: document.querySelector(".chapterDisplayScreen"),
	chapterDisplayScreenTitle: document.querySelector(".chapterDisplayScreen .titleContainer .title"),
	chapterDisplayScreenSubtitle: document.querySelector(".chapterDisplayScreen .titleContainer .subtitle"),
	chapterDisplayScreenContent: document.querySelector(".chapterDisplayScreen .content"),

	verseDisplayScreen: document.querySelector(".verseDisplayScreen"),

	verseDisplayScreenHeaderContainer: document.querySelector(".verseDisplayScreen .headerContainer"),

	verseDisplayScreenCloseButton: document.querySelector(".verseDisplayScreen .closeButton"),
	verseDisplayScreenBackButton: document.querySelector(".verseDisplayScreen .backButton"),

	verseDisplayScreenTitle: document.querySelector(".verseDisplayScreen .verseTitleContainer .title"),
	verseDisplayScreenSubtitle: document.querySelector(".verseDisplayScreen .verseTitleContainer .subtitle"),
	verseDisplayScreenSubtitleTag: document.querySelector(".verseDisplayScreen .verseTitleContainer .subtitle .tag"),
	verseDisplayScreenSubtitleText: document.querySelector(".verseDisplayScreen .verseTitleContainer .subtitle .text"),

	verseDisplayScreenPreviousVerseButton: document.querySelector(".verseDisplayScreen .previousVerseButton"),
	verseDisplayScreenNextVerseButton: document.querySelector(".verseDisplayScreen .nextVerseButton"),

	verseDisplay: document.querySelector(".verseDisplay"),
	verseDisplayTextContainer: document.querySelector(".verseDisplay .textContainer"),

	slidePanel: document.querySelector(".slidePanel"),

	slidePanelSingleWordInformation: document.querySelector(".slidePanel .singleWordInformation"),
	singleWordInformationTitle: document.querySelector(".slidePanel .singleWordInformation .title"),
	singleWordInformationPronounClarification: document.querySelector(".slidePanel .singleWordInformation .pronounClarification"),
	singleWordInformationAntecedent: document.querySelector(".slidePanel .singleWordInformation .pronounClarification .antecedent"),
	singleWordInformationSubtitle: document.querySelector(".slidePanel .singleWordInformation .subtitle"),
	singleWordInformationContent: document.querySelector(".slidePanel .singleWordInformation .content"),

	slidePanelPossibleQuestions: document.querySelector(".slidePanel .possibleQuestions"),
	possibleQuestionsTitle: document.querySelector(".slidePanel .possibleQuestions .title"),
	possibleQuestionsSubtitle: document.querySelector(".slidePanel .possibleQuestions .subtitle"),
	possibleQuestionsContent: document.querySelector(".slidePanel .possibleQuestions .content"),

	slidePanelPronounClarification: document.querySelector(".slidePanel .pronounClarification.slidePanelScreen"),
	pronounClarificationTitle: document.querySelector(".slidePanel .pronounClarification .title"),
	pronounClarificationContent: document.querySelector(".slidePanel .pronounClarification .content"),

	slidePanelFootnotes: document.querySelector(".slidePanel .footnotes"),
	footnotesTitle: document.querySelector(".slidePanel .footnotes .title"),
	footnotesContent: document.querySelector(".slidePanel .footnotes .content"),

	leftToolbar: document.querySelector(".verseDisplayScreen .toolbar.left"),
	rightToolbar: document.querySelector(".verseDisplayScreen .toolbar.right"),

	highlightPrejumpButton: document.querySelector(".verseDisplayScreen .toolbarContainer .highlightPrejumpButton"),
	highlightRareWordsButton: document.querySelector(".verseDisplayScreen .toolbarContainer .highlightRareWordsButton"),

	possibleQuestionsButton: document.querySelector(".verseDisplayScreen .toolbarContainer .possibleQuestionsButton"),
	pronounClarificationButton: document.querySelector(".verseDisplayScreen .toolbarContainer .pronounClarificationButton"),
	footnotesButton: document.querySelector(".verseDisplayScreen .toolbarContainer .footnotesButton"),
};

const UIManager = {
	hide: function (element, transitionTime) {
		if (transitionTime) {
			element.classList.add("hidden");
		} else if (transitionTime === null) {
			element.style.transition = "none";
			requestAnimationFrame(function () {
				element.classList.add("hidden");
				requestAnimationFrame(function () {
					element.style.removeProperty("transition");
				});
			});
		} else {
			element.classList.add("hidden");
		}
	},
	show: function (element, transitionTime) {
		if (transitionTime) {
			//If the element was hidden before, we'll need to make sure that requireDisplayNone is removed in order to show the animation.
			element.classList.remove("hidden");
		} else if (transitionTime === null) {
			element.style.transition = "none";
			requestAnimationFrame(function () {
				element.classList.add("hidden");
				requestAnimationFrame(function () {
					element.style.removeProperty("transition");
				});
			});
		} else {
			element.classList.remove("hidden");
		}
	},

	buttonHandlers: {
		hidehomeScreen: function () {
			//If the browser is running on iPhone or iPad and is not mobile Chrome, and if the page is not running as a Web Clip already, show the Web Clip prompt screen to encourage the user to add it to his home screen.
			if (window.navigator.userAgent.match(/iP(ad|hone)/i) && !window.navigator.userAgent.match(/CriOS/i) && !window.navigator.standalone) {
				UIManager.show(UIReferences.addWebClipScreen, 200);
			} else {
				UIManager.show(UIReferences.searchModeSelectionScreen, 200);
			}
		},

		hideChangelogScreen: function () {
			UIManager.hide(UIReferences.changelogScreen, 200);
		},

		hideAddWebClipScreen: function () {
			UIManager.show(UIReferences.searchModeSelectionScreen, 200);
			UIManager.hide(UIReferences.addWebClipScreen, 200);
		},

		showFlyswatterScreen: function () {
			UIManager.flyswatterScreen.showFlyswatterScreen();
		},
		closeFlyswatterScreen: function () {
			UIManager.flyswatterScreen.closeFlyswatterScreen();
		},

		showSettingsScreen: function () {
			UIManager.settingsScreen.populateAndShowSettingsScreen();
		},
		closeSettingsScreen: function () {
			UIManager.settingsScreen.closeSettingsScreen();
		},

		closeSearchModeSelectionScreen: function () {
			UIManager.hide(UIReferences.searchModeSelectionScreen, 200);
			setTimeout(function () {
				UIManager.searchBarHandlers.clearSearchBar();
				UIManager.buttonHandlers.closeVerseSelectionContainer();
				if (Object.keys(scriptureEngine.currentYearObject.books).length > 1) {
					UIManager.buttonHandlers.closeChapterSelectionContainer();
				}
			}, 200);
		},

		closeChapterSelectionContainer: function () {
			UIManager.hide(UIReferences.chapterSelectionContainer, 200);
		},
		closeVerseSelectionContainer: function () {
			UIManager.hide(UIReferences.verseSelectionContainer, 200);
		},

		viewChapterButton: function () {
			var referenceString = UIManager.searchByReference.currentSearchObject.bookAbbreviation + " " + UIManager.searchByReference.currentSearchObject.chapter;
			UIManager.chapterDisplayScreen.populateAndShowChapterDisplayScreen(referenceString);
		},
		closeChapterDisplayScreen: function () {
			UIManager.chapterDisplayScreen.closeChapterDisplayScreen();
		},

		verseDisplayScreenCloseButton: function () {
			UIManager.verseDisplayScreen.closeVerseDisplayScreen();
		},
		verseDisplayScreenBackButton: function () {
			if (!UIReferences.verseDisplayScreenBackButton.getAttribute("disabled")) {
				UIManager.verseDisplayScreen.navigation.toPreviousState();
			}
		},

		closeSlidePanel: function () {
			UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();
			UIManager.verseDisplayScreen.deselectAllWords();
			UIManager.verseDisplayScreen.hideSlidePanel();
		},

		highlightPrejumpButton: function () {
			var button = UIReferences.highlightPrejumpButton;
			button.classList.toggle("active");
			UIReferences.verseDisplay.classList.toggle("highlightPrejump");

			//Update stored preference
			storageManager.set("highlightPrejump", !storageManager.get("highlightPrejump"));
		},
		highlightRareWordsButton: function () {
			var button = UIReferences.highlightRareWordsButton;
			button.classList.toggle("active");
			UIReferences.verseDisplay.classList.toggle("highlightRareWords");

			//Update stored preference
			storageManager.set("highlightRareWords", !storageManager.get("highlightRareWords"));
		},

		possibleQuestionsButton: function () {
			var button = UIReferences.possibleQuestionsButton;
			var wasActive = button.classList.contains("active");

			UIManager.verseDisplayScreen.deselectAllWords();
			UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();

			if (wasActive) {
				UIManager.verseDisplayScreen.hideSlidePanel();
			} else {
				UIManager.verseDisplayScreen.showSlidePanel("possibleQuestions");
				button.classList.add("active");
			}
		},
		pronounClarificationButton: function () {
			var button = UIReferences.pronounClarificationButton;
			var wasActive = button.classList.contains("active");

			UIManager.verseDisplayScreen.deselectAllWords();
			UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();

			if (wasActive) {
				UIManager.verseDisplayScreen.hideSlidePanel();
			} else {
				UIManager.verseDisplayScreen.showSlidePanel("pronounClarification");
				button.classList.add("active");
			}
		},
		footnotesButton: function () {
			var button = UIReferences.footnotesButton;
			var wasActive = button.classList.contains("active");

			UIManager.verseDisplayScreen.deselectAllWords();
			UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();

			if (wasActive) {
				UIManager.verseDisplayScreen.hideSlidePanel();
			} else {
				UIManager.verseDisplayScreen.showSlidePanel("footnotes");
				button.classList.add("active");
			}
		},
	},

	searchBarHandlers: {
		resultsTimer: null,

		changeFilterMode: function (e) {
			UIReferences.searchBar.focus();
			e.stopPropagation();
			e.preventDefault();
			switch (UIReferences.searchBarFilterMode.textContent) {
				case "All":
					UIReferences.searchBarFilterMode.textContent = "Starts With";
					break;
				case "Starts With":
					UIReferences.searchBarFilterMode.textContent = "Memory";
					UIReferences.searchBarFilterMode.classList.add("memory");
					break;
				case "Memory":
					UIReferences.searchBarFilterMode.textContent = "Prejump";
					break;
				case "Prejump":
					UIReferences.searchBarFilterMode.textContent = "All";
					UIReferences.searchBarFilterMode.classList.remove("memory");
					break;
			}
			UIManager.searchBarHandlers.onchange();
		},

		onfocus: function () {
			UIManager.show(UIReferences.searchBarClearButton, 200);
			UIReferences.searchModeSelectionScreen.classList.add("searchBarActive");
			UIReferences.searchBarFilterMode.classList.remove("hidden");
		},

		onblur: function () {
			if (UIReferences.searchBar.value == "" && UIReferences.searchBarFilterMode.textContent == "All") {
				UIManager.hide(UIReferences.searchBarClearButton, 200);
				UIReferences.searchModeSelectionScreen.classList.remove("searchBarActive");

				UIReferences.searchBarFilterMode.classList.add("hidden");
				UIReferences.searchBarFilterMode.textContent = "All";
				UIReferences.searchBarFilterMode.classList.remove("memory");
			}
		},

		oninput: function () {
			if (storageManager.get("useInstantSearch")) {
				UIManager.searchBarHandlers.onchange();
			} else {
				//After each keystroke, restart the timer.
				if (UIManager.searchBarHandlers.resultsTimer) {
					window.clearTimeout(UIManager.searchBarHandlers.resultsTimer);
				}

				UIManager.searchBarHandlers.resultsTimer = window.setTimeout(function () {
					UIManager.searchBarHandlers.resultsTimer = null;
					UIManager.searchBarHandlers.onchange();
				}, 500);
			}
		},

		onchange: function () {
			document.querySelector(".searchBarContainer .label").textContent = "Search by Content";

			var input = UIReferences.searchBar.value;

			//Remove all current search results
			while (UIReferences.searchResultsContainer.firstChild) {
				UIReferences.searchResultsContainer.removeChild(UIReferences.searchResultsContainer.firstChild);
			}

			if (input == "" && !UIReferences.searchBarFilterMode.classList.contains("memory")) {
				return;
			}

			var footnoteSearchResults = [];
			if (!UIReferences.searchBarFilterMode.classList.contains("memory")) {
				footnoteSearchResults = scriptureEngine.getFootnotesByContent(input, storageManager.get("useAdvancedSearch"));
			}
			var contentSearchResults = scriptureEngine.getVersesByContent(input, storageManager.get("useAdvancedSearch"), input == "" && UIReferences.searchBarFilterMode.classList.contains("memory"));

			contentSearchResults = footnoteSearchResults.concat(contentSearchResults);

			if (contentSearchResults.length > 0) {
				//If memory filter modes are enabled, filter out non-memory verses
				if (UIReferences.searchBarFilterMode.classList.contains("memory")) {
					contentSearchResults = contentSearchResults.filter(function (verse) {
						return verse.memoryVerseStatus.isMemory;
					});
				}

				//If Starts With or Prejump filter modes are enabled, filter out non-starting verses
				if (UIReferences.searchBarFilterMode.textContent == "Starts With" || UIReferences.searchBarFilterMode.textContent == "Prejump") {
					contentSearchResults = contentSearchResults.filter(function (result) {
						if (result.footnote) {
							return scriptureEngine.filterVerse(result.footnote.text, true, false).startsWith(scriptureEngine.filterVerse(input, true, false));
						} else {
							return scriptureEngine.filterVerse(new Verse(result.reference).verseContent, true, false).startsWith(scriptureEngine.filterVerse(input, true, false));
						}
					});
				}

				//For prejump filter, make sure the verse matched is at the start of the memory passage
				if (UIReferences.searchBarFilterMode.textContent == "Prejump") {
					contentSearchResults = contentSearchResults.filter((verse) => verse.memoryVerseStatus.startVerse === verse.reference);
				}

				//If either memory filter mode is enabled, make sure that multi-verse memory passages are listed as single results
				if (UIReferences.searchBarFilterMode.classList.contains("memory")) {
					for (var i = 0; i < contentSearchResults.length; i++) {
						var verseObject = new Verse(contentSearchResults[i].reference);
						//If this verse isn't the start of the memory passage, replace it with the starting verse
						if (verseObject.memoryVerseStatus.startVerse !== verseObject.reference) {
							contentSearchResults[i] = new Verse(verseObject.memoryVerseStatus.startVerse);
						} else {
							contentSearchResults[i] = verseObject;
						}
					}
					// Remove duplicates
					for (var i = 0; i < contentSearchResults.length; i++) {
						for (var j = i + 1; j < contentSearchResults.length; j++) {
							if (contentSearchResults[i].reference == contentSearchResults[j].reference) {
								contentSearchResults.splice(j, 1);
								j--;
							}
						}
					}
				}

				//If the prejump filter is enabled, sort the results alphabetically
				if (UIReferences.searchBarFilterMode.textContent == "Prejump") {
					contentSearchResults.sort(function (a, b) {
						return scriptureEngine.filterVerse(a.verseContent, true, false).localeCompare(scriptureEngine.filterVerse(b.verseContent, true, false));
					});
				}

				document.querySelector(".searchBarContainer .label").textContent = contentSearchResults.length + " results";

				//Loop through every search result and create an element for each
				for (var i = 0; i < contentSearchResults.length; i++) {
					var currentSearchResult = contentSearchResults[i];

					var listItemElement = document.createElement("div");
					listItemElement.classList.add("listItem");
					if (currentSearchResult?.memoryVerseStatus?.isMemory) {
						listItemElement.classList.add("memory");
					}
					//If either memory filter is enabled, make sure that each result goes to the first verse of the memory passage.
					if (UIReferences.searchBarFilterMode.classList.contains("memory")) {
						(function (reference) {
							listItemElement.onclick = function () {
								UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(reference);
							};
						})(currentSearchResult.memoryVerseStatus.startVerse);
					} else if (!currentSearchResult.footnote) {
						(function (reference) {
							listItemElement.onclick = function () {
								UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(reference);
							};
						})(currentSearchResult.reference);
					} else {
						(function (reference) {
							listItemElement.onclick = function () {
								UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(reference);
								UIManager.buttonHandlers.footnotesButton();
							};
						})(currentSearchResult.reference);
					}

					var referenceElement = document.createElement("h1");
					referenceElement.classList.add("reference");
					if (UIReferences.searchBarFilterMode.classList.contains("memory") && currentSearchResult.memoryVerseStatus.type === "multiple") {
						referenceElement.textContent = currentSearchResult.memoryVerseStatus.startVerse + "-" + currentSearchResult.memoryVerseStatus.endVerse.split(":")[1];
					} else if (!currentSearchResult.footnote) {
						referenceElement.textContent = currentSearchResult.reference;
					} else {
						referenceElement.textContent = currentSearchResult.reference + " [" + currentSearchResult.footnote.letter + "]";
					}

					var contentElement = document.createElement("p");
					contentElement.classList.add("content");
					if (UIReferences.searchBarFilterMode.classList.contains("memory") && currentSearchResult.memoryVerseStatus.type === "multiple") {
						var individualVerses = scriptureEngine.getIndividualReferencesFromRangeReference(currentSearchResult.memoryVerseStatus.memoryReference);
						var compiledVerses = "";
						for (var j = 0; j < individualVerses.length; j++) {
							compiledVerses += new Verse(individualVerses[j]).verseContent + " ";
						}
						contentElement.textContent = compiledVerses;
					} else if (!currentSearchResult.footnote) {
						contentElement.textContent = new Verse(currentSearchResult.reference).verseContent;
						if (contentElement.textContent == "") {
							continue;
						}
					} else {
						var splitFootnote = currentSearchResult.footnote.text.split("_");
						for (var s = 0; s < splitFootnote.length; s++) {
							var span = document.createElement("span");
							span.textContent = splitFootnote[s];
							if (s % 2 != 0) {
								span.classList.add("italic");
							}
							contentElement.appendChild(span);
						}
						if (contentElement.textContent == "") {
							continue;
						}
					}

					listItemElement.appendChild(referenceElement);
					listItemElement.appendChild(contentElement);

					UIReferences.searchResultsContainer.appendChild(listItemElement);
				}
			} else {
				//There are no search results, so show a message indicating so.
				var messageElement = document.createElement("p");
				messageElement.classList.add("message");
				messageElement.textContent = "There are no matches for your search.";
				UIReferences.searchResultsContainer.appendChild(messageElement);
			}
		},

		clearSearchBar: function () {
			document.querySelector(".searchBarContainer .label").textContent = "Search by Content";
			UIReferences.searchBarFilterMode.textContent = "All";
			UIReferences.searchBarFilterMode.classList.remove("memory");
			UIReferences.searchBar.value = "";
			UIReferences.searchBar.blur();
			UIManager.searchBarHandlers.onchange();
			UIManager.searchBarHandlers.onblur();
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

	flyswatterScreen: {
		questionTree: {
			name: "What type of problem are you experiencing?",
			id: "flyswatter.contentJudge",
			options: [
				{
					name: "Unexpected Behavior",
					id: "flyswatter.contentJudge.unexpectedBehavior",
					options: [
						{
							name: "UI",
							id: "flyswatter.contentJudge.unexpectedBehavior.ui",
							options: [
								{
									name: "Animation Problem",
									id: "flyswatter.contentJudge.unexpectedBehavior.ui.animation",
									options: null,
								},
								{
									name: "Unresponsive Component",
									id: "flyswatter.contentJudge.unexpectedBehavior.ui.unresponsiveComponent",
									options: null,
								},
								{
									name: "Misplaced Component",
									id: "flyswatter.contentJudge.unexpectedBehavior.ui.misplacedComponent",
									options: null,
								},
							],
						},
						{
							name: "Illogical App Behavior",
							id: "illogical",
							options: null,
						},
					],
				},
				{
					name: "Content Error",
					id: "flyswatter.contentJudge.contentError",
					options: [
						{
							name: "Scripture",
							id: "flyswatter.contentJudge.contentError.scripture",
							options: [
								{
									name: "Missing Scripture",
									id: "flyswatter.contentJudge.contentError.scripture.missing",
									options: null,
								},
								{
									name: "Inaccurate Scripture",
									id: "flyswatter.contentJudge.contentError.scripture.inaccurate",
									options: null,
								},
							],
						},
						{
							name: "Pronoun Clarification",
							id: "flyswatter.contentJudge.contentError.pronounClarification",
							options: [
								{
									name: "Missing Pronoun Clarification",
									id: "flyswatter.contentJudge.contentError.pronounClarification.missing",
									options: null,
								},
								{
									name: "Incorrect Pronoun Clarification",
									id: "flyswatter.contentJudge.contentError.pronounClarification.incorrect",
									options: null,
								},
							],
						},
						{
							name: "Concordance Information",
							id: "concordance",
							options: null,
						},
					],
				},
				{
					name: "Feature Suggestion",
					id: "flyswatter.contentJudge.featureSuggestion",
					options: null,
				},
			],
		},

		currentOption: undefined,

		showFlyswatterScreen: function () {
			UIManager.show(UIReferences.flyswatterScreen, 200);
		},

		closeFlyswatterScreen: function () {
			UIManager.hide(UIReferences.flyswatterScreen, 200);

			setTimeout(function () {
				UIManager.flyswatterScreen.currentOption = undefined;
				//Remove all optionsContainers except for the first one
				while (UIReferences.flyswatterScreen.children.length > 2) {
					UIReferences.flyswatterScreen.removeChild(UIReferences.flyswatterScreen.children[2]);
				}
			}, 200);
		},

		selectedOption: function (optionID) {
			if (!this.currentOption) {
				this.currentOption = this.questionTree;
			}

			var optionsContainerElement = document.createElement("div");
			optionsContainerElement.classList.add("optionsContainer");
			optionsContainerElement.classList.add("hidden");

			var titleElement = document.createElement("h2");
			titleElement.textContent = this.currentOption.name;
			titleElement.classList.add("title");
			optionsContainerElement.appendChild(titleElement);

			//Find the selected option by matching its ID
			for (var i = 0; i < this.currentOption.options.length; i++) {
				var currentOption = this.currentOption.options[i];
				if (currentOption.id == optionID) {
					//If the selected option has suboptions, show them. If not, send the bug report.
					if (currentOption.options) {
						this.currentOption = currentOption;
						titleElement.textContent = currentOption.name;
						for (var j = 0; j < currentOption.options.length; j++) {
							var currentSuboption = currentOption.options[j];
							var optionElement = document.createElement("div");
							optionElement.textContent = currentSuboption.name;
							optionElement.classList.add("option");
							(function (optionID) {
								optionElement.onclick = function () {
									UIManager.flyswatterScreen.selectedOption(optionID);
								};
							})(currentSuboption.id);
							optionsContainerElement.appendChild(optionElement);
						}
					} else {
						UIManager.flyswatterScreen.closeFlyswatterScreen();
						flyswatter.sendBugReport(optionID);
					}
					break;
				}
			}

			UIReferences.flyswatterScreen.appendChild(optionsContainerElement);
			requestAnimationFrame(function () {
				optionsContainerElement.classList.remove("hidden");
			});
		},
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

	bookSelectorHandler: function () {
		var selectElement = UIReferences.quizCycleYearSelector;
		var value = selectElement.value;
		var selectedBook = scriptureEngine.getYearByAbbreviation(value);

		storageManager.set("quizCycleYear", selectedBook);
		scriptureEngine.currentYearObject = window[selectedBook];

		UIManager.searchByReference.populateSearchByReferenceContainer();
		UIManager.buttonHandlers.closeVerseSelectionContainer();
		if (Object.keys(scriptureEngine.currentYearObject.books).length > 1) {
			UIManager.buttonHandlers.closeChapterSelectionContainer();
		}
		UIManager.searchBarHandlers.clearSearchBar();
	},

	setBookSelector: function (bookObjectName) {
		var abbreviation = scriptureEngine.getYearAbbreviationByName(bookObjectName);
		UIReferences.quizCycleYearSelector.value = abbreviation;
	},

	searchByReference: {
		currentSearchObject: {
			bookAbbreviation: undefined,
			chapter: undefined,
			verse: undefined,
		},

		populateAndShowChapterSelectionContainer: function () {
			//Clear the current items in the container
			while (UIReferences.chapterSelectionElementContainer.firstChild) {
				UIReferences.chapterSelectionElementContainer.removeChild(UIReferences.chapterSelectionElementContainer.firstChild);
			}

			var bookAbbreviation = UIManager.searchByReference.currentSearchObject.bookAbbreviation;
			var selectedBookObject = scriptureEngine.getBookByAbbreviation(bookAbbreviation);

			var numberOfChapters = selectedBookObject.chapters.length;
			for (var i = 0; i < numberOfChapters; i++) {
				var chapterSelectionElement = document.createElement("div");
				chapterSelectionElement.classList.add("chapterSelectionElement");
				chapterSelectionElement.classList.add("selectionElement");
				chapterSelectionElement.textContent = i + 1;
				(function (chapterNumber) {
					chapterSelectionElement.onclick = function () {
						UIManager.searchByReference.currentSearchObject.chapter = chapterNumber;
						UIManager.searchByReference.populateAndShowVerseSelectionContainer();
					};
				})(i + 1);

				UIReferences.chapterSelectionElementContainer.appendChild(chapterSelectionElement);
			}

			//Set the label of the container
			UIReferences.chapterSelectionContainerLabel.textContent = scriptureEngine.unabbreviateBookNamesInString(bookAbbreviation);

			//Show screen
			UIManager.show(UIReferences.chapterSelectionContainer, 200);
		},

		populateAndShowVerseSelectionContainer: function () {
			//Clear the current items in the screen
			while (UIReferences.verseSelectionElementContainer.firstChild) {
				UIReferences.verseSelectionElementContainer.removeChild(UIReferences.verseSelectionElementContainer.firstChild);
			}

			var selectedBook = scriptureEngine.getBookByAbbreviation(UIManager.searchByReference.currentSearchObject.bookAbbreviation);
			var chapterNumber = UIManager.searchByReference.currentSearchObject.chapter;

			var numberOfVerses = new Verse(UIManager.searchByReference.currentSearchObject.bookAbbreviation + " " + chapterNumber + ":1").chapterLength;
			for (var i = 0; i < numberOfVerses; i++) {
				var verseSelectionElement = document.createElement("div");
				verseSelectionElement.classList.add("verseSelectionElement");
				verseSelectionElement.classList.add("selectionElement");
				// If the verse is a memory verse, add a class to the element
				var memoryStatus = new Verse(UIManager.searchByReference.currentSearchObject.bookAbbreviation + " " + chapterNumber + ":" + (i + 1)).memoryVerseStatus;
				if (memoryStatus.isMemory) {
					verseSelectionElement.classList.add("memory");
				}
				if (memoryStatus.startVerse === UIManager.searchByReference.currentSearchObject.bookAbbreviation + " " + chapterNumber + ":" + (i + 1)) {
					verseSelectionElement.classList.add("memoryStart");
				}
				verseSelectionElement.textContent = i + 1;
				(function (verseNumber) {
					verseSelectionElement.onclick = function () {
						UIManager.searchByReference.currentSearchObject.verse = verseNumber;

						var bookAbbreviation = UIManager.searchByReference.currentSearchObject.bookAbbreviation;
						var chapterNumber = UIManager.searchByReference.currentSearchObject.chapter;

						var referenceString = bookAbbreviation + " " + chapterNumber + ":" + verseNumber;

						UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(referenceString);
					};
				})(i + 1);

				UIReferences.verseSelectionElementContainer.appendChild(verseSelectionElement);
			}

			//Set the label of the container
			UIReferences.verseSelectionContainerLabel.textContent =
				scriptureEngine.unabbreviateBookNamesInString(UIManager.searchByReference.currentSearchObject.bookAbbreviation) + " " + chapterNumber;

			//Show screen
			UIManager.show(UIReferences.verseSelectionContainer, 200);
		},

		populateSearchByReferenceContainer: function () {
			//Clear
			while (UIReferences.bookSelectionElementContainer.firstChild) {
				UIReferences.bookSelectionElementContainer.removeChild(UIReferences.bookSelectionElementContainer.firstChild);
			}

			//Count how many books are in the current year
			var bookCount = Object.keys(scriptureEngine.currentYearObject.books).length;
			if (bookCount == 1) {
				//If there is only one book in the year, skip the book selection and go straight to the chapter selection
				document.querySelector(".labelContainer.multipleBooks").classList.add("hidden");
				document.querySelector(".labelContainer.singleBook").classList.remove("hidden");
				document.querySelector(".labelContainer.singleBook .label").textContent = Object.keys(scriptureEngine.currentYearObject.books)[0];
				UIManager.searchByReference.currentSearchObject.bookAbbreviation = scriptureEngine.currentYearObject.books[Object.keys(scriptureEngine.currentYearObject.books)[0]].abbreviation;
				UIManager.searchByReference.populateAndShowChapterSelectionContainer();
				return;
			} else {
				document.querySelector(".labelContainer.multipleBooks").classList.remove("hidden");
				document.querySelector(".labelContainer.singleBook").classList.add("hidden");
				//Populate the book selection
				var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);
				for (var i = 0; i < currentYearBooksKeys.length; i++) {
					var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
					var currentBookName = currentYearBooksKeys[i];

					var bookSelectionElement = document.createElement("div");
					bookSelectionElement.classList.add("bookSelectionElement");
					(function (bookAbbreviation) {
						bookSelectionElement.onclick = function () {
							UIManager.searchByReference.currentSearchObject.bookAbbreviation = bookAbbreviation;
							UIManager.searchByReference.populateAndShowChapterSelectionContainer();
						};
					})(currentBook.abbreviation);

					var bookSelectionElementIcon = document.createElement("h1");
					bookSelectionElementIcon.classList.add("icon");
					bookSelectionElementIcon.textContent = currentBook.abbreviation;

					var bookSelectionElementLabel = document.createElement("p");
					bookSelectionElementLabel.classList.add("label");
					bookSelectionElementLabel.textContent = currentBookName;

					bookSelectionElement.appendChild(bookSelectionElementIcon);
					bookSelectionElement.appendChild(bookSelectionElementLabel);

					UIReferences.bookSelectionElementContainer.appendChild(bookSelectionElement);
				}
			}
		},
	},

	chapterDisplayScreen: {
		populateAndShowChapterDisplayScreen: function (reference) {
			//Clear current content of the screen
			while (UIReferences.chapterDisplayScreenContent.firstChild) {
				UIReferences.chapterDisplayScreenContent.removeChild(UIReferences.chapterDisplayScreenContent.firstChild);
			}

			UIReferences.chapterDisplayScreenTitle.textContent = scriptureEngine.unabbreviateBookNamesInString(reference);
			UIReferences.chapterDisplayScreenSubtitle.textContent = new Verse(reference + ":1").chapterLength + " verses";

			var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

			var book;

			//Loop through all the books in this year's object until a match is found for the abbreviation.
			var bookAbbreviation = reference.split(" ")[0];

			splitReference = reference.split(" ")[1].split(":");

			for (var i = 0; i < currentYearBooksKeys.length; i++) {
				var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
				if (currentBook.abbreviation == bookAbbreviation) {
					book = currentBook;
					break;
				}
			}

			//Get the correct chapter (subtract 1 from the chapter number to find the index)
			var chapter = book.chapters[splitReference[0] - 1];

			var verses = [];
			var verseCount = 0;

			var carryoverVerse = null;
			var carryoverVerseReference = null;

			for (var s = 0; s < chapter.sections.length; s++) {
				var currentSection = chapter.sections[s];

				//Create a section container element
				var sectionContainerElement = document.createElement("div");
				sectionContainerElement.classList.add("sectionContainer");

				//Create a section title element
				var sectionTitleElement = document.createElement("h2");
				sectionTitleElement.classList.add("title");
				sectionTitleElement.textContent = currentSection.title;

				//Create a verse container element
				var sectionVersesContainerElement = document.createElement("ol");
				sectionVersesContainerElement.classList.add("sectionVersesContainer");
				sectionVersesContainerElement.start = verseCount + 1;

				sectionContainerElement.appendChild(sectionTitleElement);
				sectionContainerElement.appendChild(sectionVersesContainerElement);

				//If there is a carry-over verse, add it to the beginning of the section and account for numbering
				if (carryoverVerse) {
					var currentVerseElement = document.createElement("li");
					currentVerseElement.classList.add("verse");
					currentVerseElement.classList.add("carryover");
					currentVerseElement.textContent = carryoverVerse;

					var memoryVerseStatus = new Verse(carryoverVerseReference).memoryVerseStatus;
					if (memoryVerseStatus.isMemory) {
						currentVerseElement.classList.add("memory");
					}

					(function (referenceString) {
						currentVerseElement.onclick = function () {
							UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(referenceString);
						};
					})(carryoverVerseReference);

					sectionVersesContainerElement.appendChild(currentVerseElement);
					sectionVersesContainerElement.start = verseCount;

					carryoverVerse = null;
					carryoverVerseReference = null;
				}

				//Loop through each verse
				for (var v = 0; v < currentSection.verses.length; v++) {
					verseCount++;

					var currentVerse = currentSection.verses[v];
					var currentVerseReference = reference + ":" + verseCount;

					var currentVerseElement = document.createElement("li");
					currentVerseElement.classList.add("verse");

					if (currentVerse.indexOf(" {SECTION} ") > -1) {
						currentVerseElement.textContent = currentVerse.split(" {SECTION} ")[0];
						carryoverVerse = currentVerse.split(" {SECTION} ")[1];
						carryoverVerseReference = currentVerseReference;
					} else {
						currentVerseElement.textContent = currentVerse;
					}

					var memoryVerseStatus = new Verse(currentVerseReference).memoryVerseStatus;
					if (memoryVerseStatus.isMemory) {
						currentVerseElement.classList.add("memory");

						if (memoryVerseStatus.startVerse === currentVerseReference) {
							//Get the prejump
							var verseType = memoryVerseStatus.type == "single" ? "singles" : "multiples";
							var prejump = scriptureEngine.currentYearObject.prejumps[verseType][memoryVerseStatus.memoryIndex];

							//Create a new element for the prejump
							var prejumpElement = document.createElement("span");
							prejumpElement.classList.add("prejump");
							prejumpElement.textContent = prejump;

							var textNode = document.createTextNode(currentVerse.slice(prejump.length));

							currentVerseElement.textContent = "";
							currentVerseElement.appendChild(prejumpElement);
							currentVerseElement.appendChild(textNode);
						}
					}

					(function (referenceString) {
						currentVerseElement.onclick = function () {
							UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(referenceString);
						};
					})(currentVerseReference);

					sectionVersesContainerElement.appendChild(currentVerseElement);
				}

				UIReferences.chapterDisplayScreenContent.appendChild(sectionContainerElement);
			}

			var footnoteLetters = Object.keys(chapter.footnotes);
			for (var f = 0; f < footnoteLetters.length; f++) {
				var currentFootnote = chapter.footnotes[footnoteLetters[f]];

				var footnoteElement = document.createElement("div");
				footnoteElement.classList.add("footnote");

				var letterElement = document.createElement("h3");
				letterElement.classList.add("letter");
				letterElement.textContent = footnoteLetters[f];

				var contentElement = document.createElement("p");
				contentElement.classList.add("content");
				currentFootnote = currentFootnote.split("_");
				for (var i = 0; i < currentFootnote.length; i++) {
					var span = document.createElement("span");
					span.textContent = currentFootnote[i];
					if (i % 2 != 0) {
						span.classList.add("italic");
					}
					contentElement.appendChild(span);
				}

				footnoteElement.appendChild(letterElement);
				footnoteElement.appendChild(contentElement);

				UIReferences.chapterDisplayScreenContent.appendChild(footnoteElement);
			}

			UIManager.show(UIReferences.chapterDisplayScreen, 200);
		},

		closeChapterDisplayScreen: function (preserveScreenHeirarchy) {
			if (preserveScreenHeirarchy) {
				UIManager.hide(UIReferences.chapterDisplayScreen, 200);
			} else {
				if (Object.keys(scriptureEngine.currentYearObject.books).length > 1) {
					UIManager.hide(UIReferences.chapterSelectionContainer, null);
				}
				UIManager.hide(UIReferences.verseSelectionContainer, null);
				UIManager.hide(UIReferences.chapterDisplayScreen, 200);
			}

			setTimeout(function () {
				UIReferences.chapterDisplayScreen.scrollTop = 0;
			}, 200);
		},
	},

	verseDisplayScreen: {
		currentVerseReference: null,

		navigation: {
			navigationStack: [],

			navigateToVerse: function (reference, backwards, preserveStack) {
				//Add the reference to the navigation stack, unless preserveStack is set to true or the user is holding the Option key
				if (!preserveStack && !optionKeyDown) {
					UIManager.verseDisplayScreen.navigation.navigationStack.push(reference);
				}

				//If the animation mode is set to automatic, determine the correct direction now
				if (backwards === "automatic") {
					var previousReference = UIManager.verseDisplayScreen.currentVerseReference;
					var earliestReference = scriptureEngine.returnEarliestReference(reference, previousReference);
					if (reference == earliestReference) {
						backwards = true;
					} else {
						backwards = false;
					}
				}

				var transformProperties = {
					normal: {
						mobile: {
							left: "translate(100px, -50%)",
							right: "translate(-100px, -50%)",
						},
						desktop: {
							left: "translate(calc(-50% + 100px), -50%)",
							right: "translate(calc(-50% - 100px), -50%)",
						},
					},
					up: {
						mobile: {
							left: "translate(100px, 0)",
							right: "translate(-100px, 0)",
						},
						desktop: {
							left: "translate(calc(-50% + 100px), -50%)",
							right: "translate(calc(-50% - 100px), -50%)",
						},
					},
				};
				var verseDisplayIsUp = UIReferences.verseDisplay.classList.contains("up");

				var closeSlidePanel = !UIReferences.slidePanelSingleWordInformation.classList.contains("hidden");

				UIReferences.verseDisplay.style.removeProperty("transition");

				requestAnimationFrame(function () {
					//Fade out the verse display, slide panel screens, and verse information.
					UIReferences.verseDisplay.style.opacity = 0;
					UIReferences.slidePanelPossibleQuestions.style.opacity = 0;
					UIReferences.slidePanelPronounClarification.style.opacity = 0;
					UIReferences.slidePanelFootnotes.style.opacity = 0;
					UIReferences.verseDisplayScreenTitle.style.opacity = 0;
					UIReferences.verseDisplayScreenSubtitle.style.opacity = 0;

					var isDesktop = !window.matchMedia("only screen and (max-width: 925px)").matches;

					UIReferences.verseDisplay.style.transform = transformProperties[verseDisplayIsUp ? "up" : "normal"][isDesktop ? "desktop" : "mobile"][backwards ? "left" : "right"];

					//Refresh the back button
					UIManager.verseDisplayScreen.updateBackButtonState();

					setTimeout(function () {
						// 1/4 Remove the transition from the verseDisplay
						UIReferences.verseDisplay.style.transition = "none";

						requestAnimationFrame(function () {
							// 2/4 If the single word information panel is showing, close the slide panel.
							if (closeSlidePanel) {
								if (!isDesktop) {
									UIReferences.slidePanel.style.opacity = 0;
								} else {
									UIManager.verseDisplayScreen.hideSlidePanel();
								}
								UIReferences.verseDisplay.classList.remove("up");
								setTimeout(function () {
									//Remove the transition
									UIReferences.slidePanel.style.transition = "none";

									requestAnimationFrame(function () {
										if (!isDesktop) {
											UIReferences.slidePanel.classList.add("hidden");
											UIReferences.slidePanel.style.removeProperty("opacity");
										}

										requestAnimationFrame(function () {
											UIReferences.slidePanel.style.removeProperty("transition");
										});
									});
								}, 300);
							}

							requestAnimationFrame(function () {
								// 4/4 Restore the transition for the slide panel if it wasn't closed.
								if (!closeSlidePanel) {
									UIReferences.slidePanel.style.removeProperty("transition");
								}

								//Populate the screen
								UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(reference);

								//If the slide panel is showing, reset the height
								if (!closeSlidePanel && !UIReferences.slidePanel.classList.contains("hidden")) {
									UIManager.verseDisplayScreen.setSlidePanelHeight();
								}

								//If the slide panel pronoun clarification screen is showing, rehighlight the pronouns in the verse display
								if (!closeSlidePanel && !UIReferences.slidePanelPronounClarification.classList.contains("hidden")) {
									UIManager.verseDisplayScreen.showSlidePanel("pronounClarification");
								}

								//Move the verse display to the opposite side
								verseDisplayIsUp = UIReferences.verseDisplay.classList.contains("up");

								UIReferences.verseDisplay.style.transform = transformProperties[verseDisplayIsUp ? "up" : "normal"][isDesktop ? "desktop" : "mobile"][backwards ? "right" : "left"];

								setTimeout(function () {
									//Animate the slide panel screens and verse information back in
									UIReferences.verseDisplayScreenTitle.removeAttribute("style");
									UIReferences.verseDisplayScreenSubtitle.removeAttribute("style");
									UIReferences.slidePanelPossibleQuestions.removeAttribute("style");
									UIReferences.slidePanelPronounClarification.removeAttribute("style");
									UIReferences.slidePanelFootnotes.removeAttribute("style");

									//Animate the verse display back into place
									UIReferences.verseDisplay.style.removeProperty("transition");
									UIReferences.verseDisplay.style.removeProperty("opacity");
									UIReferences.verseDisplay.style.removeProperty("transform");
								}, 200);
							});
						});
					}, 300);
				});
			},

			toPreviousState: function () {
				//Remove the last item in the navigation stack.
				UIManager.verseDisplayScreen.navigation.navigationStack.pop();

				var navigationStackLength = UIManager.verseDisplayScreen.navigation.navigationStack.length;
				var previousReference = UIManager.verseDisplayScreen.navigation.navigationStack[navigationStackLength - 1];

				//Navigate to the previous verse.
				UIManager.verseDisplayScreen.navigation.navigateToVerse(previousReference, "automatic", true);
			},
		},

		updateBackButtonState: function () {
			//If there are multiple states in the navigation stack, enable the back button. Otherwise. disable it.
			if (UIManager.verseDisplayScreen.navigation.navigationStack.length > 1) {
				UIReferences.verseDisplayScreenBackButton.removeAttribute("disabled");
			} else {
				UIReferences.verseDisplayScreenBackButton.setAttribute("disabled", "disabled");
			}
		},

		closeVerseDisplayScreen: function (preserveScreenHeirarchy) {
			UIManager.verseDisplayScreen.currentVerseReference = null;
			UIManager.verseDisplayScreen.navigation.navigationStack = [];

			if (preserveScreenHeirarchy) {
				UIManager.hide(UIReferences.verseDisplayScreen, 200);
			} else {
				if (Object.keys(scriptureEngine.currentYearObject.books).length > 1) {
					UIManager.hide(UIReferences.chapterSelectionContainer, null);
				}
				UIManager.hide(UIReferences.verseSelectionContainer, null);

				UIManager.hide(UIReferences.verseDisplayScreen, 200);
			}

			//Hide the slide panel
			setTimeout(function () {
				UIManager.verseDisplayScreen.hideSlidePanel();
				UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();
			}, 200);
		},

		populateAndShowVerseDisplayScreen: function (referenceString) {
			var verse = new Verse(referenceString);

			//If the user is opening the verse display screen, add this first verse as the base item on the navigation stack
			if (UIManager.verseDisplayScreen.currentVerseReference === null) {
				UIManager.verseDisplayScreen.navigation.navigationStack.push(referenceString);
			}

			UIManager.verseDisplayScreen.currentVerseReference = referenceString;

			//Update the back button
			UIManager.verseDisplayScreen.updateBackButtonState();

			//Clear the verse display
			while (UIReferences.verseDisplayTextContainer.firstChild) {
				UIReferences.verseDisplayTextContainer.removeChild(UIReferences.verseDisplayTextContainer.firstChild);
			}

			//Show the reference of the verse
			UIReferences.verseDisplayScreenTitle.textContent = verse.expandedReference;
			document.querySelector(".verseDisplayScreen .header .title .reference").textContent = verse.expandedReference;

			//Disable both neighboring verse buttons
			UIReferences.verseDisplayScreenPreviousVerseButton.setAttribute("disabled", "disabled");
			UIReferences.verseDisplayScreenNextVerseButton.setAttribute("disabled", "disabled");
			UIReferences.verseDisplayScreenPreviousVerseButton.onclick = null;
			UIReferences.verseDisplayScreenNextVerseButton.onclick = null;
			document.querySelector(".verseDisplayScreen .header .trailing .previous").classList.add("disabled");
			document.querySelector(".verseDisplayScreen .header .trailing .previous").onclick = null;
			document.querySelector(".verseDisplayScreen .header .trailing .next").classList.add("disabled");
			document.querySelector(".verseDisplayScreen .header .trailing .next").onclick = null;

			//Get the neighboring verses. Selectively enable the buttons.
			var previousVerse = verse.relative(-1);
			var nextVerse = verse.relative(1);

			if (previousVerse) {
				UIReferences.verseDisplayScreenPreviousVerseButton.onclick = function () {
					UIManager.verseDisplayScreen.navigation.navigateToVerse(previousVerse.reference, true);
				};
				UIReferences.verseDisplayScreenPreviousVerseButton.removeAttribute("disabled");
				document.querySelector(".verseDisplayScreen .header .trailing .previous").classList.remove("disabled");
				document.querySelector(".verseDisplayScreen .header .trailing .previous").onclick = function () {
					UIManager.verseDisplayScreen.navigation.navigateToVerse(previousVerse.reference, true);
				};
			}
			if (nextVerse) {
				UIReferences.verseDisplayScreenNextVerseButton.onclick = function () {
					UIManager.verseDisplayScreen.navigation.navigateToVerse(nextVerse.reference);
				};
				UIReferences.verseDisplayScreenNextVerseButton.removeAttribute("disabled");
				document.querySelector(".verseDisplayScreen .header .trailing .next").classList.remove("disabled");
				document.querySelector(".verseDisplayScreen .header .trailing .next").onclick = function () {
					UIManager.verseDisplayScreen.navigation.navigateToVerse(nextVerse.reference);
				};
			}

			//Populate the verse display
			var wordsInVerse = verse.verseContent.split(" ");

			//For each word in the verse, create an element in the verse display
			for (var i = 0; i < wordsInVerse.length; i++) {
				if (wordsInVerse[i] === "") {
					continue;
				}

				var currentWordElement = document.createElement("p");
				currentWordElement.textContent = wordsInVerse[i].replaceAll(/(\[[a-z]\])/g, "");

				//If the current word is just a punctuation mark (a hyphen, for example), don't allow the user to select it, and don't apply the hover styling to imply such.
				if (!scriptureEngine.filterWord(currentWordElement.textContent, true)) {
					currentWordElement.classList.add("notSelectable");
				} else {
					//Because this code is within the else block of the previous if statement, it will only run if the word is not punctuation

					//If the current word is a unique word, double word, or triple word, apply the appropriate class
					var numberOfOccurrences = scriptureEngine.currentYearObject.concordance[scriptureEngine.filterWord(currentWordElement.textContent, true)].references.length;
					switch (numberOfOccurrences) {
						case 1:
							currentWordElement.classList.add("uniqueWord");
							break;
						case 2:
							currentWordElement.classList.add("doubleWord");
							break;
						case 3:
							currentWordElement.classList.add("tripleWord");
							break;
					}

					//Add an event listener for the word to pull up the slide panel. (Using an IIFE in order to prevent a closure.)
					(function (wordElement) {
						wordElement.onclick = function () {
							UIManager.verseDisplayScreen.displayIndividualWordInformation(wordElement);
						};
					})(currentWordElement);
				}

				//See if there's a footnote reference in the word. If so, create a seperate element for the footnote
				var matchesForFootnoteRegex = wordsInVerse[i].match(/(\[[a-z]\])/g);
				var footnoteReferenceElements = [];
				if (matchesForFootnoteRegex) {
					//There are footnote references in the word
					currentWordElement.classList.add("footnoteFollows");

					for (var f = 0; f < matchesForFootnoteRegex.length; f++) {
						var currentWordFootnoteReferenceElement = document.createElement("p");
						currentWordFootnoteReferenceElement.classList.add("footnoteReference");
						currentWordFootnoteReferenceElement.textContent = matchesForFootnoteRegex[f];
						currentWordFootnoteReferenceElement.onclick = function () {
							UIManager.buttonHandlers.footnotesButton();
						};

						//If there is another footnote reference after this one, add the footnoteFollows class
						if (f < matchesForFootnoteRegex.length - 1) {
							currentWordFootnoteReferenceElement.classList.add("footnoteFollows");
						}

						footnoteReferenceElements.push(currentWordFootnoteReferenceElement);
					}
				}

				UIReferences.verseDisplayTextContainer.appendChild(currentWordElement);
				for (var f = 0; f < footnoteReferenceElements.length; f++) {
					UIReferences.verseDisplayTextContainer.appendChild(footnoteReferenceElements[f]);
				}
			}

			//If the verse is a memory verse, indicate so and hightlight the prejump. Otherwise hide the memory verse indicator.
			var memoryVerseStatus = verse.memoryVerseStatus;
			if (memoryVerseStatus.isMemory) {
				//The verse is part of a memory verse

				//Show memory indicator
				UIReferences.verseDisplayScreenSubtitleText.textContent = memoryVerseStatus.memoryReference;
				UIManager.show(UIReferences.verseDisplayScreenSubtitle);
				document.querySelector(".verseDisplayScreen .header .memory").classList.remove("hidden");

				//If the memory verse is a single verse
				if (memoryVerseStatus.type == "single") {
					document.querySelector(".verseDisplayScreen .header .memory .reference").textContent = "Memory";
				} else {
					document.querySelector(".verseDisplayScreen .header .memory .reference").textContent = memoryVerseStatus.memoryReference;
				}

				//Show the prejump only if this is the first verse of the memory verse
				if (memoryVerseStatus.startVerse == referenceString) {
					//Get the prejump
					var verseType = memoryVerseStatus.type == "single" ? "singles" : "multiples";
					var prejump = scriptureEngine.currentYearObject.prejumps[verseType][memoryVerseStatus.memoryIndex];

					//Split prejump into words
					prejump = prejump.split(" ");
					for (var i = 0; i < prejump.length; i++) {
						UIReferences.verseDisplayTextContainer.children[i].classList.add("prejump");
					}
				}
			} else {
				UIManager.hide(UIReferences.verseDisplayScreenSubtitle);
				document.querySelector(".verseDisplayScreen .header .leading .memory").classList.add("hidden");
			}

			//Clear and repopulate the pronoun clarification slide panel screen
			while (UIReferences.pronounClarificationContent.firstChild) {
				UIReferences.pronounClarificationContent.removeChild(UIReferences.pronounClarificationContent.firstChild);
			}

			var pronounClarifications = scriptureEngine.getPronounClarificationsByReference(referenceString);
			if (pronounClarifications && pronounClarifications.length > 0) {
				for (var i = 0; i < pronounClarifications.length; i++) {
					var currentClarification = pronounClarifications[i];

					//Create the elements

					var element = document.createElement("div");
					element.classList.add("listItem");
					function highlightPronoun(pronounClarification, highlightWord) {
						//Highlight this pronoun's corresponsing word in the verse display
						//Loop through every word in the verse display
						var occurrences = 0;
						for (var j = 0; j < UIReferences.verseDisplayTextContainer.children.length; j++) {
							//If the current word is the same as the pronoun, add an occurrence.
							if (UIReferences.verseDisplayTextContainer.children[j].textContent === pronounClarification.pronoun) {
								occurrences++;
								//Highlight or unhighlight the word if this is the correct occurrence, or if occurrences don't matter
								if ((pronounClarification.occurrence && pronounClarification.occurrence == occurrences) || !pronounClarification.occurrence) {
									if (highlightWord) {
										UIReferences.verseDisplayTextContainer.children[j].classList.add("highlight");
									} else {
										UIReferences.verseDisplayTextContainer.children[j].classList.remove("highlight");
									}
								}
							}
						}
					}
					(function (currentClarification) {
						element.onmouseover = function () {
							highlightPronoun(currentClarification, true);
						};
						element.onmouseout = function () {
							highlightPronoun(currentClarification, false);
						};
					})(currentClarification);
					if (currentClarification.reference && currentClarification.reference !== verse.reference) {
						(function (reference) {
							element.onclick = function () {
								UIManager.verseDisplayScreen.navigation.navigateToVerse(reference, "automatic");
							};
						})(currentClarification.reference);
						element.classList.add("hasReference");
					}

					var headerContainter = document.createElement("div");
					headerContainter.classList.add("headerContainer");

					var pronounElement = document.createElement("h1");
					pronounElement.classList.add("pronoun");
					pronounElement.textContent = currentClarification.pronoun;

					var arrow = document.createElement("picture");
					arrow.classList.add("arrow");
					arrow.classList.add("right");

					var arrowSource = document.createElement("source");
					arrowSource.srcset = "images/icons/Arrow-White.svg";
					arrowSource.setAttribute("media", "(prefers-color-scheme: dark)");

					var arrowImage = document.createElement("img");
					arrowImage.src = "images/icons/Arrow.svg";
					arrowImage.setAttribute("height", "30px");
					arrowImage.setAttribute("width", "auto");

					var antecedentElement = document.createElement("h1");
					antecedentElement.classList.add("antecedent");
					antecedentElement.textContent = currentClarification.antecedent;

					var reference = document.createElement("p");
					reference.classList.add("reference");
					if (currentClarification.reference && currentClarification.reference !== verse.reference) {
						reference.textContent = new Verse(currentClarification.reference).expandedReference;
					} else {
						reference.textContent = "This Verse";
					}

					//Assemble the elements

					arrow.appendChild(arrowSource);
					arrow.appendChild(arrowImage);

					headerContainter.appendChild(pronounElement);
					headerContainter.appendChild(arrow);
					headerContainter.appendChild(antecedentElement);

					element.appendChild(headerContainter);

					element.appendChild(reference);

					UIReferences.pronounClarificationContent.appendChild(element);
				}
			} else {
				//There are no pronoun clarifications for this verse, so show a message indicating so.
				var noPronounClarificationsMessageElement = document.createElement("p");
				noPronounClarificationsMessageElement.classList.add("message");
				noPronounClarificationsMessageElement.textContent = "There are no Pronoun Clarifications for this verse.";

				UIReferences.pronounClarificationContent.appendChild(noPronounClarificationsMessageElement);
			}

			//Clear and repopulate the footnotes slide panel screen
			while (UIReferences.footnotesContent.firstChild) {
				UIReferences.footnotesContent.removeChild(UIReferences.footnotesContent.firstChild);
			}

			var footnotes = scriptureEngine.getFootnotesByReference(referenceString);
			if (footnotes.length > 0) {
				for (var i = 0; i < footnotes.length; i++) {
					var currentFootnote = footnotes[i];

					//Create the elements

					var element = document.createElement("div");
					element.classList.add("listItem");

					var letterElement = document.createElement("h1");
					letterElement.classList.add("letter");
					letterElement.textContent = currentFootnote.letter;

					var footnoteContent = document.createElement("p");
					footnoteContent.classList.add("content");

					//Create spans for every section of the footnote between _s.
					var splitContent = currentFootnote.footnote.split("_");
					var emphasis = false;
					for (var a = 0; a < splitContent.length; a++) {
						var currentSegment = splitContent[a];

						var currentSegmentElement = document.createElement("span");

						if (emphasis) {
							currentSegmentElement.classList.add("emphasis");
						}

						currentSegmentElement.textContent = currentSegment;
						footnoteContent.appendChild(currentSegmentElement);

						emphasis = !emphasis;
					}

					//Assemble the elements

					element.appendChild(letterElement);
					element.appendChild(footnoteContent);

					UIReferences.footnotesContent.appendChild(element);
				}
			} else {
				//There are no footnotes for this verse, so show a message indicating so.
				var noFootnotesMessageElement = document.createElement("p");
				noFootnotesMessageElement.classList.add("message");
				noFootnotesMessageElement.textContent = "There are no footnotes for this verse.";

				UIReferences.footnotesContent.appendChild(noFootnotesMessageElement);
			}

			//Recall preferences for verse display
			if (storageManager.get("highlightPrejump")) {
				UIReferences.highlightPrejumpButton.classList.add("active");
				UIReferences.verseDisplay.classList.add("highlightPrejump");
			}
			if (storageManager.get("highlightRareWords")) {
				UIReferences.highlightRareWordsButton.classList.add("active");
				UIReferences.verseDisplay.classList.add("highlightRareWords");
			}

			UIManager.show(UIReferences.verseDisplayScreen, 200);
		},

		displayIndividualWordInformation(wordElement) {
			//Deselect all toolbar items
			UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();

			//If the word is already selected, we should deselect it.
			if (wordElement.classList.contains("selected")) {
				UIManager.verseDisplayScreen.deselectAllWords();
				return;
			} else {
				UIManager.verseDisplayScreen.deselectAllWords();
			}

			var word = wordElement.textContent;
			var filteredWord = scriptureEngine.filterWord(wordElement.textContent, true);

			//Apply the selected class to the element
			wordElement.classList.add("selected");

			//Find all other occurrences of the same word in the current verse
			var allOtherOccurrences = [];
			var allWords = UIReferences.verseDisplayTextContainer.children;
			for (var i = 0; i < allWords.length; i++) {
				//If the element contains the same word and isn't the original selected element, add it to the array.
				if (scriptureEngine.filterWord(allWords[i].textContent, true) == filteredWord && allWords[i] != wordElement) {
					allOtherOccurrences.push(allWords[i]);
				}
			}

			//Add the outlined class to all the other occurrences
			for (var i = 0; i < allOtherOccurrences.length; i++) {
				allOtherOccurrences[i].classList.add("outlined");
			}

			//Get concordance information for the word
			var selectedVerseReference = UIManager.verseDisplayScreen.currentVerseReference;

			var concordanceReferences = scriptureEngine.currentYearObject.concordance[filteredWord].references;
			var uniqueConcordanceReferences = [...new Set(concordanceReferences)];
			var totalOccurrences = concordanceReferences.length;
			var totalUniqueOccurrences = uniqueConcordanceReferences.length;

			var occurrencesInVerse = allOtherOccurrences.length + 1;
			var occurrencesInSection = 0;
			var occurrencesInChapter = 0;
			var occurrencesInBook = 0;

			//Loop through every concordance reference, and increment each count as needed
			for (var i = 0; i < concordanceReferences.length; i++) {
				var currentReference = concordanceReferences[i];

				//Occurrences in book
				var currentReferenceBookAbbreviation = currentReference.split(" ")[0];
				var selectedVerseBookAbbreviation = selectedVerseReference.split(" ")[0];
				if (currentReferenceBookAbbreviation == selectedVerseBookAbbreviation) {
					occurrencesInBook++;
				}

				//Occurrences in chapter
				var currentReferenceChapter = currentReference.slice(0, currentReference.indexOf(":"));
				var selectedVerseChapter = selectedVerseReference.slice(0, currentReference.indexOf(":"));
				if (currentReferenceChapter == selectedVerseChapter) {
					occurrencesInChapter++;
				}

				//Occurrences in section
				//If both references are from the same book and chapter, compare the section numbers
				if (currentReferenceChapter == selectedVerseChapter) {
					var currentReferenceSectionNumber = new Verse(currentReference).sectionIndex;
					var selectedVerseSectionNumber = new Verse(selectedVerseReference).sectionIndex;
					if (currentReferenceSectionNumber == selectedVerseSectionNumber) {
						occurrencesInSection++;
					}
				}
			}

			//Capitalize the first letter of the word
			var capitalizedWord = filteredWord.slice(0, 1).toUpperCase() + filteredWord.slice(1);

			UIReferences.singleWordInformationTitle.textContent = capitalizedWord;

			while (UIReferences.singleWordInformationContent.firstChild) {
				UIReferences.singleWordInformationContent.removeChild(UIReferences.singleWordInformationContent.firstChild);
			}

			var concordanceInformationContainer = document.createElement("div");
			concordanceInformationContainer.classList.add("concordanceInformationContainer");
			var referencesContainer = document.createElement("div");
			referencesContainer.classList.add("referencesContainer");

			if (totalOccurrences == 1) {
				UIReferences.singleWordInformationSubtitle.textContent = "Unique word";

				var description = document.createElement("p");
				description.classList.add("description");
				description.textContent = "This word occurs only in this verse.";

				UIReferences.singleWordInformationContent.appendChild(description);
			} else {
				if (totalOccurrences == 2) {
					UIReferences.singleWordInformationSubtitle.textContent = "Double word";
				} else if (totalOccurrences == 3) {
					UIReferences.singleWordInformationSubtitle.textContent = "Triple word";
				} else {
					UIReferences.singleWordInformationSubtitle.textContent = "Used " + totalOccurrences + " times";

					var concordanceStrings = [
						["This verse", occurrencesInVerse + (occurrencesInVerse > 1 ? " times" : " time")],
						["This section", occurrencesInSection + (occurrencesInSection > 1 ? " times" : " time")],
						["This chapter", occurrencesInChapter + (occurrencesInChapter > 1 ? " times" : " time")],
						["This book", occurrencesInBook + (occurrencesInBook > 1 ? " times" : " time")],
					];

					for (var i = 0; i < concordanceStrings.length; i++) {
						var containerElement = document.createElement("div");
						containerElement.classList.add("concordanceInformationItem");

						switch (i) {
							case 0:
								containerElement.classList.add("thisVerse");
								break;
							case 1:
								containerElement.classList.add("thisSection");
								containerElement.onclick = function () {
									UIReferences.singleWordInformationContent.classList.toggle("thisSection");
									UIReferences.singleWordInformationContent.classList.remove("thisChapter");
									UIReferences.singleWordInformationContent.classList.remove("thisBook");
								};
								break;
							case 2:
								containerElement.classList.add("thisChapter");
								containerElement.onclick = function () {
									UIReferences.singleWordInformationContent.classList.toggle("thisChapter");
									UIReferences.singleWordInformationContent.classList.remove("thisSection");
									UIReferences.singleWordInformationContent.classList.remove("thisBook");
								};
								break;
							case 3:
								containerElement.classList.add("thisBook");
								containerElement.onclick = function () {
									UIReferences.singleWordInformationContent.classList.toggle("thisBook");
									UIReferences.singleWordInformationContent.classList.remove("thisSection");
									UIReferences.singleWordInformationContent.classList.remove("thisChapter");
								};
								break;
						}

						var descriptionElement = document.createElement("p");
						descriptionElement.classList.add("description");
						descriptionElement.textContent = concordanceStrings[i][0];

						var numberElement = document.createElement("h1");
						numberElement.classList.add("number");
						numberElement.textContent = concordanceStrings[i][1];

						containerElement.appendChild(descriptionElement);
						containerElement.appendChild(numberElement);

						concordanceInformationContainer.appendChild(containerElement);
					}
				}

				var currentVerseDisplayScreenVerse = new Verse(UIManager.verseDisplayScreen.currentVerseReference);
				for (var i = 0; i < totalUniqueOccurrences; i++) {
					var currentReference = uniqueConcordanceReferences[i];
					var currentReferenceVerse = new Verse(currentReference);

					var occurrenceElement = document.createElement("div");
					occurrenceElement.classList.add("occurrence");

					var occurrenceReferenceElement = document.createElement("p");
					if (currentReference === UIManager.verseDisplayScreen.currentVerseReference) {
						occurrenceReferenceElement.textContent = "This Verse";
						occurrenceElement.classList.add("thisVerse");
					} else {
						occurrenceReferenceElement.textContent = currentReference;
					}
					occurrenceReferenceElement.classList.add("reference");
					occurrenceElement.appendChild(occurrenceReferenceElement);

					//If there is more than one occurrence of this unique reference in concordanceReferences, show the occurrence count
					var occurrenceCount = 0;
					for (var j = 0; j < concordanceReferences.length; j++) {
						if (concordanceReferences[j] == currentReference) {
							occurrenceCount++;
						}
					}
					if (occurrenceCount > 1 && currentReference != UIManager.verseDisplayScreen.currentVerseReference) {
						var occurrenceCountElement = document.createElement("p");
						occurrenceCountElement.textContent += "x" + occurrenceCount;
						occurrenceCountElement.classList.add("count");
						occurrenceElement.appendChild(occurrenceCountElement);
					}

					if (currentReferenceVerse.bookName === currentVerseDisplayScreenVerse.bookName) {
						occurrenceElement.classList.add("thisBook");
						if (currentReferenceVerse.chapterNumber === currentVerseDisplayScreenVerse.chapterNumber) {
							occurrenceElement.classList.add("thisChapter");
							if (currentReferenceVerse.sectionIndex === currentVerseDisplayScreenVerse.sectionIndex) {
								occurrenceElement.classList.add("thisSection");
							}
						}
					}

					if (currentReference != UIManager.verseDisplayScreen.currentVerseReference) {
						(function (reference) {
							occurrenceElement.onclick = function () {
								UIManager.verseDisplayScreen.navigation.navigateToVerse(reference, "automatic");
							};
						})(currentReference);
					}
					referencesContainer.appendChild(occurrenceElement);
				}
			}

			UIReferences.singleWordInformationContent.appendChild(concordanceInformationContainer);
			UIReferences.singleWordInformationContent.appendChild(referencesContainer);

			//Pronoun Clarification
			var pronounClarifications = scriptureEngine.getPronounClarificationsByReference(selectedVerseReference);
			UIManager.hide(UIReferences.singleWordInformationPronounClarification);
			if (pronounClarifications) {
				//Loop through every pronoun clarifiation for the current verse
				for (var i = 0; i < pronounClarifications.length; i++) {
					var currentPronounClarification = pronounClarifications[i];
					if (currentPronounClarification.pronoun == word) {
						//The words match, but if the clarification has an index, we need to ensure the indexes match as well.
						if (currentPronounClarification.occurrence) {
							//To ensure the occurrence numbers match, we need to loop through every word of the current verse again and count up the occurrences of our word.
							var matchingWordCount = 0;
							for (var w = 0; w < allWords.length; w++) {
								var currentWord = allWords[w];
								if (currentWord.textContent == word) {
									matchingWordCount++;

									//If the matching word count is equal to the occurrence index AND the current matcing word is the selected word...
									if (matchingWordCount == currentPronounClarification.occurrence && currentWord == wordElement) {
										//...then the selected word is the correct occurrence! Party time!
										UIManager.show(UIReferences.singleWordInformationPronounClarification);
										if (currentPronounClarification.reference) {
											(function (reference) {
												UIReferences.singleWordInformationPronounClarification.onclick = function () {
													UIManager.verseDisplayScreen.navigation.navigateToVerse(reference, "automatic");
												};
											})(currentPronounClarification.reference);
											UIReferences.singleWordInformationPronounClarification.classList.add("link");
										} else {
											UIReferences.singleWordInformationPronounClarification.onclick = null;
											UIReferences.singleWordInformationPronounClarification.classList.remove("link");
										}
										UIReferences.singleWordInformationAntecedent.textContent = currentPronounClarification.antecedent;
									}
								}
							}
						} else {
							//This is the correct clarification for our word
							UIManager.show(UIReferences.singleWordInformationPronounClarification);
							if (currentPronounClarification.reference) {
								(function (reference) {
									UIReferences.singleWordInformationPronounClarification.onclick = function () {
										UIManager.verseDisplayScreen.navigation.navigateToVerse(reference, "automatic");
									};
								})(currentPronounClarification.reference);
								UIReferences.singleWordInformationPronounClarification.classList.add("link");
							} else {
								UIReferences.singleWordInformationPronounClarification.onclick = null;
								UIReferences.singleWordInformationPronounClarification.classList.remove("link");
							}
							UIReferences.singleWordInformationAntecedent.textContent = currentPronounClarification.antecedent;
						}
					}
				}
			}

			UIManager.verseDisplayScreen.showSlidePanel("singleWordInformation");
		},

		deselectAllWords: function () {
			var allWords = UIReferences.verseDisplayTextContainer.children;

			//Remove all selected or outlined classes
			for (var i = 0; i < allWords.length; i++) {
				allWords[i].classList.remove("outlined");
				allWords[i].classList.remove("selected");
				allWords[i].blur();
			}

			UIManager.verseDisplayScreen.hideSlidePanel();
		},

		showSlidePanel: function (slidePanelScreen) {
			//Show the requested slide panel screen
			switch (slidePanelScreen) {
				case "singleWordInformation":
					UIManager.show(UIReferences.slidePanelSingleWordInformation);
					break;

				case "possibleQuestions":
					UIManager.show(UIReferences.slidePanelPossibleQuestions);
					break;

				case "pronounClarification":
					//Get all pronoun clarifiations for the selected verse
					var pronounClarifications = scriptureEngine.getPronounClarificationsByReference(UIManager.verseDisplayScreen.currentVerseReference);

					//Highlight each pronoun in the verse display
					for (var i = 0; i < pronounClarifications.length; i++) {
						var currentPronounClarification = pronounClarifications[i];
						var currentPronoun = currentPronounClarification.pronoun;
						//Loop through every word of the verse display
						for (var w = 0; w < UIReferences.verseDisplayTextContainer.children.length; w++) {
							//If the current word matches the current pronoun, highlight it
							if (UIReferences.verseDisplayTextContainer.children[w].textContent == currentPronoun) {
								UIReferences.verseDisplayTextContainer.children[w].classList.add("outlined");
							}
						}
					}

					UIManager.show(UIReferences.slidePanelPronounClarification);
					break;

				case "footnotes":
					UIManager.show(UIReferences.slidePanelFootnotes);
					break;
			}

			//Apply the up class to the verseDisplay
			UIReferences.verseDisplay.classList.add("up");

			UIManager.verseDisplayScreen.setSlidePanelHeight(true);
		},

		setSlidePanelHeight: function (showSlidePanel) {
			UIManager.show(UIReferences.verseDisplayScreenHeaderContainer, 200);
			document.querySelector(".verseDisplayScreen .header").classList.remove("hidden");

			//Get the distance from the top of the screen to the bottom of the verseDisplay
			var boundingBox = UIReferences.verseDisplay.getBoundingClientRect();

			if (window.matchMedia("only screen and (max-width: 375px)").matches) {
				var distance = boundingBox.bottom - boundingBox.top + 40;
				UIReferences.slidePanel.style.top = distance + "px";
				if (UIReferences.verseDisplay.classList.contains("up")) {
					UIManager.hide(UIReferences.verseDisplayScreenHeaderContainer, 200);
					document.querySelector(".verseDisplayScreen .header").classList.add("hidden");
				}
			} else if (window.matchMedia("only screen and (max-width: 925px)").matches) {
				var distance = boundingBox.bottom - boundingBox.top + 120;
				UIReferences.slidePanel.style.top = distance + "px";
			} else {
				UIReferences.slidePanel.style.top = "auto";
			}

			if (showSlidePanel) {
				UIManager.show(UIReferences.slidePanel);
			}
		},

		hideSlidePanel: function () {
			//Remove the up class from the verseDisplay
			UIReferences.verseDisplay.classList.remove("up");
			UIManager.hide(UIReferences.slidePanel);

			//Show the verseDisplayScreen header
			UIManager.show(UIReferences.verseDisplayScreenHeaderContainer, 200);
			document.querySelector(".verseDisplayScreen .header").classList.remove("hidden");

			//Hide all slide panel screens
			for (var i = 0; i < UIReferences.slidePanel.children.length; i++) {
				UIManager.hide(UIReferences.slidePanel.children[i]);
			}

			//Reset the scroll position
			UIReferences.slidePanel.scrollTop = 0;

			//Reset the concordance filters
			UIReferences.singleWordInformationContent.classList.remove("thisSection");
			UIReferences.singleWordInformationContent.classList.remove("thisChapter");
			UIReferences.singleWordInformationContent.classList.remove("thisBook");
		},

		toolbars: {
			left: {},

			right: {
				deselectAllToolbarItems: function () {
					for (var i = 0; i < UIReferences.rightToolbar.children.length; i++) {
						var currentItem = UIReferences.rightToolbar.children[i];

						currentItem.classList.remove("active");
						currentItem.blur();
					}
				},
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

	//Redraw the slidePanel position
	UIManager.verseDisplayScreen.setSlidePanelHeight();
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
UIManager.searchByReference.populateSearchByReferenceContainer();

UIManager.setBookSelector(storageManager.get("quizCycleYear"));
