class NumbersListScreen extends Screen {
	constructor() {
		super("Numbers");

		var numberItems = [];
		for (const currentNumber of scriptureEngine.currentYearObject.numbers) {
			const currentNumberConcordanceInfo = scriptureEngine.currentYearObject.concordance[currentNumber.text.toLowerCase()];
			var currentNumberItem = {
				title: currentNumber.text,
				value: currentNumber.number,
				trailing: {
					icon: "chevron-right",
				},
			};
			if (currentNumberConcordanceInfo.references.length === 1) {
				currentNumberItem.color = "var(--unique-word-highlight-color)";
				currentNumberItem.trailing.text = currentNumberConcordanceInfo.references[0];
				currentNumberItem.callback = () => {
					new ChapterDisplay(currentNumberConcordanceInfo.references[0], {
						allowVerseSelection: true,
					}).present();
				};
			} else {
				if (currentNumberConcordanceInfo.references.length === 2) {
					currentNumberItem.color = "var(--double-word-highlight-color)";
				} else if (currentNumberConcordanceInfo.references.length === 3) {
					currentNumberItem.color = "var(--triple-word-highlight-color)";
				}
				currentNumberItem.trailing.text = currentNumberConcordanceInfo.references.length + " uses";
				currentNumberItem.callback = () => {
					new UsesListScreen(currentNumber.text, currentNumberConcordanceInfo.references).present();
				};
			}
			numberItems.push(currentNumberItem);
		}

		this.list = new List({
			items: numberItems,
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
					return numberItems.filter((item) => {
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
						label: "Numerical",
						value: "numerical",
						icon: "arrow-down-1-9",
						iconDescending: "arrow-down-9-1",
						enabled: true,
					},
					{
						label: "Alphabetical",
						value: "alphabetical",
						icon: "arrow-down-a-z",
						iconDescending: "arrow-down-z-a",
					},
				],
				onchange: (listItems, option, order) => {
					if (option === "numerical") {
						return listItems.toSorted((a, b) => {
							return order === "ascending" ? a.value - b.value : b.value - a.value;
						});
					} else if (option === "alphabetical") {
						return listItems.toSorted((a, b) => {
							return order === "ascending" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
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
