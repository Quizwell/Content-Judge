class NounsListScreen extends Screen {
	constructor() {
		super("Names, Groups, and Places");

		var nounItems = [];
		for (const currentNoun of scriptureEngine.currentYearObject.properNouns) {
			const currentNounConcordanceInfo = scriptureEngine.currentYearObject.concordance[currentNoun.noun.toLowerCase()];
			if (!currentNounConcordanceInfo) {
				console.warn(`Concordance entry not found for noun: ${currentNoun.noun}`);
				continue;
			}
			var currentNounItem = {
				leading: { title: currentNoun.noun },
				value: currentNoun.noun,
				trailing: {
					icon: "chevron-right",
				},
			};

			if (typeof currentNoun.type === "string") {
				currentNounItem.leading.subtitle = currentNoun.type;
			} else if (Array.isArray(currentNoun.type)) {
				currentNounItem.leading.subtitle = currentNoun.type.join(", ");
			}

			if (currentNounConcordanceInfo.references.length === 1) {
				currentNounItem.color = "var(--unique-word-highlight-color)";
				currentNounItem.trailing.text = currentNounConcordanceInfo.references[0];
				currentNounItem.callback = () => {
					new ChapterDisplay(currentNounConcordanceInfo.references[0], {
						allowVerseSelection: true,
					}).present();
				};
			} else {
				if (currentNounConcordanceInfo.references.length === 2) {
					currentNounItem.color = "var(--double-word-highlight-color)";
				} else if (currentNounConcordanceInfo.references.length === 3) {
					currentNounItem.color = "var(--triple-word-highlight-color)";
				}
				currentNounItem.trailing.text = currentNounConcordanceInfo.references.length + " uses";
				currentNounItem.callback = () => {
					new UsesListScreen(currentNoun.noun, currentNounConcordanceInfo.references).present();
				};
			}
			nounItems.push(currentNounItem);
		}

		this.list = new List({
			items: nounItems,
			itemConstructor: (item) => new ListItem(item),
			filterOptions: new FilterOptions({
				items: [
					{
						label: "Names",
						value: "names",
						icon: "user",
					},
					{
						label: "Groups",
						value: "groups",
						icon: "users",
					},
					{
						label: "Places",
						value: "places",
						icon: "map-location-dot",
					},
					{
						label: "Proper Nouns",
						value: "properNouns",
						icon: "book-open",
					},
				],
				multiple: true,
				onchange: (listItems, options) => {
					return nounItems.filter((item) => {
						const selectedTypes = [];
						if (options.names) selectedTypes.push("Name");
						if (options.groups) selectedTypes.push("Group");
						if (options.places) selectedTypes.push("Place");
						if (options.properNouns) selectedTypes.push("Proper Noun");

						if (selectedTypes.length === 0) return true;

						return selectedTypes.every((option) => item.leading.subtitle.indexOf(option) !== -1);
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
