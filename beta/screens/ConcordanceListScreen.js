class ConcordanceListScreen extends Screen {
	constructor() {
		super("Concordance");

		var wordItems = [];
		for (const currentWord in scriptureEngine.currentYearObject.concordance) {
			const currentWordConcordanceInfo = scriptureEngine.currentYearObject.concordance[currentWord];
			var currentWordItem = {
				leading: { title: currentWord },
				value: currentWord,
				trailing: {
					icon: "chevron-right",
				},
			};

			if (currentWordConcordanceInfo.references.length === 1) {
				currentWordItem.color = "var(--unique-word-highlight-color)";
				currentWordItem.trailing.text = currentWordConcordanceInfo.references[0];
				currentWordItem.callback = () => {
					new ChapterDisplay(currentWordConcordanceInfo.references[0], {
						allowVerseSelection: true,
						showRareWords: true,
						showPrejump: true,
					}).present();
				};
			} else {
				if (currentWordConcordanceInfo.references.length === 2) {
					currentWordItem.color = "var(--double-word-highlight-color)";
				} else if (currentWordConcordanceInfo.references.length === 3) {
					currentWordItem.color = "var(--triple-word-highlight-color)";
				}
				currentWordItem.trailing.text = currentWordConcordanceInfo.references.length + " uses";
				currentWordItem.callback = () => {
					new UsesListScreen(currentWord, currentWordConcordanceInfo.references).present();
				};
			}
			wordItems.push(currentWordItem);
		}

		this.list = new List({
			items: wordItems,
			itemConstructor: (item) => new ListItem(item),
			filterOptions: new FilterOptions({
				items: [
					{
						label: "Unique",
						value: "unique",
						color: "var(--unique-word-highlight-color)",
					},
					{
						label: "Double",
						value: "double",
						color: "var(--double-word-highlight-color)",
					},
					{
						label: "Triple",
						value: "triple",
						color: "var(--triple-word-highlight-color)",
					},
				],
				multiple: false,
				onchange: (listItems, options) => {
					return wordItems.filter((item) => {
						if (options.unique && item.color === "var(--unique-word-highlight-color)") {
							return true;
						} else if (options.double && item.color === "var(--double-word-highlight-color)") {
							return true;
						} else if (options.triple && item.color === "var(--triple-word-highlight-color)") {
							return true;
						} else if (!options.unique && !options.double && !options.triple) {
							return true;
						}
						return false;
					});
				},
			}),
			sortOptions: new SortOptions({
				items: [
					{
						enabled: true,
						label: "Alphabetical",
						value: "alphabetical",
						icon: "arrow-down-a-z",
						iconDescending: "arrow-down-z-a",
					},
				],
				onchange: (listItems, option, order) => {
					if (option === "alphabetical") {
						return listItems.toSorted((a, b) => {
							return order === "ascending" ? a.leading.title.localeCompare(b.leading.title) : b.leading.title.localeCompare(a.leading.title);
						});
					}
				},
			}),
			fullScreen: true,
			scrollable: true,
		});

		this.contentElement.appendChild(this.list.listElement);
	}
}
