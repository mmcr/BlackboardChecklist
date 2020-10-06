(() => {
	String.prototype.scrub = function() {
		return this.replaceAll(/[^\w]/g, "")
	}
	
	let editingStatusElement = document.getElementById('statusText')
	
	if ((editingStatusElement == null) || (editingStatusElement.innerText == "OFF")) {
		let courseID = document.querySelector('li.root.coursePath a').getAttribute('href').match(/[\w_]+$/)[0]
		let userID = document.getElementById('magicUserID').innerText.trim()
		let pageID = document.querySelector('#pageTitleDiv form').getAttribute('action').match(/content_id=([\w_]+)&/)[1]		

		const createCheckboxFromListItem = function(el) {
			let key = `${userID}-${courseID}-${pageID}-` + el.innerText.slice(0,20).replaceAll(" ", "")
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

		Array.from(document.getElementsByClassName('liItem read'))
			.filter(contentItem =>  ['Learner Guide'].includes(contentItem.querySelector('h3').innerText))
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
	
})()