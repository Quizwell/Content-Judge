function generateConcordance(currentCycleYearObject) {
	var concordance = {};

	//Loop through every book object
	for (var b = 0; b < currentCycleYearObject.books.length; b++) {
		var currentBook = currentCycleYearObject.books[b];
		var currentAbbreviation = currentBook.abbreviation;

		//Loop through all chapters of the book
		for (var c = 0; c < currentBook.chapters.length; c++) {
			var currentChapter = currentBook.chapters[c];

			//Loop through all sections of current chapter
			for (var s = 0; s < currentChapter.sections.length; s++) {
				var currentSection = currentChapter.sections[s];

				//Loop through all verses of current section
				for (var v = 0; v < currentSection.verses.length; v++) {
					var currentVerse = currentSection.verses[v];
					var filteredCurrentVerse;
					var filteredCurrentVerseWordArray;

					//Remove all footnote references
					var footnoteRegExp = /(\[[a-z]\])/g;
					filteredCurrentVerse = currentVerse.replace(footnoteRegExp, "");
					filteredCurrentVerseWordArray = filteredCurrentVerse.split(" ");

					//Loop through every word of current filtered verse
					for (var w = 0; w < filteredCurrentVerseWordArray.length; w++) {
						var currentWord = filteredCurrentVerseWordArray[w];
						var currentWordMatches = currentWord.match(/(\w+’\w+)|(\w+)/g);
						if (!currentWordMatches) {
							//The word is either a blank space or a hyphen
							continue;
						}
						currentWord = currentWordMatches[0];
						currentWord = currentWord.toLowerCase();

						//If the current word doesn't have a concordance entry already, create one for it now
						if (!concordance[currentWord]) {
							concordance[currentWord] = {
								references: [],
							};
						}

						var currentVerseNumber;
						if (s + 1 > 1) {
							var cumulativeVerseCount = 0;
							//Loop through all previous sections of the chapter
							for (var sectionIndex = 0; sectionIndex < s; sectionIndex++) {
								var currentSectionVerseCount = currentChapter.sections[sectionIndex].verses.length;
								cumulativeVerseCount += currentSectionVerseCount;
							}

							cumulativeVerseCount += v + 1;
							currentVerseNumber = cumulativeVerseCount;
						} else {
							//This verse is in the first section of the chapter, so the verse number is correct
							currentVerseNumber = v + 1;
						}
						concordance[currentWord].references.push(currentAbbreviation + " " + (c + 1) + ":" + currentVerseNumber);
					}
				}
			}
		}
	}
	return concordance;
}
