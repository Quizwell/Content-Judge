class UsesListScreen extends Screen {
	constructor(title, references) {
		super(title);

		var listItems = [];
		for (const reference of references) {
			listItems.push({
				leading: { title: reference, subtitle: new Verse(reference).text },
				trailing: {
					icon: "chevron-right",
				},
				callback: () => {
					new ChapterDisplay(reference, {
						allowVerseSelection: true,
						showRareWords: true,
						showPrejump: true,
					}).present();
				},
			});
		}

		this.list = new List({ items: listItems, itemConstructor: (item) => new ListItem(item) });

		this.contentElement.appendChild(this.list.listElement);
	}
}
