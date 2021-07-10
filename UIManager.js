const UIReferences = {

    mainScreen: document.querySelector(".mainScreen"),

    welcomeScreen: document.querySelector(".welcomeScreen"),
    addWebClipScreen: document.querySelector(".addWebClipScreen"),
    
    settingsScreen: document.querySelector(".settingsScreen"),

    searchModeSelectionScreen: document.querySelector(".searchModeSelectionScreen"),

    quizCycleYearSelector: document.querySelector(".searchModeSelectionScreen select"),

    bookSelectionContainer: document.querySelector(".bookSelectionContainer"),

    searchBarContainer: document.querySelector(".searchBarContainer"),
    searchBar: document.querySelector(".searchBar"),
    searchBarClearButton: document.querySelector(".searchBarWrapper .clearButton"),
    searchResultsContainer: document.querySelector(".searchModeSelectionScreen .searchResultsContainer"),

    chapterSelectionScreen: document.querySelector(".chapterSelectionScreen"),
    chapterNumberElementsContainer: document.querySelector(".chapterNumberElementsContainer"),

    verseSelectionScreen: document.querySelector(".verseSelectionScreen"),
    verseNumberElementsContainer: document.querySelector(".verseNumberElementsContainer"),
    
    chapterDisplayScreen: document.querySelector(".chapterDisplayScreen"),
    chapterDisplayScreenTitle: document.querySelector(".chapterDisplayScreen .titleContainer .title"),
    chapterDisplayScreenContent: document.querySelector(".chapterDisplayScreen .content"),

    verseDisplayScreen: document.querySelector(".verseDisplayScreen"),
    verseDisplayScreenBackgroundOverlay: document.querySelector(".verseDisplayScreenBackgroundOverlay"),
    
    verseDisplayScreenCloseButton: document.querySelector(".verseDisplayScreen .closeButton"),
    verseDisplayScreenBackButton: document.querySelector(".verseDisplayScreen .backButton"),
    
    verseDisplayScreenMiniTitle: document.querySelector(".verseDisplayScreen .miniVerseTitleContainer .title"),
    verseDisplayScreenMiniSubtitle: document.querySelector(".verseDisplayScreen .miniVerseTitleContainer .subtitle"),
    verseDisplayScreenMiniSubtitleTag: document.querySelector(".verseDisplayScreen .miniVerseTitleContainer .subtitle .tag"),
    verseDisplayScreenMiniSubtitleText: document.querySelector(".verseDisplayScreen .miniVerseTitleContainer .subtitle .text"),
    
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
    singleWordInformationRareWord: document.querySelector(".slidePanel .singleWordInformation .content .rareWord"),
    singleWordInformationRegularWord: document.querySelector(".slidePanel .singleWordInformation .content .regularWord"),

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

}

