storageManager.setDefault("quizCycleYear", "Luke");

var scriptureEngine = {
	currentYearObject: undefined,

	getVerseByReference: function (reference) {
		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapter = book.chapters[reference[0] - 1];

		var verseNumber = reference[1];
		var cumulativeVerseCount = 0;
		var verseCountsBySection = [];

		for (var i = 0; i < chapter.sections.length; i++) {
			var currentSection = chapter.sections[i];
			cumulativeVerseCount += currentSection.verses.length;

			// If the cumulative verse count is greater than our verse number, the verse must be in this section.
			if (verseNumber <= cumulativeVerseCount) {
				//The verse we need can be found by taking the verse number and subtracting the numbers of verses in the previous sections.
				for (var ii = 0; ii < verseCountsBySection.length; ii++) {
					verseNumber -= verseCountsBySection[ii];
				}

				//Subtract 1 from the verse number to get the index
				return currentSection.verses[verseNumber - 1];
			}

			verseCountsBySection.push(currentSection.verses.length);
		}
	},

	getFootnotesByContent: function (query, useAdvancedSearch) {
		//Define advanced search functions now for possible use later
		function parse(input) {
			var andMatches = input.match(/ \++ /g);
			var orMatches = input.match(/ \/+ /g);

			var andLongestLength = 0;
			var orLongestLength = 0;
			var andSearchRegex;
			var orSearchRegex;

			if (andMatches) {
				andMatches.forEach((item, index) => {
					if (item.length > andLongestLength) {
						andLongestLength = item.length;
					}
				});
				andSearchRegex = new RegExp(" " + "\\+".repeat(andLongestLength - 2) + " ", "g");
			}

			if (orMatches) {
				orMatches.forEach((item, index) => {
					if (item.length > orLongestLength) {
						orLongestLength = item.length;
					}
				});
				orSearchRegex = new RegExp(" " + "\\/".repeat(orLongestLength - 2) + " ", "g");
			}

			if (andMatches || orMatches) {
				if (andLongestLength >= orLongestLength) {
					return and(...input.split(andSearchRegex));
				} else {
					return or(...input.split(orSearchRegex));
				}
			}

			return input;
		}

		function checkFootnoteFor(string) {
			if (filteredCurrentFootnote.indexOf(string) === -1) {
				return false;
			} else {
				return true;
			}
		}

		function and() {
			for (var i = 0; i < arguments.length; i++) {
				var currentArgument = parse(arguments[i]);
				if (typeof currentArgument === "string") {
					if (!checkFootnoteFor(currentArgument)) {
						return false;
					}
				} else {
					if (!currentArgument) {
						return false;
					}
				}
			}
			return true;
		}

		function or() {
			for (var i = 0; i < arguments.length; i++) {
				var currentArgument = parse(arguments[i]);
				if (typeof currentArgument === "string") {
					if (checkFootnoteFor(currentArgument)) {
						return true;
					}
				} else {
					if (currentArgument) {
						return true;
					}
				}
			}
			return false;
		}

		var results = [];

		//Find all the global NOT flags in the query string. Save them, and then remove them.
		var globalNotRegex = /(^|\s)!\w+/g;
		var globalNotMatches = query.match(globalNotRegex);
		if (globalNotMatches) {
			query = query.replaceAll(globalNotRegex, "");

			globalNotMatches.forEach((item, index, array) => {
				array[index] = item.substring(item.indexOf("!") + 1);
			});
		}

		//If the result of the previous filters is an empty string, return the results as they are
		if (scriptureEngine.filterVerse(query).length === 0) {
			return results;
		}

		function getFootnoteVerseNumber(footnoteLetter) {
			var verseCount = 0;
			for (var s = 0; s < currentChapter.sections.length; s++) {
				var currentSection = currentChapter.sections[s];
				for (var v = 0; v < currentSection.verses.length; v++) {
					verseCount++;
					var currentVerse = currentSection.verses[v];
					if (currentVerse.indexOf("[" + footnoteLetter + "]") !== -1) {
						return verseCount;
					}
				}
			}
		}

		//Loop through every book
		for (var b = 0; b < scriptureEngine.currentYearObject.books.length; b++) {
			var currentBook = scriptureEngine.currentYearObject.books[b];

			//Loop through every chapter
			for (var c = 0; c < currentBook.chapters.length; c++) {
				var currentChapter = currentBook.chapters[c];

				//Loop through every footnote
				var footnoteKeys = Object.keys(currentChapter.footnotes);
				footnoteLoop: for (var v = 0; v < footnoteKeys.length; v++) {
					var currentFootnote = currentChapter.footnotes[footnoteKeys[v]];

					var filteredCurrentFootnote = scriptureEngine.filterVerse(currentFootnote.replaceAll("_", ""), true);
					var filteredQuery = scriptureEngine.filterVerse(query, true, true);

					//Determine whether to use the advanced search algorithm or not
					if (useAdvancedSearch && filteredQuery.match(/( [/+]+ |!)/g)) {
						//Loop through each global NOT item. If there are any matches in this footnote, move to the next one.
						if (globalNotMatches) {
							for (var n = 0; n < globalNotMatches.length; n++) {
								if (filteredCurrentFootnote.indexOf(globalNotMatches[n]) !== -1) {
									continue footnoteLoop;
								}
							}
						}

						if (parse(filteredQuery)) {
							results.push({
								reference: currentBook.abbreviation + " " + (c + 1) + ":" + getFootnoteVerseNumber(footnoteKeys[v]),
								footnote: {
									letter: footnoteKeys[v],
									text: currentFootnote,
								},
							});
						}
					} else {
						filteredQuery = scriptureEngine.filterVerse(filteredQuery, true);

						//Simply check if the footnote contains the search query.
						if (filteredCurrentFootnote.indexOf(filteredQuery) !== -1) {
							results.push({
								reference: currentBook.abbreviation + " " + (c + 1) + ":" + getFootnoteVerseNumber(footnoteKeys[v]),
								footnote: {
									letter: footnoteKeys[v],
									text: currentFootnote,
								},
							});
						}
					}
				}
			}
		}

		return results;
	},

	getVersesByContent: function (query, useAdvancedSearch, forceSearch) {
		//Define advanced search functions now for possible use later
		function parse(input) {
			var andMatches = input.match(/ \++ /g);
			var orMatches = input.match(/ \/+ /g);

			var andLongestLength = 0;
			var orLongestLength = 0;
			var andSearchRegex;
			var orSearchRegex;

			if (andMatches) {
				andMatches.forEach((item, index) => {
					if (item.length > andLongestLength) {
						andLongestLength = item.length;
					}
				});
				andSearchRegex = new RegExp(" " + "\\+".repeat(andLongestLength - 2) + " ", "g");
			}

			if (orMatches) {
				orMatches.forEach((item, index) => {
					if (item.length > orLongestLength) {
						orLongestLength = item.length;
					}
				});
				orSearchRegex = new RegExp(" " + "\\/".repeat(orLongestLength - 2) + " ", "g");
			}

			if (andMatches || orMatches) {
				if (andLongestLength >= orLongestLength) {
					return and(...input.split(andSearchRegex));
				} else {
					return or(...input.split(orSearchRegex));
				}
			}

			return input;
		}

		function checkVerseFor(string) {
			if (filteredCurrentVerse.indexOf(string) === -1) {
				return false;
			} else {
				return true;
			}
		}

		function and() {
			for (var i = 0; i < arguments.length; i++) {
				var currentArgument = parse(arguments[i]);
				if (typeof currentArgument === "string") {
					if (!checkVerseFor(currentArgument)) {
						return false;
					}
				} else {
					if (!currentArgument) {
						return false;
					}
				}
			}
			return true;
		}

		function or() {
			for (var i = 0; i < arguments.length; i++) {
				var currentArgument = parse(arguments[i]);
				if (typeof currentArgument === "string") {
					if (checkVerseFor(currentArgument)) {
						return true;
					}
				} else {
					if (currentArgument) {
						return true;
					}
				}
			}
			return false;
		}

		var results = [];

		//If the query contains any references, return those verse as the first results
		if (storageManager.get("useSmartSearch")) {
			var referencesInQuery = scriptureEngine.findReferencesInString(query);
			for (var r = 0; r < referencesInQuery.length; r++) {
				results.push({
					reference: referencesInQuery[r],
					memory: new Verse(referencesInQuery[r]).memory,
				});
			}

			//Remove all references from the string
			query = query.replaceAll(/\w+ \d+:\d+(-\d+)?/gi, "");
		}

		//Find all the global NOT flags in the query string. Save them, and then remove them.
		var globalNotRegex = /(^|\s)!\w+/g;
		var globalNotMatches = query.match(globalNotRegex);
		if (globalNotMatches) {
			query = query.replaceAll(globalNotRegex, "");

			globalNotMatches.forEach((item, index, array) => {
				array[index] = item.substring(item.indexOf("!") + 1);
			});
		}

		//If the result of the previous filters is an empty string, return the results as they are
		if (!forceSearch && scriptureEngine.filterVerse(query).length === 0) {
			return results;
		}

		//Loop through every book
		for (var b = 0; b < scriptureEngine.currentYearObject.books.length; b++) {
			var currentBook = scriptureEngine.currentYearObject.books[b];

			//Loop through every chapter
			for (var c = 0; c < currentBook.chapters.length; c++) {
				var currentChapter = currentBook.chapters[c];

				//Loop through every section
				var verseCountsBySection = [];

				for (var s = 0; s < currentChapter.sections.length; s++) {
					var currentSection = currentChapter.sections[s];

					//Loop through every verse
					verseLoop: for (var v = 0; v < currentSection.verses.length; v++) {
						var currentVerse = currentSection.verses[v];

						var filteredCurrentVerse = scriptureEngine.filterVerse(currentVerse, true);
						var filteredQuery = scriptureEngine.filterVerse(query, true, true);

						//Determine whether to use the advanced search algorithm or not
						if (useAdvancedSearch && filteredQuery.match(/( [/+]+ |!)/g)) {
							//Loop through each global NOT item. If there are any matches in this verse, move to the next one.
							if (globalNotMatches) {
								for (var n = 0; n < globalNotMatches.length; n++) {
									if (filteredCurrentVerse.indexOf(globalNotMatches[n]) !== -1) {
										continue verseLoop;
									}
								}
							}

							if (parse(filteredQuery)) {
								if (verseCountsBySection.length > 0) {
									var sumOfSectionVerseCounts = verseCountsBySection.reduce((a, b) => a + b);
									var currentVerseNumber = sumOfSectionVerseCounts + v + 1;
								} else {
									var currentVerseNumber = v + 1;
								}

								results.push({
									reference: currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber,
									memory: new Verse(currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber).memory,
								});
							}
						} else {
							filteredQuery = scriptureEngine.filterVerse(filteredQuery, true);

							//Simply check if the verse contains the search query.
							if (filteredCurrentVerse.indexOf(filteredQuery) !== -1) {
								if (verseCountsBySection.length > 0) {
									var sumOfSectionVerseCounts = verseCountsBySection.reduce((a, b) => a + b);
									var currentVerseNumber = sumOfSectionVerseCounts + v + 1;
								} else {
									var currentVerseNumber = v + 1;
								}

								results.push({
									reference: currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber,
									memory: new Verse(currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber).memory,
								});
							}
						}
					}

					verseCountsBySection.push(currentSection.verses.length);
				}
			}
		}

		return results;
	},

	findReferencesInString: function (stringToSearch) {
		var referenceRegex = /\w+ \d+:\d+(-\d+)?/gi;
		var matchesInString = stringToSearch.match(referenceRegex);

		var referencesInString = [];

		if (matchesInString) {
			for (var i = 0; i < matchesInString.length; i++) {
				var currentReference = matchesInString[i];

				var splitReference = currentReference.split(" ");
				var currentReferenceBook = splitReference[0];

				//Capitalize the first letter of the book
				currentReferenceBook = currentReferenceBook[0].toUpperCase() + currentReferenceBook.slice(1).toLowerCase();

				//Loop through every book of the current quiz cycle year.
				for (var b = 0; b < scriptureEngine.currentYearObject.books.length; b++) {
					var currentBook = scriptureEngine.currentYearObject.books[b];

					var compositeReference = "";
					if (currentReferenceBook === currentBook.name) {
						//The book name in the reference matches the full book name, so we need to use the abbreviation instead and add it to the Array of results
						compositeReference = currentBook.abbreviation + " " + splitReference[1];
					} else if (currentReferenceBook === currentBook.abbreviation) {
						//The book name in the reference matches the book abbreviation, so we'll add it to the Array of results
						compositeReference = currentReferenceBook + " " + splitReference[1];
					} else {
						continue;
					}

					//If there's a hyphen in the reference, split it into individual references
					if (compositeReference.indexOf("-") !== -1 && compositeReference.indexOf("-") !== compositeReference.length - 1) {
						compositeReference = Range(compositeReference).forEach((item) => {
							return item.reference;
						});
						referencesInString = referencesInString.concat(compositeReference);
					} else {
						referencesInString.push(compositeReference);
					}
					break;
				}
			}
		}

		return referencesInString;
	},

	getNeighboringVerse: function (reference, type) {
		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapter = book.chapters[reference.split(" ")[1].split(":")[0] - 1];

		var chapterVerseCount = scriptureEngine.getVerseCountFromChapter(chapter);
		var verseNumber = Number(reference.split(":")[1]);

		switch (type) {
			case "previous":
				if (verseNumber <= 1) {
					return false;
				} else {
					return reference.split(":")[0] + ":" + (verseNumber - 1);
				}

				break;
			case "next":
				if (verseNumber >= chapterVerseCount) {
					return false;
				} else {
					return reference.split(":")[0] + ":" + (verseNumber + 1);
				}

				break;
		}
	}, //TODO

	returnEarliestReference: function (reference1, reference2) {
		reference1 = {
			referenceString: reference1,
			bookAbbreviation: reference1.split(" ")[0],
			chapterNumber: Number(reference1.split(" ")[1].split(":")[0]),
			verseNumber: Number(reference1.split(":")[1]),
		};

		reference2 = {
			referenceString: reference2,
			bookAbbreviation: reference2.split(" ")[0],
			chapterNumber: Number(reference2.split(" ")[1].split(":")[0]),
			verseNumber: Number(reference2.split(":")[1]),
		};

		//Check books
		if (reference1.bookAbbreviation == reference2.bookAbbreviation) {
			//The books are the same
			//Check chapters
			if (reference1.chapterNumber == reference2.chapterNumber) {
				//The chapters are the same
				//Check verses
				if (reference1.verseNumber == reference2.verseNumber) {
					//The verses are the same
					//PANIC

					//As they're both the same, simply default to returning the first reference
					return reference1.referenceString;
				} else {
					//The verses are different
					if (reference1.verseNumber < reference2.verseNumber) {
						return reference1.referenceString;
					} else {
						return reference2.referenceString;
					}
				}
			} else {
				//The chapters are different

				if (reference1.chapterNumber < reference2.chapterNumber) {
					return reference1.referenceString;
				} else {
					return reference2.referenceString;
				}
			}
		} else {
			//The books are different

			//Compile a list of all book abbreviations
			var bookAbbreviations = [];

			for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
				bookAbbreviations[i] = scriptureEngine.currentYearObject.books[i].abbreviation;
			}

			//Loop through every book abbreviation
			for (var i = 0; i < bookAbbreviations.length; i++) {
				var currentAbreviation = bookAbbreviations[i];

				//If a reference's abbreviation is the same as the current abbreviation, store the current index as a property on that reference's object
				if (reference1.bookAbbreviation == currentAbreviation) {
					reference1.bookIndex = i;
				}

				if (reference2.bookAbbreviation == currentAbreviation) {
					reference2.bookIndex = i;
				}
			}

			if (reference1.bookIndex < reference2.bookIndex) {
				return reference1.referenceString;
			} else {
				return reference2.referenceString;
			}
		}
	}, //TODO

	getPronounClarificationsByReference: function (reference) {
		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapter = book.chapters[reference[0] - 1];

		var verseNumber = reference[1];
		var cumulativeVerseCount = 0;
		var verseCountsBySection = [];

		for (var i = 0; i < chapter.sections.length; i++) {
			var currentSection = chapter.sections[i];
			cumulativeVerseCount += currentSection.verses.length;

			// If the cumulative verse count is greater than our verse number, the verse must be in this section.
			if (verseNumber <= cumulativeVerseCount) {
				//If there are no pronoun clarifications for this section, return false
				if (!currentSection.pronounClarification) {
					return false;
				}

				//The verse we need can be found by taking the verse number and subtracting the numbers of verses in the previous sections.
				for (var ii = 0; ii < verseCountsBySection.length; ii++) {
					verseNumber -= verseCountsBySection[ii];
				}

				//Subtract 1 from the verse number to get the index
				var pronounClarificationsForVerse = currentSection.pronounClarification[verseNumber - 1];
				break;
			}

			verseCountsBySection.push(currentSection.verses.length);
		}

		return pronounClarificationsForVerse;
	}, //TODO

	getFootnotesByReference: function (reference) {
		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapter = book.chapters[reference[0] - 1];

		//If there are no footnotes for this chapter, return false
		if (Object.keys(chapter.footnotes).length == 0) {
			return false;
		}

		var verseNumber = reference[1];
		var cumulativeVerseCount = 0;
		var verseCountsBySection = [];

		for (var i = 0; i < chapter.sections.length; i++) {
			var currentSection = chapter.sections[i];
			cumulativeVerseCount += currentSection.verses.length;

			// If the cumulative verse count is greater than our verse number, the verse must be in this section.
			if (verseNumber <= cumulativeVerseCount) {
				//The verse we need can be found by taking the verse number and subtracting the numbers of verses in the previous sections.
				for (var ii = 0; ii < verseCountsBySection.length; ii++) {
					verseNumber -= verseCountsBySection[ii];
				}

				//Subtract 1 from the verse number to get the index
				var verse = currentSection.verses[verseNumber - 1];

				var footnotesInVerse = [];

				//Search the verse for footnote references
				var startingIndex = 0;
				while (startingIndex !== null) {
					var index = verse.indexOf("[", startingIndex);
					if (index != -1) {
						//Set the starting index to be after this footnote reference
						startingIndex = index + 1;

						var footnoteLetter = verse[index + 1];
						var footnote = chapter.footnotes[footnoteLetter];

						footnotesInVerse.push({
							letter: footnoteLetter,
							footnote: footnote,
						});
					} else {
						startingIndex = null;
					}
				}

				return footnotesInVerse;

				break;
			}

			verseCountsBySection.push(currentSection.verses.length);
		}
	},

	getBookByAbbreviation: function (abbreviation) {
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBookObject = scriptureEngine.currentYearObject.books[i];
			if (currentBookObject.abbreviation == abbreviation) {
				return currentBookObject;
			}
		}
	}, //TODO

	getYearByAbbreviation: function (abbreviation) {
		var yearName;

		switch (abbreviation) {
			case "M":
				yearName = "Matthew";
				break;

			case "RJ":
				yearName = "RomansJames";
				break;

			case "A":
				yearName = "Acts";
				break;

			case "GEPCP":
				yearName = "GEPCP";
				break;

			case "L":
				yearName = "Luke";
				break;

			case "C":
				yearName = "Corinthians";
				break;

			case "HP":
				yearName = "HebrewsPeter";
				break;
		}

		return yearName;
	}, //TODO

	getYearAbbreviationByName: function (name) {
		var abbreviation;

		switch (name) {
			case "Matthew":
				abbreviation = "M";
				break;

			case "RomansJames":
				abbreviation = "RJ";
				break;

			case "Acts":
				abbreviation = "A";
				break;

			case "GEPCP":
				abbreviation = "GEPCP";
				break;

			case "Luke":
				abbreviation = "L";
				break;

			case "Corinthians":
				abbreviation = "C";
				break;

			case "HebrewsPeter":
				abbreviation = "HP";
				break;
		}

		return abbreviation;
	}, //TODO

	getVerseCountFromChapter: function (chapterObject) {
		var verseCount = 0;

		//Loop through each section
		for (var s = 0; s < chapterObject.sections.length; s++) {
			var currentSection = chapterObject.sections[s];

			//Add the number of verses in this section to the verse count
			verseCount += currentSection.verses.length;
		}

		return verseCount;
	},

	getSectionNumberFromReference: function (reference) {
		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[i];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapter = book.chapters[reference[0] - 1];

		var verseNumber = reference[1];
		var cumulativeVerseCount = 0;

		for (var i = 0; i < chapter.sections.length; i++) {
			var currentSection = chapter.sections[i];
			cumulativeVerseCount += currentSection.verses.length;

			// If the cumulative verse count is greater than our verse number, the verse must be in this section.
			if (verseNumber <= cumulativeVerseCount) {
				return i + 1;
			}
		}
	},

	filterReference: function (reference) {
		var referenceRegex = /\w+ \d+:\d+/gi;
		var referenceMatches = reference.match(referenceRegex);

		if (referenceMatches) {
			var currentReference = referenceMatches[0];

			var splitReference = currentReference.split(" ");
			var currentReferenceBook = splitReference[0];

			//Capitalize the first letter of the book
			currentReferenceBook = currentReferenceBook[0].toUpperCase() + currentReferenceBook.slice(1);

			//Loop through every book of the current quiz cycle year.
			for (var b = 0; b < scriptureEngine.currentYearObject.books.length; b++) {
				var currentBook = scriptureEngine.currentYearObject.books[b];

				if (currentReferenceBook === currentBook.name) {
					//The book name in the reference matches the full book name, so we need to use the abbreviation instead and add it to the Array of results
					var compositeReference = currentBook.abbreviation + " " + splitReference[1];
				} else if (currentReferenceBook === currentBook.abbreviation) {
					//The book name in the reference matches the book abbreviation, so we'll add it to the Array of results
					var compositeReference = currentReferenceBook + " " + splitReference[1];
				}

				if (compositeReference) {
					return compositeReference;
				}
			}
		} else {
			//The string does not contain a reference, so return.
			return false;
		}

		return referencesInString;
	},

	filterVerse: function (verseText, removeFootnotes, preserveAdvancedSearchCharacters) {
		//This function filters all punctuation and extra spacing out of a verse and converts it to lowercase

		if (removeFootnotes) {
			verseText = verseText.replace(/(\[[a-z]\])/g, "");
		}

		if (preserveAdvancedSearchCharacters) {
			verseText = verseText.replaceAll(/[^\w/+! ]/g, "");
		} else {
			verseText = verseText.replaceAll(/[^\w ]/g, "");
		}
		verseText = verseText.replace(/\s\s+/g, " ");
		verseText = verseText.trim();
		verseText = verseText.toLowerCase();

		return verseText;
	},

	filterWord: function (word, removeFootnotes) {
		//This function filters all puntuation except apostrophes out of a verse and converts it to lowercase

		if (removeFootnotes) {
			word = word.replaceAll(/(\[[a-z]\])/g, "");
		}

		var regExMatches = word.match(/(\w+’\w+)|(\w+)/g);
		if (!regExMatches) {
			//The word is either a blank space or a hyphen
			return false;
		} else {
			return regExMatches[0].toLowerCase();
		}
	},

	unabbreviateBookNamesInString(string) {
		//Compile all book abbreviations and their respective names
		var abbreviations = [];
		var bookNames = [];

		for (var i = 0; i < scriptureEngine.currentYearObject.books.length; i++) {
			abbreviations.push(scriptureEngine.currentYearObject.books[i].abbreviation);
			bookNames.push(scriptureEngine.currentYearObject.books[i].name);
		}

		//Sort the abbreviations by length so that the longest abbreviations are replaced first. Sort the book names in tandem with their corresponding abbreviations
		for (var i = 0; i < abbreviations.length; i++) {
			for (var j = 0; j < abbreviations.length; j++) {
				if (abbreviations[j].length < abbreviations[j + 1]?.length) {
					var temp = abbreviations[j];
					abbreviations[j] = abbreviations[j + 1];
					abbreviations[j + 1] = temp;

					temp = bookNames[j];
					bookNames[j] = bookNames[j + 1];
					bookNames[j + 1] = temp;
				}
			}
		}

		//Replace abbreviations with the full book names, unless the abbreviation is itself contained in a full book name
		for (var i = 0; i < abbreviations.length; i++) {
			var regex = new RegExp("\\b" + abbreviations[i] + "\\b", "g"); // Create a regex with word boundaries
			string = string.replace(regex, bookNames[i]);
		}

		return string;
	},
};

