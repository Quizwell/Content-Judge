storageManager.setDefault("quizCycleYear", "GEPCP");

var scriptureEngine = {
	currentYearObject: undefined,

	getIndividualReferencesFromRangeReference: function (rangeReference) {
		var splitRangeReference = rangeReference.split("-");
		var baseReference = splitRangeReference[0].split(":")[0] + ":";

		var initialVerseReference = splitRangeReference[0];
		var finalVerseReference = baseReference + splitRangeReference[splitRangeReference.length - 1];

		var numberOfVerses = Number(finalVerseReference.split(":")[1]) - Number(initialVerseReference.split(":")[1]) + 1;

		var individualReferences = [];
		for (var i = 0; i < numberOfVerses; i++) {
			var currentVerseReference = baseReference + (Number(initialVerseReference.split(":")[1]) + i);
			individualReferences.push(currentVerseReference);
		}

		return individualReferences;
	}, //TODO

	getMemoryVerseStatusByReference: function (reference) {
		//Loop through all single verse memory verses to look for a match
		for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.singles.length; i++) {
			var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.singles[i];

			if (reference == currentMemoryReference) {
				var objectToReturn = {
					match: true,
					type: "single",
					memoryIndex: i,
					reference: currentMemoryReference,
					startVerse: currentMemoryReference,
					endVerse: currentMemoryReference,
				};

				return objectToReturn;
			}
		}

		//Loop through all multiple verse memory verses to look for a match
		for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.multiples.length; i++) {
			var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.multiples[i];

			//Split the multiple reference into references for each individual verse in the multiple
			var multipleVerseReferences = scriptureEngine.getIndividualReferencesFromRangeReference(currentMemoryReference);

			//Loop through each individual verse reference to find a match
			for (var ii = 0; ii < multipleVerseReferences.length; ii++) {
				var currentIndividualVerseReference = multipleVerseReferences[ii];

				if (reference == currentIndividualVerseReference) {
					var objectToReturn = {
						match: true,
						type: "multiple",
						memoryIndex: i,
						reference: currentMemoryReference,
						startVerse: multipleVerseReferences[0],
						endVerse: multipleVerseReferences[multipleVerseReferences.length + 1],
					};

					return objectToReturn;
				}
			}
		}

		//If this code is triggered, it means no match among the single or multiple memory verses was found
		var objectToReturn = {
			match: false,
		};
		return objectToReturn;
	},

	getVerseByReference: function (reference) {
		var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < currentYearBooksKeys.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
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
					memoryVerseStatus: new Verse(referencesInQuery[r]).memoryVerseStatus,
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
		var booksKeys = Object.keys(scriptureEngine.currentYearObject.books);
		for (var b = 0; b < booksKeys.length; b++) {
			var currentBook = scriptureEngine.currentYearObject.books[booksKeys[b]];

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
									memoryVerseStatus: new Verse(currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber).memoryVerseStatus,
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
									memoryVerseStatus: new Verse(currentBook.abbreviation + " " + (c + 1) + ":" + currentVerseNumber).memoryVerseStatus,
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
				var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);
				for (var b = 0; b < currentYearBooksKeys.length; b++) {
					var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[b]];

					var compositeReference = "";
					if (currentReferenceBook === currentYearBooksKeys[b]) {
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
						compositeReference = scriptureEngine.getIndividualReferencesFromRangeReference(compositeReference);
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
		var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		for (var i = 0; i < currentYearBooksKeys.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
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
			var currentYearBooks = scriptureEngine.currentYearObject.books;
			var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

			for (var i = 0; i < currentYearBooksKeys.length; i++) {
				bookAbbreviations[i] = currentYearBooks[currentYearBooksKeys[i]].abbreviation;
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
		var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < currentYearBooksKeys.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
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
		var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < currentYearBooksKeys.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
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
		var keys = Object.keys(scriptureEngine.currentYearObject.books);
		for (var i = 0; i < keys.length; i++) {
			var currentBookObject = scriptureEngine.currentYearObject.books[keys[i]];
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
			case "GEPCP_D":
				yearName = "GEPCP_Decades";
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
			case "GEPCP_Decades":
				abbreviation = "GEPCP_D";
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
		var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);

		var book;

		//Loop through all the books in this year's object until a match is found for the abbreviation.
		var bookAbbreviation = reference.split(" ")[0];
		reference = reference.split(" ")[1].split(":");
		for (var i = 0; i < currentYearBooksKeys.length; i++) {
			var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[i]];
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
			var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);
			for (var b = 0; b < currentYearBooksKeys.length; b++) {
				var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[b]];

				if (currentReferenceBook === currentYearBooksKeys[b]) {
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

		var keys = Object.keys(scriptureEngine.currentYearObject.books);

		for (var i = 0; i < keys.length; i++) {
			abbreviations.push(scriptureEngine.currentYearObject.books[keys[i]].abbreviation);
			bookNames.push(keys[i]);
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

function Verse(reference) {
	this.reference = scriptureEngine.filterReference(reference);
	this.expandedReference = scriptureEngine.unabbreviateBookNamesInString(this.reference);

	var verseContent;

	var currentYearBooksKeys = Object.keys(scriptureEngine.currentYearObject.books);
	var book;

	//Loop through all the books in this year's object until a match is found for the abbreviation.
	var bookAbbreviation = this.reference.split(" ")[0];
	var splitReferenceNumbers = this.reference.split(" ")[1].split(":");
	for (var b = 0; b < currentYearBooksKeys.length; b++) {
		var currentBook = scriptureEngine.currentYearObject.books[currentYearBooksKeys[b]];
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
	this.verseContent = verseContent;
	this.footnotes = footnotesInVerse;

	this.bookLength = this.book.chapters.length;
	this.chapterLength = chapterTotalVerseCount;

	this.bookAbbreviation = bookAbbreviation;
	this.bookName = currentYearBooksKeys[b];
	this.chapterNumber = chapterNumber;
	this.sectionIndex = s;
	this.verseNumber = Number(splitReferenceNumbers[1]);
	this.sectionVerseIndex = verseNumber - 1;

	this.memoryVerseStatus = {
		isMemory: false,
	};

	//Loop through all single verse memory verses to look for a match
	for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.singles.length; i++) {
		var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.singles[i];

		if (this.reference == currentMemoryReference) {
			this.memoryVerseStatus = {
				isMemory: true,
				type: "single",
				memoryReference: currentMemoryReference,
				memoryIndex: i,
				startVerse: currentMemoryReference,
				endVerse: currentMemoryReference,
			};
		}
	}

	//Loop through all multiple verse memory verses to look for a match
	for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.multiples.length; i++) {
		var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.multiples[i];

		//Split the multiple reference into references for each individual verse in the multiple
		var multipleVerseReferences = scriptureEngine.getIndividualReferencesFromRangeReference(currentMemoryReference);

		//Loop through each individual verse reference to find a match
		for (var ii = 0; ii < multipleVerseReferences.length; ii++) {
			var currentIndividualVerseReference = multipleVerseReferences[ii];

			if (this.reference == currentIndividualVerseReference) {
				this.memoryVerseStatus = {
					isMemory: true,
					type: "multiple",
					memoryReference: currentMemoryReference,
					memoryIndex: i,
					startVerse: multipleVerseReferences[0],
					endVerse: multipleVerseReferences[multipleVerseReferences.length - 1],
				};
			}
		}
	}
}

//Set Verse object methods
Verse.prototype.toString = function () {
	return this.reference;
};
Verse.prototype.relative = function (relativeInteger) {
	//If this verse is the first verse of the first chapter or the last verse of the last chapter, stop now.
	if ((this.chapterNumber == 1 && this.verseNumber == 1 && relativeInteger < 0) || (this.chapterNumber == this.bookLength && this.verseNumber == this.chapterLength && relativeInteger > 0)) {
		return false;
	}

	//See if the verse requested exists in the current chapter
	var newChapterNumber = this.chapterNumber;
	var newVerseNumber = this.verseNumber + relativeInteger;

	//If the requested verse lies outside of this chapter, move to the correct one
	if (newVerseNumber <= 0) {
		var newChapter;
		var newChapterLength;

		while (newVerseNumber <= 0) {
			newChapterNumber--;
			newChapter = scriptureEngine.currentYearObject.books[this.bookName].chapters[newChapterNumber - 1].sections;
			newChapterLength = newChapter.reduce(function (accumulator, currentItem) {
				return accumulator + currentItem.verses.length;
			}, 0);
			newVerseNumber += newChapterLength ?? this.chapterLength;
		}
	} else if (newVerseNumber > this.chapterLength) {
		var newChapter;
		var newChapterLength;

		while (newVerseNumber > (newChapterLength ?? this.chapterLength)) {
			newVerseNumber -= newChapterLength ?? this.chapterLength;

			newChapterNumber++;
			newChapter = scriptureEngine.currentYearObject.books[this.bookName].chapters[newChapterNumber - 1].sections;
			newChapterLength = newChapter.reduce(function (accumulator, currentItem) {
				return accumulator + currentItem.verses.length;
			}, 0);
		}
	}

	var referenceString = `${this.bookAbbreviation} ${newChapterNumber}:${newVerseNumber}`;
	return new Verse(referenceString);
};

var quizCycleYear = storageManager.get("quizCycleYear");
scriptureEngine.currentYearObject = window[quizCycleYear];
