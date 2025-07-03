function FormattedText(text) {
	const element = document.createElement("span");

	// Split the text by underscores for italics, then by asterisks for bold
	function parse(str) {
		const frag = document.createDocumentFragment();
		const regex = /(_([^_]+)_)|(\*([^\*]+)\*)/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(str)) !== null) {
			// Add plain text before the match
			if (match.index > lastIndex) {
				frag.appendChild(document.createTextNode(str.slice(lastIndex, match.index)));
			}
			if (match[1]) {
				// Italic, recursively parse inside
				const i = document.createElement("i");
				i.appendChild(parse(match[2]));
				frag.appendChild(i);
			} else if (match[3]) {
				// Bold, recursively parse inside
				const b = document.createElement("b");
				b.appendChild(parse(match[4]));
				frag.appendChild(b);
			}
			lastIndex = regex.lastIndex;
		}
		// Add any remaining plain text
		if (lastIndex < str.length) {
			frag.appendChild(document.createTextNode(str.slice(lastIndex)));
		}
		return frag;
	}

	element.appendChild(parse(text));
	return element;
}
