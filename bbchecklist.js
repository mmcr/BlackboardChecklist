(() => {
	console.log("at the start")

	let head = document.getElementsByTagName("head")[0]

	String.prototype.scrub = function() {
		return this.replaceAll(/[^\w]/g, "")
	}
	
	let editingStatusElement = document.getElementById('statusText')
	
	if ((editingStatusElement == null) || (editingStatusElement.innerText == "OFF")) {
		[{
			"id": 		"FirebaseApp",
			"src": 		"https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js"
		}, {
			"id": 		"FirebaseDatabase",
			"src": 		"https://www.gstatic.com/firebasejs/7.18.0/firebase-database.js"
		}].forEach(x => {
			if (!document.getElementById(x.id)) {
				let link = document.createElement('script')
				Object.entries(x).forEach(([key, val]) => link.setAttribute(key, val))
				head.appendChild(link)
			}
		})
		let database
		let checkboxData = null
		const saveCheckboxToDatabase = function(checkboxID, value) {
			let ref = database.ref().child(`checkboxes/${userID}/${courseID}/${pageID}/${checkboxID}`)
			ref.set(value)
				.then(() => console.log("Saved checkbox"))
				.catch(error => console.error(`Error saving checkbox: ${error}`))
		}
		const loadCheckboxesFromDatabase = function() {
			let ref = database.ref().child(`checkboxes/${userID}/${courseID}/${pageID}`)

// 			let valuePromise = new Promise((resolve, reject) => {
// 				ref.once("value", function(snapshot) {
// 					if (snapshot.numChildren() > 0) {
// 						checkboxData = new Map(Object.entries(snapshot.val()))
// 					}
// 					resolve()
// 
// 				}, function (errorObject) {
// 					reject(errorObject)
// 				})
// 			})
				
			
			
			
			
			let valuePromise = ref.once("value")
				.then(snapshot => {
					if (snapshot.numChildren() > 0) {
						checkboxData = new Map(Object.entries(snapshot.val()))
					}
				})
				.catch(error => console.error(`Unable to load checkboxes: ${error}`))
			
			// ref.on('child_added', function(childSnapshot) {
			// 	console.log(`added: ${childSnapshot}`)	
			// }, function(error) {
			// 	console.log(`Error: ${error}`)
			// })
			ref.on('child_changed', function(childSnapshot) {
				console.log(`changed: ${childSnapshot}`)	
			}, function(error) {
				console.log(`Error: ${error}`)
			})
			return valuePromise
		}
		
		
		let courseID = document.querySelector('li.root.coursePath a').getAttribute('href').match(/[\w_]+$/)[0]
		let userID = document.getElementById('magicUserID')?.innerText.trim() ?? "DEBUG"
		let pageID = document.querySelector('#pageTitleDiv form').getAttribute('action').match(/content_id=([\w_]+)&/)[1]
		let appInstance

		const changeCheckboxStyles = function(el, checked) {
			if (checked) {
				el.style.color = "gray"
				el.style.textDecoration = "line-through"
				el.style.textDecorationColor = "red"
			} else {
				el.style.color = "black"
				el.style.textDecoration = "none"
			}
			
		}

		const createCheckboxFromListItem = function(el) {
			let checkboxID = el.innerText.slice(0,20).scrub()
			// let key = `${userID}-${courseID}-${pageID}-${checkboxID}`
			el.innerHTML = `<input type="checkbox" style="margin-right:1rem;"/>${el.innerHTML}`
			let check = el.down('input')
			el.style.display = "flex"
			el.style.alignItems = "center"
			el.style.marginLeft = "-2rem"
		
			check.on('click', x => {
				changeCheckboxStyles(el, check.checked)
				saveCheckboxToDatabase(checkboxID, check.checked)
				// if (check.checked) {
				// 	el.style.color = "gray"
				// 	el.style.textDecoration = "line-through"
				// 	el.style.textDecorationColor = "red"
				// 	localStorage.setItem(key, true)
				// } else {
				// 	el.style.color = "black"
				// 	el.style.textDecoration = "none"
				// 	localStorage.setItem(key, false)
				// }
			})
			if (checkboxData?.has(checkboxID)) {
				check.checked = (checkboxData.get(checkboxID) === true)
				changeCheckboxStyles(el, check.checked)
			}
			
			// if (localStorage.getItem(key) == "true") {
			// 	check.click()
			// }
		
		}

		const makeTheMagicHappen = function() {
			console.log("in makeTheMagicHappen")
			if (appInstance == null) {
				console.log("initing Firebase")
				appInstance = firebase.initializeApp({
					apiKey: "AIzaSyAHe2hquz7tuauLQKEXmK44s3jl02gdzl4",
					authDomain: "bbchecklist-c599c.firebaseapp.com",
					databaseURL: "https://bbchecklist-c599c.firebaseio.com",
					projectId: "bbchecklist-c599c",
					storageBucket: "bbchecklist-c599c.appspot.com",
					messagingSenderId: "1025910668427",
					appId: "1:1025910668427:web:69615a1ebcdc895df1288e"
				})
			}
			database = firebase.database()
			loadCheckboxesFromDatabase()
				.then(() => {
					console.log("before building checkboxes")
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
				})
		}
		window.setTimeout(makeTheMagicHappen, 250)
	}
	
})()