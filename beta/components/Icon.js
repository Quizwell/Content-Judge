function Icon(name) {
	var icon = document.createElement("i");
	icon.classList.add("fa-solid");
	icon.classList.add("fa-" + name);
	return icon;
}
