const createCheckboxFromListItem = function(el) {
	let key = pageTitle + "-" + el.innerText.slice(0,15).replaceAll(" ", "")
	el.innerHTML = `<input type="checkbox" style="margin-right:1rem;"/>${el.innerHTML}`
	let check = el.down('input')
	el.style.display = "flex"
	el.style.alignItems = "center"
	el.style.marginLeft = "-2rem"

	check.on('click', x => {
		if (check.checked) {
			el.style.color = "gray"
			el.style.textDecoration = "line-through"
			el.style.textDecorationColor = "red"
			localStorage.setItem(key, true)
		} else {
			el.style.color = "black"
			el.style.textDecoration = "none"
			localStorage.setItem(key, false)
		}
	})
	if (localStorage.getItem(key) == "true") {
		check.click()
	}

}
String.prototype.scrub = function() {
	return this.replaceAll(/[^\w]/g, "")
}


let editingStatusElement = document.getElementById('statusText')
let pageTitle = $('pageTitleText').innerText.scrub()

if ((editingStatusElement == null) || (editingStatusElement.innerText == "OFF")) {
	Array.from(document.getElementsByClassName('liItem read'))
		.filter(contentItem => contentItem.querySelector('h3').innerText == "Learner Guide")
		.map(contentItem => contentItem.querySelector(".vtbegenerated").children)
		.map(elements => Array.from(elements))
		.flat()
		.filter(tag => tag.tagName == "UL")
		.map(tag => Array.from(tag.children))
		.flat()
		.forEach(listItem => createCheckboxFromListItem(listItem))
	Array.from(document.getElementsByClassName('liItem read'))
		.filter(contentItem => contentItem.querySelector('h3').innerText == "Checklist Script")
		.forEach(contentItem => contentItem.style.display = "none")

}