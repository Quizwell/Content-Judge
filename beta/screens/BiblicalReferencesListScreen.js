class BiblicalReferencesListScreen extends Screen {
	constructor() {
		super("Old/New Testament References");

		var referenceItems = [];
		for (const currentReference of scriptureEngine.currentYearObject.biblicalReferences) {
			var currentReferenceItem = {
				title: currentReference.source,
				value: currentReference.source,
				trailing: {
					text: currentReference.reference,
					icon: "chevron-right",
				},
			};
			currentReferenceItem.callback = () => {
				new ChapterDisplay(currentReference.reference, {
					allowVerseSelection: true,
				}).present();
			};
			referenceItems.push(currentReferenceItem);
		}

		this.list = new List({
			items: referenceItems,
			itemConstructor: (item) => new ListItem(item),
			sortOptions: new SortOptions({
				items: [
					{
						label: "Verse Order",
						value: "verse",
						icon: "arrow-down-wide-short",
						iconDescending: "arrow-down-short-wide",
						enabled: true,
					},
					{
						label: "Source Order",
						value: "source",
						icon: "arrow-down-wide-short",
						iconDescending: "arrow-down-short-wide",
					},
				],
				onchange: (listItems, option, order) => {
					if (option === "verse") {
						return listItems.toSorted((a, b) => {
							const earliestReference = scriptureEngine.returnEarliestReference(a.trailing.text, b.trailing.text);
							if (earliestReference === a.trailing.text) {
								return order === "ascending" ? -1 : 1;
							} else if (earliestReference === b.trailing.text) {
								return order === "ascending" ? 1 : -1;
							}
						});
					} else if (option === "source") {
						return listItems.toSorted((a, b) => {
							// Compare with original stored order in scruptureEngine
							const indexA = scriptureEngine.currentYearObject.biblicalReferences.findIndex((ref) => ref.source === a.title);
							const indexB = scriptureEngine.currentYearObject.biblicalReferences.findIndex((ref) => ref.source === b.title);
							return order === "ascending" ? indexA - indexB : indexB - indexA;
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