function Range(rangeReference) {
	var startReference = rangeReference.split("-")[0];
	var endReference = rangeReference.split(":")[0] + ":" + rangeReference.split("-")[1];
	var currentVerse = new Verse(startReference);
	var verses = [currentVerse];
	while (currentVerse.reference !== endReference) {
		currentVerse = currentVerse.relative(1);
		verses.push(currentVerse);
	}
	return verses;
}

class Verse {
	constructor(reference) {
		this.reference = reference;

		var verseContent;

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = this.reference.split(" ")[0];
		var splitReferenceNumbers = this.reference.split(" ")[1].split(":");
		for (var b = 0; b < scriptureEngine.currentYearObject.books.length; b++) {
			var currentBook = scriptureEngine.currentYearObject.books[b];
			if (currentBook.abbreviation == bookAbbreviation) {
				book = currentBook;
				break;
			}
		}

		//Get the correct chapter (subtract 1 from the chapter number to find the index)
		var chapterNumber = splitReferenceNumbers[0];
		var chapter = book.chapters[chapterNumber - 1];

		var verseNumber = splitReferenceNumbers[1];
		var cumulativeVerseCount = 0;
		var verseCountsBySection = [];

		var chapterTotalVerseCount = 0;

		for (var s = 0; s < chapter.sections.length; s++) {
			chapterTotalVerseCount += chapter.sections[s].verses.length;
		}

		for (var s = 0; s < chapter.sections.length; s++) {
			var currentSection = chapter.sections[s];
			cumulativeVerseCount += currentSection.verses.length;

			// If the cumulative verse count is greater than our verse number, the verse must be in this section.
			if (verseNumber <= cumulativeVerseCount) {
				//The verse we need can be found by taking the verse number and subtracting the numbers of verses in the previous sections.
				for (var ii = 0; ii < verseCountsBySection.length; ii++) {
					verseNumber -= verseCountsBySection[ii];
				}

				//Subtract 1 from the verse number to get the index
				verseContent = currentSection.verses[verseNumber - 1];

				//Filter out any section breaks of format {SECTION}
				verseContent = verseContent.replace(" {SECTION} ", " ");

				var footnotesInVerse = [];

				//Search the verse for footnote references
				var startingIndex = 0;
				while (startingIndex !== null) {
					var index = verseContent.indexOf("[", startingIndex);
					if (index != -1) {
						//Set the starting index to be after this footnote reference
						startingIndex = index + 1;

						var footnoteLetter = verseContent[index + 1];
						var footnote = chapter.footnotes[footnoteLetter];

						footnotesInVerse.push({
							letter: footnoteLetter,
							content: footnote,
						});
					} else {
						startingIndex = null;
					}
				}

				break;
			}

			verseCountsBySection.push(currentSection.verses.length);
		}

		this.book = book;
		this.chapter = chapter;
		this.section = currentSection;
		this.text = verseContent;
		this.footnotes = footnotesInVerse;

		this.bookLength = this.book.chapters.length;
		this.chapterLength = chapterTotalVerseCount;

		this.chapterNumber = chapterNumber;
		this.sectionIndex = s;
		this.verseNumber = Number(splitReferenceNumbers[1]);
		this.sectionVerseIndex = verseNumber - 1;
	}

