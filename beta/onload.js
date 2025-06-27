//REGULAR ONLOAD CODE

// const SCREENTEST = new Screen("Test Screen");
// SCREENTEST.present();

// var LIST = new List({
// 	items: [
// 		{
// 			leading: { title: "Abba", subtitle: "Proper Noun" },
// 			trailing: { text: "G 4:6", icon: "chevron-right" },
// 			color: "var(--unique-word-highlight-color)",
// 		},
// 		{
// 			leading: { title: "Abraham", subtitle: "Name" },
// 			trailing: { text: "8 uses", icon: "chevron-right" },
// 		},
// 		{
// 			leading: { title: "Abraham's", subtitle: "Name" },
// 			trailing: { text: "G 3:29", icon: "chevron-right" },
// 			color: "var(--unique-word-highlight-color)",
// 		},
// 		{
// 			leading: { title: "Antioch", subtitle: "Place" },
// 			trailing: { text: "G 2:11", icon: "chevron-right" },
// 			color: "var(--unique-word-highlight-color)",
// 		},
// 		{
// 			leading: { title: "Apphia", subtitle: "Name" },
// 			trailing: { text: "Pln 1:2", icon: "chevron-right" },
// 			color: "var(--unique-word-highlight-color)",
// 		},
// 		{
// 			leading: { title: "Arabia", subtitle: "Place" },
// 			trailing: { text: "2 uses", icon: "chevron-right" },
// 			color: "var(--double-word-highlight-color)",
// 		},
// 	],
// 	itemConstructor: (item) => new ListItem(item),
// 	filterOptions: new ListOptions(
// 		"filter",
// 		[
// 			{
// 				label: "Unique",
// 				value: "unique",
// 				color: "var(--unique-word-highlight-color)",
// 			},
// 			{
// 				label: "Double",
// 				value: "double",
// 				color: "var(--double-word-highlight-color)",
// 			},
// 			{
// 				label: "Triple",
// 				value: "triple",
// 				color: "var(--triple-word-highlight-color)",
// 			},
// 		],
// 		{
// 			multiple: false,
// 			evaluateItem: (item, options) => {
// 				if (options.unique && item.value === "unique") {
// 					return true;
// 				} else if (options.double && item.value === "double") {
// 					return true;
// 				} else if (options.triple && item.value === "triple") {
// 					return true;
// 				} else if (!options.unique && !options.double && !options.triple) {
// 					return true;
// 				}
// 				return false;
// 			},
// 		}
// 	),
// 	sortOptions: new ListOptions(
// 		"sort",
// 		[
// 			{
// 				label: "Numerical",
// 				value: "numerical",
// 				enabled: true,
// 				icon: "arrow-down-1-9",
// 				iconDescending: "arrow-up-1-9",
// 			},
// 			{
// 				label: "Alphabetical",
// 				value: "alphabetical",
// 				icon: "arrow-down-a-z",
// 				iconDescending: "arrow-up-a-z",
// 			},
// 			{
// 				label: "Verse Order",
// 				value: "verseOrder",
// 				icon: "arrow-down-wide-short",
// 				iconDescending: "arrow-up-wide-short",
// 			},
// 		],
// 		{
// 			order: "ascending",
// 			sort: (items, order, mode) => {
// 				items.sort((a, b) => {
// 					if (order === "ascending") {
// 						return a.leading.title.localeCompare(b.leading.title);
// 					} else {
// 						return b.leading.title.localeCompare(a.leading.title);
// 					}
// 				});
// 			},
// 		}
// 	),
// });
// document.querySelector(".testScreen").appendChild(LIST.listElement);

//VERSION AND UPDATE HANDLING

if (storageManager.get("lastUsedVersion") && storageManager.get("lastUsedVersion") != CONTENT_JUDGE_VERSION) {
	//This code runs if the current version of Content Judge is newer than the last used version
	new BannerNotification({
		icon: "circle-check",
		title: "Version " + CONTENT_JUDGE_VERSION,
		message: "Tap to see what's new",
		duration: 10000,
		callback: UIManager.showChangelog,
	});
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", CONTENT_JUDGE_VERSION);

window.addEventListener("error", function (e) {
	console.log(e);
	new BannerNotification({
		icon: "spaghetti-monster-flying",
		title: "Error",
		message: "Tap to send bug report",
		duration: 10000,
		callback: () => {
			var subject = "Flyswatter: Bug Report";
			var body = `Content Judge Version ${CONTENT_JUDGE_VERSION}%0D%0A%0D%0A${e.filename}:${e.lineno}%0D%0A${e.message}%0D%0A${e.error.stack}%0D%0A%0D%0APlease mention as much as possible about the problem you are experiencing below this line.`;

			var mailtoURL = "mailto:quizwell@icloud.com?subject=" + subject + "&body=" + body;

			window.open(mailtoURL, "_blank") || window.location.replace(mailtoURL);
		},
	});
});
