class MemoryListScreen extends Screen {
	constructor() {
		super("Memory");
		this.element.classList.add("memoryListScreen");

		var memoryItems = [];
		const memoryVerses = scriptureEngine.currentYearObject.memoryVerses.singles.concat(scriptureEngine.currentYearObject.memoryVerses.multiples);
		for (const currentMemory of memoryVerses) {
			const currentStartVerse = new Verse(currentMemory.split("-")[0]);
			var currentMemoryItem = {
				leading: {
					icon: currentStartVerse.memory.multiple ? "circle-dot" : "circle",
					title: currentMemory,
					subtitle: currentStartVerse.memory.prejump,
				},
				value: currentMemory,
				trailing: {
					icon: "chevron-right",
				},
			};

			currentMemoryItem.callback = () => {
				new ChapterDisplay(currentStartVerse.reference, {
					allowVerseSelection: true,
				}).present();
			};
			memoryItems.push(currentMemoryItem);
		}

		this.list = new List({
			items: memoryItems,
			itemConstructor: (item) => new ListItem(item),
			filterOptions: new FilterOptions({
				items: [
					{
						label: "Single",
						value: "single",
						icon: "circle",
					},
					{
						label: "Multiple",
						value: "multiple",
						icon: "circle-dot",
					},
				],
				multiple: false,
				onchange: (listItems, options) => {
					return memoryItems.filter((item) => {
						if (options.single && item.leading.icon === "circle") {
							return true;
						} else if (options.multiple && item.leading.icon === "circle-dot") {
							return true;
						} else if (!options.single && !options.multiple) {
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
						label: "Verse Order",
						value: "verse",
						icon: "arrow-down-wide-short",
						iconDescending: "arrow-down-short-wide",
					},
					{
						label: "Alphabetical by Prejump",
						value: "alphabetical",
						icon: "arrow-down-a-z",
						iconDescending: "arrow-down-z-a",
					},
				],
				onchange: (listItems, option, order) => {
					if (option === "verse") {
						return listItems.toSorted((a, b) => {
							const verseA = a.leading.title.split("-")[0];
							const verseB = b.leading.title.split("-")[0];
							const earliestReference = scriptureEngine.returnEarliestReference(verseA, verseB);
							if (earliestReference === verseA) {
								return order === "ascending" ? -1 : 1;
							} else if (earliestReference === verseB) {
								return order === "ascending" ? 1 : -1;
							}
						});
					} else if (option === "alphabetical") {
						return listItems.toSorted((a, b) => {
							// Remove leading punctuation
							const aPrejump = a.leading.subtitle.replace(/^[^\w]+/, "");
							const bPrejump = b.leading.subtitle.replace(/^[^\w]+/, "");
							return order === "ascending" ? aPrejump.localeCompare(bPrejump) : bPrejump.localeCompare(aPrejump);
						});
					}
				},
			}),
			searchOptions: new SearchOptions({
				onchange: (listItems, value) => {
					if (value.length === 0) {
						return listItems;
					} else {
						return listItems.filter((item) => {
							return item.leading.title.toLowerCase().includes(value.toLowerCase()) || item.leading.subtitle.toLowerCase().includes(value.toLowerCase());
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