	get expandedReference() {
		return scriptureEngine.unabbreviateBookNamesInString(this.reference);
	}

	get memory() {
		var memory = {
			status: false,
		};

		//Loop through all single verse memory verses to look for a match
		for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.singles.length; i++) {
			var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.singles[i];

			if (this.reference == currentMemoryReference) {
				memory = {
					status: true,
					multiple: false,
					reference: currentMemoryReference,
					prejump: scriptureEngine.currentYearObject.prejumps.singles[i],
				};
				memory.start = new Verse(currentMemoryReference);
				memory.end = memory.start;
				break;
			}
		}

		//Loop through all multiple verse memory verses to look for a match
		for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.multiples.length; i++) {
			var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.multiples[i];

			//Split the multiple reference into references for each individual verse in the multiple
			var individualVerses = Range(currentMemoryReference);

			//Loop through each individual verse reference to find a match
			for (var ii = 0; ii < individualVerses.length; ii++) {
				if (this.reference == individualVerses[ii].reference) {
					memory = {
						status: true,
						multiple: true,
						reference: currentMemoryReference,
						prejump: scriptureEngine.currentYearObject.prejumps.multiples[i],
					};
					memory.start = individualVerses[0];
					memory.end = individualVerses[individualVerses.length - 1];
					break;
				}
			}
		}

		return memory;
	}

	toString() {
		return this.reference;
	}

	relative(relativeInteger) {
		//This function returns a new Verse object that is relative to the current verse by the given integer.
		var chapter = this.book.chapters[this.chapterNumber - 1];
		var verseNumber = this.verseNumber + relativeInteger;

		if (verseNumber < 1) {
			return false; //No previous verse
		} else if (verseNumber > scriptureEngine.getVerseCountFromChapter(chapter)) {
			return false; //No next verse
		} else {
			return new Verse(this.reference.split(":")[0] + ":" + verseNumber);
		}
	}
}

var quizCycleYear = storageManager.get("quizCycleYear");
scriptureEngine.currentYearObject = window[quizCycleYear];