const UIManager = {

    hide: function (element, transitionTime) {

        //If no transition time is provided, just add the hidden class
        if (transitionTime) {

            element.classList.add("hidden");

            //Wait for the transition to complete, then force the element to hide
            setTimeout(function () {
                element.classList.add("requireDisplayNone");
            }, transitionTime);

        } else {

            element.classList.add("hidden");

        }

    },
    show: function (element, transitionTime) {

        //If no transition time is provided, just remove the hidden class
        if (transitionTime) {

            //If the element was hidden before, we'll need to make sure that requireDisplayNone is removed in order to show the animation.
            element.classList.remove("requireDisplayNone");

            requestAnimationFrame(function () {
                element.classList.remove("hidden");
            });

        } else {

            element.classList.remove("hidden");

        }

    },

    buttonHandlers: {

        flyswatterButton: function () {

            var mailtoURL = "mailto:quizwell@icloud.com?subject=Content%20Judge%3A%20Bug%20Report&body=Please%20mention%20as%20much%20as%20possible%20about%20the%20bug%20or%20content%20error%20you%20are%20experiencing%2E";
            
            window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);

        },

        hideWelcomeScreen: function () {

            //If the browser is running on iPhone or iPad and is not mobile Chrome, and if the page is not running as a Web Clip already, show the Web Clip prompt screen to encourage the user to add it to his home screen.
            if (
                (window.navigator.userAgent.match(/iP(ad|hone)/i)) && !(window.navigator.userAgent.match(/CriOS/i)) && !window.navigator.standalone
            ) {

                UIManager.show(UIReferences.addWebClipScreen, 200);

            } else {

                UIManager.show(UIReferences.searchModeSelectionScreen, 200);

            }

        },
        hideAddWebClipScreen: function () {

            UIManager.show(UIReferences.searchModeSelectionScreen, 200);

        },
        
        showSettingsScreen: function () {
            
            UIManager.settingsScreen.populateAndShowSettingsScreen();
            
        },
        closeSettingsScreen: function () {
            
            UIManager.settingsScreen.closeSettingsScreen();
            
        },

        closeSearchModeSelectionScreen: function () {

            UIManager.hide(UIReferences.addWebClipScreen, 200);
            UIManager.hide(UIReferences.searchModeSelectionScreen, 200);

        },

        closeChapterSelectionScreen: function () {

            UIManager.hide(UIReferences.chapterSelectionScreen, 200);

        },
        closeVerseSelectionScreen: function () {

            UIManager.hide(UIReferences.verseSelectionScreen, 200);

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

        }

    },

    searchBarHandlers: {

        onfocus: function () {

            UIManager.show(UIReferences.searchBarClearButton, 200);
            UIReferences.searchModeSelectionScreen.classList.add("searchBarActive");

        },

        onblur: function () {

            if (UIReferences.searchBar.value == "") {

                UIManager.hide(UIReferences.searchBarClearButton, 200);
                UIReferences.searchModeSelectionScreen.classList.remove("searchBarActive");
            }

        },
        
        oninput: function () {
            
            if (storageManager.get("useInstantSearch")) {
                UIManager.searchBarHandlers.onchange();
            }
            
        },

        onchange: function () {

            var inputElement = UIReferences.searchBar;
            var input = UIReferences.searchBar.value;

            //Remove all current search results
            while (UIReferences.searchResultsContainer.firstChild) {

                UIReferences.searchResultsContainer.removeChild(UIReferences.searchResultsContainer.firstChild);

            }

            if (input == "") {
                return;
            }

            var contentSearchResults = scriptureEngine.getVersesByContent(input, true);

            if (contentSearchResults.length > 0) {
            
                //Loop through every search result and create an element for each
                for (var i = 0; i < contentSearchResults.length; i++) {

                    var currentSearchResult = contentSearchResults[i];

                    var listItemElement = document.createElement("div");
                    listItemElement.classList.add("listItem");
                    (function (reference) {
                        listItemElement.onclick = function () {

                            UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(reference);

                        }
                    })(currentSearchResult.reference)

                    var referenceElement = document.createElement("h1");
                    referenceElement.classList.add("reference");
                    referenceElement.textContent = currentSearchResult.reference;

                    var contentElement = document.createElement("p");
                    contentElement.classList.add("content");
                    contentElement.textContent = scriptureEngine.getVerseByReference(currentSearchResult.reference);

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

            UIReferences.searchBar.value = "";
            UIReferences.searchBar.blur();
            UIManager.searchBarHandlers.oninput();
            UIManager.searchBarHandlers.onblur();

        }

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
                UIManager.settingsScreen.settingUpdateHandlers[settingsUpdateHandlersKeys]()
            }
            
            //Hide the screen
            UIManager.hide(UIReferences.settingsScreen, 200);
            
        },
        
        settingUpdateHandlers: {
            
            updateRareWordHighlightColors: function () {
                
                document.documentElement.style.setProperty("--unique-word-highlight-color", storageManager.get("uniqueWordHighlightColor"));
                document.documentElement.style.setProperty("--double-word-highlight-color", storageManager.get("doubleWordHighlightColor"));
                document.documentElement.style.setProperty("--triple-word-highlight-color", storageManager.get("tripleWordHighlightColor"));
                
            }
            
        },
        
        resetButtonHandlers: {
            
            resetRareWordHighlightColors: function () {
                
                var computedStyle = getComputedStyle(document.body);
                
                storageManager.set("uniqueWordHighlightColor", computedStyle.getPropertyValue("--orange-color").trim());
                storageManager.set("doubleWordHighlightColor", computedStyle.getPropertyValue("--blue-color").trim());
                storageManager.set("tripleWordHighlightColor", computedStyle.getPropertyValue("--purple-color").trim());
                
                UIManager.settingsScreen.settingUpdateHandlers.updateRareWordHighlightColors();
                UIManager.settingsScreen.populateAndShowSettingsScreen();
                
            }
            
        }
        
    },

    bookSelectorHandler: function () {

        var selectElement = UIReferences.quizCycleYearSelector;
        var value = selectElement.value;

        var selectedBook = scriptureEngine.getYearByAbbreviation(value);

        storageManager.set("quizCycleYear", selectedBook);
        scriptureEngine.currentYearObject = window[selectedBook];
        UIManager.searchByReference.populateSearchByReferenceContainer();

        UIManager.searchBarHandlers.clearSearchBar();

    },

    setBookSelector: function (bookObjectName) {

        var abbreviation = scriptureEngine.getYearAbbreviationByName(bookObjectName);

        UIReferences.quizCycleYearSelector.value = abbreviation;

    },

    bannerNotificationManager: {

        queue: [],
        isRendering: false,

        timer: function (ms) {
            return new Promise(res => setTimeout(res, ms));
        },

        notificationElement: document.querySelector(".bannerNotification"),
        titleElement: document.querySelector(".bannerNotification .title"),
        subtitleElement: document.querySelector(".bannerNotification .subtitle"),

        showMessage: function (title, subtitle, extended) {

            this.queue.push({
                title: title,
                subtitle: subtitle,
                extended: extended
            });
            if (!this.isRendering) {
                this.render();
            }

        },

        render: async function () {

            this.isRendering = true;

            while (this.queue[0]) {

                var currentItem = this.queue[0];

                this.titleElement.textContent = currentItem.title;
                this.subtitleElement.textContent = currentItem.subtitle;

                this.notificationElement.classList.remove("hidden");

                this.queue.shift();

                if (currentItem.extended) {

                    await this.timer(6000);

                } else {

                    await this.timer(2000);

                }

            }

            this.notificationElement.classList.add("hidden");
            this.isRendering = false;

        }

    },

    searchByReference: {

        currentSearchObject: {
            bookAbbreviation: undefined,
            chapter: undefined,
            verse: undefined
        },

        populateAndShowChapterSelectionScreen: function () {

            //Clear the current items in the screen
            while (UIReferences.chapterNumberElementsContainer.firstChild) {
                UIReferences.chapterNumberElementsContainer.removeChild(UIReferences.chapterNumberElementsContainer.firstChild);
            }

            var bookAbbreviation = UIManager.searchByReference.currentSearchObject.bookAbbreviation;
            var selectedBookObject = scriptureEngine.getBookByAbbreviation(bookAbbreviation);

            var numberOfChapters = selectedBookObject.chapters.length;
            for (var i = 0; i < numberOfChapters; i++) {

                var chapterNumberElement = document.createElement("div");
                chapterNumberElement.classList.add("chapterNumberElement");
                chapterNumberElement.classList.add("numberElement");
                chapterNumberElement.textContent = (i + 1);
                (function (chapterNumber) {

                    chapterNumberElement.onclick = function () {

                        UIManager.searchByReference.currentSearchObject.chapter = chapterNumber;
                        UIManager.searchByReference.populateAndShowVerseSelectionScreen();

                    }

                })(i + 1)

                UIReferences.chapterNumberElementsContainer.appendChild(chapterNumberElement);

            }

            //Show screen
            UIManager.show(UIReferences.chapterSelectionScreen, 200);

        },

        populateAndShowVerseSelectionScreen: function () {

            //Clear the current items in the screen
            while (UIReferences.verseNumberElementsContainer.firstChild) {
                UIReferences.verseNumberElementsContainer.removeChild(UIReferences.verseNumberElementsContainer.firstChild);
            }

            var selectedBook = scriptureEngine.getBookByAbbreviation(UIManager.searchByReference.currentSearchObject.bookAbbreviation);
            var chapterNumber = UIManager.searchByReference.currentSearchObject.chapter;

            var numberOfVerses = scriptureEngine.getVerseCountFromChapter(selectedBook.chapters[chapterNumber - 1]);
            for (var i = 0; i < numberOfVerses; i++) {

                var verseNumberElement = document.createElement("div");
                verseNumberElement.classList.add("verseNumberElement");
                verseNumberElement.classList.add("numberElement");
                verseNumberElement.textContent = (i + 1);
                (function (verseNumber) {

                    verseNumberElement.onclick = function () {

                        UIManager.searchByReference.currentSearchObject.verse = verseNumber;

                        var bookAbbreviation = UIManager.searchByReference.currentSearchObject.bookAbbreviation;
                        var chapterNumber = UIManager.searchByReference.currentSearchObject.chapter;

                        var referenceString = bookAbbreviation + " " + chapterNumber + ":" + verseNumber;

                        UIManager.verseDisplayScreen.populateAndShowVerseDisplayScreen(referenceString);

                    }

                })(i + 1)

                UIReferences.verseNumberElementsContainer.appendChild(verseNumberElement);

            }

            //Show screen
            UIManager.show(UIReferences.verseSelectionScreen, 200);

        },

        populateSearchByReferenceContainer: function () {

            //Clear
            while (UIReferences.bookSelectionContainer.children[1]) {
                UIReferences.bookSelectionContainer.removeChild(UIReferences.bookSelectionContainer.lastChild);
            }

            //Populate
            var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);
            for (var i = 0; i < currentYearBooksKeys.length; i++) {

                var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
                var currentBookName = currentYearBooksKeys[i];

                var bookSelectionElement = document.createElement("div");
                bookSelectionElement.classList.add("bookSelectionElement");
                (function (bookAbbreviation) {
                    bookSelectionElement.onclick = function () {

                        UIManager.searchByReference.currentSearchObject.bookAbbreviation = bookAbbreviation;
                        UIManager.searchByReference.populateAndShowChapterSelectionScreen();

                    }
                })(currentBook.abbreviation)

                var bookSelectionElementIcon = document.createElement("h1");
                bookSelectionElementIcon.classList.add("icon");
                bookSelectionElementIcon.textContent = currentBook.abbreviation;

                var bookSelectionElementLabel = document.createElement("p");
                bookSelectionElementLabel.classList.add("label");
                bookSelectionElementLabel.textContent = currentBookName;

                bookSelectionElement.appendChild(bookSelectionElementIcon);
                bookSelectionElement.appendChild(bookSelectionElementLabel);

                UIReferences.bookSelectionContainer.appendChild(bookSelectionElement);

            }


        }

    },
    
    chapterDisplayScreen: {
        
        populateAndShowChapterDisplayScreen: function (reference) {
            
            //Clear current content of the screen
            while (UIReferences.chapterDisplayScreenContent.firstChild) {
                UIReferences.chapterDisplayScreenContent.removeChild(UIReferences.chapterDisplayScreenContent.firstChild);
            }
            
            UIReferences.chapterDisplayScreenTitle.textContent = scriptureEngine.unabbreviateBookNamesInString(reference);
            
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

                //Loop through each verse
                for (var v = 0; v < currentSection.verses.length; v++) {
                    
                    verseCount++;
                    
                    var currentVerse = currentSection.verses[v];
                    var currentVerseReference = reference + ":" + verseCount;
                    
                    var currentVerseElement = document.createElement("li");
                    currentVerseElement.classList.add("verse");
                    currentVerseElement.textContent = currentVerse;
                    
                    var memoryVerseStatus = scriptureEngine.getMemoryVerseStatusByReference(currentVerseReference);
                    if (memoryVerseStatus.match) {
                        
                        currentVerseElement.classList.add("memory");
                        
                        if (memoryVerseStatus.startVerse === currentVerseReference) {
                            
                            //Get the prejump
                            var verseType = (memoryVerseStatus.type == "single") ? "singles" : "multiples";
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
                        }
                        
                    })(currentVerseReference)
                    
                    sectionVersesContainerElement.appendChild(currentVerseElement);
                    
                }
                
                UIReferences.chapterDisplayScreenContent.appendChild(sectionContainerElement);

            }
            
            UIManager.show(UIReferences.chapterDisplayScreen, 200);
            
        },
        
        closeChapterDisplayScreen: function (preserveScreenHeirarchy) {
            
            if (preserveScreenHeirarchy) {

                UIManager.hide(UIReferences.chapterDisplayScreen, 200);

            } else {

                UIManager.hide(UIReferences.chapterSelectionScreen, 200);
                UIManager.hide(UIReferences.verseSelectionScreen, 200);
                UIManager.hide(UIReferences.chapterDisplayScreen, 200);

            }
            
        }
        
    },

    verseDisplayScreen: {
        
        currentVerseReference: null,

        navigation: {
            
            navigationStack: [],

            navigateToVerse: function (reference, backwards, preserveStack) {

                //Add the reference to the navigation stack, unless preserveStack is true
                if (!preserveStack) {
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
                    
                    normalLeft: "translate(-100px, -50%)",
                    normalRight: "translate(100px, -50%)",
                    upLeft: "translate(-100px, 0)",
                    upRight: "translate(100px, 0)",
                    
                }
                var verseDisplayIsUp = UIReferences.verseDisplay.classList.contains("up");
                
                var closeSlidePanel = !UIReferences.slidePanelSingleWordInformation.classList.contains("hidden");

                //Disable transitions on the verse display
                UIReferences.verseDisplay.style.transition = "none";

                requestAnimationFrame(function () {

                    UIReferences.verseDisplay.style.removeProperty("transition");

                    //Fade out the verse display, slide panel screens, and verse information.
                    UIReferences.verseDisplay.style.opacity = 0;
                    UIReferences.slidePanelPossibleQuestions.style.opacity = 0;
                    UIReferences.slidePanelPronounClarification.style.opacity = 0;
                    UIReferences.slidePanelFootnotes.style.opacity = 0;
                    UIReferences.verseDisplayScreenTitle.style.opacity = 0;
                    UIReferences.verseDisplayScreenSubtitle.style.opacity = 0;
                    UIReferences.verseDisplayScreenMiniTitle.style.opacity = 0;
                    UIReferences.verseDisplayScreenMiniSubtitle.style.opacity = 0;
                    
                    if (backwards && verseDisplayIsUp) {
                        UIReferences.verseDisplay.style.transform = transformProperties.upRight;
                    } else if (backwards && !verseDisplayIsUp) {
                        UIReferences.verseDisplay.style.transform = transformProperties.normalRight;
                    } else if (!backwards && verseDisplayIsUp) {
                        UIReferences.verseDisplay.style.transform = transformProperties.upLeft;
                    } else if (!backwards && !verseDisplayIsUp) {
                        UIReferences.verseDisplay.style.transform = transformProperties.normalLeft;
                    }
                    
                    //Refresh the back button
                    UIManager.verseDisplayScreen.updateBackButtonState();

                    setTimeout(function () {
                        
                        // 1/4 Remove the transition from the verseDisplay
                        UIReferences.verseDisplay.style.transition = "none";
                        
                        requestAnimationFrame(function () {

                            // 2/4 If the single word information panel is showing, close the slide panel with an opacity transition.
                            if (closeSlidePanel) {
                                UIReferences.slidePanel.style.opacity = 0;
                                UIReferences.verseDisplay.classList.remove("up");
                                setTimeout(function () {

                                    //Remove the transition
                                    UIReferences.slidePanel.style.transition = "none";
                                    
                                    requestAnimationFrame(function () {
                                        UIReferences.slidePanel.classList.add("hidden");
                                        UIReferences.slidePanel.style.removeProperty("opacity");
                                        
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
                                
                                //Move the verse display to the opposite side
                                verseDisplayIsUp = UIReferences.verseDisplay.classList.contains("up");

                                if (backwards && verseDisplayIsUp) {
                                    UIReferences.verseDisplay.style.transform = transformProperties.upLeft;
                                } else if (backwards && !verseDisplayIsUp) {
                                    UIReferences.verseDisplay.style.transform = transformProperties.normalLeft;
                                } else if (!backwards && verseDisplayIsUp) {
                                    UIReferences.verseDisplay.style.transform = transformProperties.upRight;
                                } else if (!backwards && !verseDisplayIsUp) {
                                    UIReferences.verseDisplay.style.transform = transformProperties.normalRight;
                                }
                                
                                setTimeout(function () {
                                    
                                    //Animate the slide panel screens and verse information back in
                                    UIReferences.verseDisplayScreenTitle.removeAttribute("style");
                                    UIReferences.verseDisplayScreenSubtitle.removeAttribute("style");
                                    UIReferences.verseDisplayScreenMiniTitle.removeAttribute("style");
                                    UIReferences.verseDisplayScreenMiniSubtitle.removeAttribute("style");
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
                
            }
            
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

                UIManager.hide(UIReferences.chapterSelectionScreen, 200);
                UIManager.hide(UIReferences.verseSelectionScreen, 200);
                UIManager.hide(UIReferences.verseDisplayScreen, 200);

            }

            //Hide the slide panel
            setTimeout(function () {
                UIManager.verseDisplayScreen.hideSlidePanel();
                UIManager.verseDisplayScreen.toolbars.right.deselectAllToolbarItems();
            }, 200);

        },

        populateAndShowVerseDisplayScreen: function (referenceString) {
            
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
            UIReferences.verseDisplayScreenTitle.textContent = scriptureEngine.unabbreviateBookNamesInString(referenceString);
            UIReferences.verseDisplayScreenMiniTitle.textContent = referenceString;

            //Disable both neighboring verse buttons
            UIReferences.verseDisplayScreenPreviousVerseButton.setAttribute("disabled", "disabled");
            UIReferences.verseDisplayScreenNextVerseButton.setAttribute("disabled", "disabled");
            
            UIReferences.verseDisplayScreenPreviousVerseButton.onclick = null;
            UIReferences.verseDisplayScreenNextVerseButton.onclick = null;

            //Get the neighboring verses. Selectively enable the buttons.
            var previousVerse = scriptureEngine.getNeighboringVerse(referenceString, "previous");
            var nextVerse = scriptureEngine.getNeighboringVerse(referenceString, "next");

            if (previousVerse) {
                UIReferences.verseDisplayScreenPreviousVerseButton.onclick = function () {
                    
                    UIManager.verseDisplayScreen.navigation.navigateToVerse(previousVerse, true)
                    
                };
                UIReferences.verseDisplayScreenPreviousVerseButton.removeAttribute("disabled");
            }
            if (nextVerse) {
                UIReferences.verseDisplayScreenNextVerseButton.onclick = function () {
                    
                    UIManager.verseDisplayScreen.navigation.navigateToVerse(nextVerse);
                    
                };
                UIReferences.verseDisplayScreenNextVerseButton.removeAttribute("disabled");
            }

            //Populate the verse display
            var verse = scriptureEngine.getVerseByReference(referenceString);
            var wordsInVerse = verse.split(" ");

            //For each word in the verse, create an element in the verse display
            for (var i = 0; i < wordsInVerse.length; i++) {

                var currentWordElement = document.createElement("p");
                currentWordElement.textContent = wordsInVerse[i].replaceAll(/(\[[a-z]\])/g, "");

                //If the current word is just a punctuation mark (a hyphen, for example), don't allow the user to select it, and don't apply the hover styling to imply such.
                if (!scriptureEngine.filterWord(currentWordElement.textContent, true)) {

                    currentWordElement.classList.add("notSelectable");

                } else {

                    //Because this code is within the else block of the previous if statement, it will only run if the word is not punctuation

                    //If the current word is a unique word, double word, or triple word, apply the appropriate class
                    var numberOfOccurences = scriptureEngine.currentYearObject.concordance[scriptureEngine.filterWord(currentWordElement.textContent, true)].references.length;
                    switch (numberOfOccurences) {

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

                        }
                    })(currentWordElement)

                }
                
                //See if there's a footnote reference in the word. If so, create a seperate element for the footnote
                var matchesForFootnoteRegex = wordsInVerse[i].match(/(\[[a-z]\])/g);
                var footnoteReferenceElements = [];
                if (matchesForFootnoteRegex) {
                    
                    //There are footnote references in the word
                    
                    currentWordElement.classList.add("containsFootnoteReference");
                    
                    for (var f = 0; f < matchesForFootnoteRegex.length; f++) {
                        
                        var currentWordFootnoteReferenceElement = document.createElement("p");
                        currentWordFootnoteReferenceElement.classList.add("footnoteReference");
                        currentWordFootnoteReferenceElement.textContent = matchesForFootnoteRegex[f];
                        currentWordFootnoteReferenceElement.onclick = function () {
                            UIManager.buttonHandlers.footnotesButton();
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
            var memoryVerseStatus = scriptureEngine.getMemoryVerseStatusByReference(referenceString);
            if (memoryVerseStatus.match) {

                //Show memory indicator
                UIReferences.verseDisplayScreenSubtitleText.textContent = memoryVerseStatus.reference;
                UIReferences.verseDisplayScreenMiniSubtitleText.textContent = memoryVerseStatus.reference;
                UIManager.show(UIReferences.verseDisplayScreenSubtitle);
                UIManager.show(UIReferences.verseDisplayScreenMiniSubtitle);

                //Get the prejump
                var verseType = (memoryVerseStatus.type == "single") ? "singles" : "multiples";
                var prejump = scriptureEngine.currentYearObject.prejumps[verseType][memoryVerseStatus.memoryIndex];

                //Split prejump into words
                prejump = prejump.split(" ");
                for (var i = 0; i < prejump.length; i++) {

                    UIReferences.verseDisplayTextContainer.children[i].classList.add("prejump");

                }

            } else {

                UIManager.hide(UIReferences.verseDisplayScreenSubtitle);
                UIManager.hide(UIReferences.verseDisplayScreenMiniSubtitle);

            }

            //Clear and repopulate the pronoun clarification slide panel screen
            while (UIReferences.pronounClarificationContent.firstChild) {
                UIReferences.pronounClarificationContent.removeChild(UIReferences.pronounClarificationContent.firstChild);
            }

            var pronounClarifications = scriptureEngine.getPronounClarificationsByReference(referenceString);
            if (pronounClarifications) {

                for (var i = 0; i < pronounClarifications.length; i++) {

                    var currentClarification = pronounClarifications[i];

                    //Create the elements

                    var element = document.createElement("div");
                    element.classList.add("listItem");
                    if (currentClarification.reference) {
                        (function (reference) {
                            element.onclick = function () {
                                UIManager.verseDisplayScreen.navigation.navigateToVerse(reference, "automatic");
                            }
                        })(currentClarification.reference)
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
                    if (currentClarification.reference) {
                        reference.textContent = scriptureEngine.unabbreviateBookNamesInString(currentClarification.reference);
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

            //Find all other occurences of the same word in the current verse
            var allOtherOccurences = [];
            var allWords = UIReferences.verseDisplayTextContainer.children;
            for (var i = 0; i < allWords.length; i++) {

                //If the element contains the same word and isn't the original selected element, add it to the array.
                if (
                    (scriptureEngine.filterWord(allWords[i].textContent, true) == filteredWord) &&
                    (allWords[i] != wordElement)
                ) {
                    allOtherOccurences.push(allWords[i]);
                }

            }

            //Add the outlined class to all the other occurences
            for (var i = 0; i < allOtherOccurences.length; i++) {

                allOtherOccurences[i].classList.add("outlined");

            }

            //Get concordance information for the word
            var selectedVerseReference = UIManager.verseDisplayScreen.currentVerseReference;

            var concordanceReferences = scriptureEngine.currentYearObject.concordance[filteredWord].references;

            var totalOccurrences = concordanceReferences.length;
            var occurrencesInVerse = (allOtherOccurences.length + 1);
            var occurrencesInSection = 0;
            var occurrencesInChapter = 0;
            var occurrencesInBook = 0;

            //Loop through every concordance reference, and increment each count as needed
            for (var i = 0; i < concordanceReferences.length; i++) {

                var currentReference = concordanceReferences[i];

                //Occurrences in book
                var currentReferenceBookAbbreviation = currentReference.slice(0, 1);
                var selectedVerseBookAbbreviation = selectedVerseReference.slice(0, 1);
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
                    var currentReferenceSectionNumber = scriptureEngine.getSectionNumberFromReference(currentReference);
                    var selectedVerseSectionNumber = scriptureEngine.getSectionNumberFromReference(selectedVerseReference);
                    if (currentReferenceSectionNumber == selectedVerseSectionNumber) {
                        occurrencesInSection++;
                    }
                }

            }

            //Capitalize the first letter of the word
            var capitalizedWord = (filteredWord.slice(0, 1).toUpperCase() + filteredWord.slice(1));

            //Give each UI element its proper value
            UIManager.show(UIReferences.singleWordInformationRareWord);
            UIManager.show(UIReferences.singleWordInformationRegularWord);

            UIReferences.singleWordInformationTitle.textContent = capitalizedWord;

            switch (totalOccurrences) {

                case 1:
                    UIReferences.singleWordInformationSubtitle.textContent = "Unique word";
                    UIManager.hide(UIReferences.singleWordInformationRareWord);
                    UIManager.hide(UIReferences.singleWordInformationRegularWord);
                    break;

                case 2:
                    UIReferences.singleWordInformationSubtitle.textContent = "Double word";
                    UIManager.hide(UIReferences.singleWordInformationRegularWord);

                    UIReferences.singleWordInformationRareWord.children[1].textContent = concordanceReferences.join(", ");
                    break;

                case 3:
                    UIReferences.singleWordInformationSubtitle.textContent = "Triple word";
                    UIManager.hide(UIReferences.singleWordInformationRegularWord);

                    UIReferences.singleWordInformationRareWord.children[1].textContent = concordanceReferences.join(", ");
                    break;

                default:
                    UIReferences.singleWordInformationSubtitle.textContent = "Used " + totalOccurrences + " times";
                    UIManager.hide(UIReferences.singleWordInformationRareWord);

                    UIReferences.singleWordInformationRegularWord.children[0].textContent = "In this verse: " + occurrencesInVerse + ((occurrencesInVerse > 1) ? " times" : " time");
                    UIReferences.singleWordInformationRegularWord.children[1].textContent = "In this section: " + occurrencesInSection + ((occurrencesInSection > 1) ? " times" : " time");
                    UIReferences.singleWordInformationRegularWord.children[2].textContent = "In this chapter: " + occurrencesInChapter + ((occurrencesInChapter > 1) ? " times" : " time");
                    UIReferences.singleWordInformationRegularWord.children[3].textContent = "In this book: " + occurrencesInBook + ((occurrencesInBook > 1) ? " times" : " time");
                    break;

            }

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
                                    if (
                                        (matchingWordCount == currentPronounClarification.occurrence) &&
                                        (currentWord == wordElement)
                                    ) {

                                        //...then the selected word is the correct occurrence! Party time!
                                        UIManager.show(UIReferences.singleWordInformationPronounClarification);
                                        UIReferences.singleWordInformationAntecedent.textContent = currentPronounClarification.antecedent;

                                    }
                                }

                            }

                        } else {

                            //This is the correct clarification for our word
                            UIManager.show(UIReferences.singleWordInformationPronounClarification);
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

            }

            UIManager.verseDisplayScreen.hideSlidePanel();

        },

        showSlidePanel: function (slidePanelScreen) {

            //Hide all slide panel screens
            for (var i = 0; i < UIReferences.slidePanel.children.length; i++) {

                UIManager.hide(UIReferences.slidePanel.children[i]);

            }

            //Show the requested slide panel screen
            switch (slidePanelScreen) {

                case "singleWordInformation":
                    UIManager.show(UIReferences.slidePanelSingleWordInformation);
                    break;

                case "possibleQuestions":
                    UIManager.show(UIReferences.slidePanelPossibleQuestions);
                    break;

                case "pronounClarification":
                    UIManager.show(UIReferences.slidePanelPronounClarification);
                    break;

                case "footnotes":
                    UIManager.show(UIReferences.slidePanelFootnotes);
                    break;

            }

            //Apply the up class to the verseDisplay
            UIReferences.verseDisplay.classList.add("up");

            UIManager.verseDisplayScreen.setSlidePanelHeight();

        },
        
        setSlidePanelHeight: function () {
            
            //Get the distance from the top of the screen to the bottom of the verseDisplay
            var boundingBox = UIReferences.verseDisplay.getBoundingClientRect();
            
            if (window.matchMedia("only screen and (max-width: 695px)").matches) {
                var distance = ((boundingBox.bottom - boundingBox.top) + 190);
            } else {
                var distance = ((boundingBox.bottom - boundingBox.top) + 140);
            }

            //Set the top of the sliding panel
            UIReferences.slidePanel.style.top = (distance + "px");
            UIManager.show(UIReferences.slidePanel);
            
        },

        hideSlidePanel: function () {

            //Remove the up class from the verseDisplay
            UIReferences.verseDisplay.classList.remove("up");

            UIManager.hide(UIReferences.slidePanel);

        },

        toolbars: {

            left: {



            },

            right: {

                deselectAllToolbarItems: function () {

                    for (var i = 0; i < UIReferences.rightToolbar.children.length; i++) {

                        var currentItem = UIReferences.rightToolbar.children[i];

                        currentItem.classList.remove("active");

                    }

                }

            }

        }

    }

}

//Set up events for all checkboxes
var checkboxes = document.querySelectorAll(".checkbox");
for (var i = 0; i < checkboxes.length; i++) {
    
    var currentCheckbox = checkboxes[i];
    
    (function (checkbox) {
        checkbox.addEventListener("click", function () {
            checkbox.classList.toggle("checked");
        });
    })(currentCheckbox)
    
}

//Update rare word colors
UIManager.settingsScreen.settingUpdateHandlers.updateRareWordHighlightColors();

UIManager.searchByReference.populateSearchByReferenceContainer();
UIManager.setBookSelector(storageManager.get("quizCycleYear"));