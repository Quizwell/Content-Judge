var scriptureEngine = {
    
    currentYearObject: RomansJames,
    
    getIndividualReferencesFromRangeReference: function (rangeReference) {
        
        var splitRangeReference = rangeReference.split("-");
        var baseReference = splitRangeReference[0].split(":")[0] + ":";
        
        var initialVerseReference = splitRangeReference[0];
        var finalVerseReference = baseReference + splitRangeReference[splitRangeReference.length - 1];
        
        var numberOfVerses = Number(finalVerseReference.split(":")[1]) -Number(initialVerseReference.split(":")[1]) + 1;
        
        var individualReferences = [];
        for (var i = 0; i < numberOfVerses; i++) {
            
            var currentVerseReference = baseReference + (Number(initialVerseReference.split(":")[1]) + i);
            individualReferences.push(currentVerseReference)
            
        }
        
        return individualReferences;
        
    },
    
    getMemoryVerseStatusByReference: function (reference) {
        
        //Loop through all single verse memory verses to look for a match
        for (var i = 0; i < scriptureEngine.currentYearObject.memoryVerses.singles.length; i++) {
            
            var currentMemoryReference = scriptureEngine.currentYearObject.memoryVerses.singles[i];
            
            if (reference == currentMemoryReference) {
                
                var objectToReturn =  {
                    
                    match: true,
                    type: "single",
                    memoryIndex: i,
                    reference: currentMemoryReference,
                    startVerse: currentMemoryReference,
                    endVerse: currentMemoryReference
                    
                }
                
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

                    var objectToReturn =  {

                        match: true,
                        type: "multiple",
                        memoryIndex: i,
                        reference: currentMemoryReference,
                        startVerse: multipleVerseReferences[0],
                        endVerse: multipleVerseReferences[multipleVerseReferences.length + 1],

                    }

                    return objectToReturn;

                }
                
            }
            
        }
        
        //If this code is triggered, it means no match among the single or multiple memory verses was found
        var objectToReturn = {
            
            match: false
            
        }
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
                var correctVerse = currentSection.verses[verseNumber - 1];
                break;
                
            }
            
            verseCountsBySection.push(currentSection.verses.length);
            
        }
        
        return correctVerse;
        
    },
    
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
        
    },
    
    getBookByAbbreviation: function (abbreviation) {
        
        var keys = Object.keys(scriptureEngine.currentYearObject.books);
        for (var i = 0; i < keys.length; i++) {
            
            var currentBookObject = scriptureEngine.currentYearObject.books[keys[i]];
            if (currentBookObject.abbreviation == abbreviation) {
                return currentBookObject;
            }
            
        }
        
    },
    
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
                
                return (i + 1);
                
            }
            
        }
        
    },
    
    filterVerse: function (verseText, removeFootnotes) {
        
        //This function filters all punctuation and extra spacing out of a verse and converts it to lowercase
        
        if (removeFootnotes) {
            
            verseText = verseText.replaceAll(/(\[[a-z]\])/g, "");
            
        }
        
        verseText = verseText.replaceAll(/[^\w]/g, "");
        verseText = verseText.replace(/\s\s+/g, ' ');
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
        
        //Loop through every abbreviation, and replace it with the correct book name in the string
        for (var a = 0; a < abbreviations.length; a++) {
            string = string.replaceAll(abbreviations[a], bookNames[a]);
        }
        
        return string;
        
    }
    
}