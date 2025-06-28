class ListsScreen extends Screen {
	constructor() {
		super("Lists");

		const listLinks = [
			{
				disabled: true,
				style: "prominent",
				icon: "list-ol",
				title: "Unique/Double/Triple Words",
				subtitle: "in Concordance",
				callback: () => {},
			},
			{
				icon: "user",
				title: "Names, Groups, and Places",
				callback: () => {
					new NounsListScreen().present();
				},
			},
			{
				icon: "hashtag",
				title: "Numbers",
				callback: () => {
					new NumbersListScreen().present();
				},
			},
			{
				icon: "book-bible",
				title: "Old/New Testament References",
				callback: () => {
					new BiblicalReferencesListScreen().present();
				},
			},
			{
				disabled: true,
				style: "memory",
				icon: "star",
				title: "Memory Verses",
				subtitle: "in Memory",
				callback: () => {},
			},
			{
				disabled: true,
				style: "memory",
				icon: "stopwatch",
				title: "Prejump List",
				subtitle: "in Memory",
				callback: () => {},
			},
		];

		const linkList = document.createElement("div");
		linkList.classList.add("list");

		const listWrapper = document.createElement("div");
		listWrapper.classList.add("listWrapper");

		linkList.appendChild(listWrapper);
		this.contentElement.appendChild(linkList);

		for (const link of listLinks) {
			listWrapper.appendChild(new NavigationLink(link));
		}
	}
}
