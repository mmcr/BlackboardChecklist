const BbChecklist = (function() {
	var head = document.getElementsByTagName("head")[0]

	String.prototype.scrub = function() {
		return this.replaceAll(/[^\w]/g, "")
	}
	
	var editingStatusElement = document.getElementById('statusText')
	var database
	var appInstance	
	var checkboxData = null

	var courseID = document.querySelector('li.root.coursePath a').getAttribute('href').match(/[\w_]+$/)[0]
	var userID = (document.getElementById('magicUserID') == null) ? "DEBUG" : document.getElementById('magicUserID').innerText.trim().scrub()
	var pageID = document.querySelector('#pageTitleDiv form').getAttribute('action').match(/content_id=([\w_]+)&/)[1]
	
	
	const showLoadingIndicator = function() {
		var el = Array.from(document.querySelectorAll('.liItem.read'))
			.filter(contentItem =>  ['Learner Guide'].includes(contentItem.querySelector('h3').innerText))[0]
		var icon = el.querySelector('img.item_icon')
		icon.style.display = "none"	
		if (el.querySelector('i.fa-spin') == null) {
			el.innerHTML = `<i class="fas fa-cog fa-spin fa-4x" style="position:absolute;top:1.5rem;left:1.5rem;color:#666;"></i>${el.innerHTML}`
		}
	}
	const hideLoadingIndicator = function() {
		var el = Array.from(document.querySelectorAll('.liItem.read'))
			.filter(contentItem =>  ['Learner Guide'].includes(contentItem.querySelector('h3').innerText))[0]			
		var icon = el.querySelector('img.item_icon')
		var indicator = el.querySelector('i.fa-spin')
		icon.style.display = "block"
		indicator.style.display = "none"

	}
	const saveCheckboxToDatabase = function(checkboxID, value) {
		var ref = database.ref().child(`checkboxes/${userID}/${courseID}/${pageID}/${checkboxID}`)
		ref.set(value)
			.then(() => {})
			.catch(error => console.error(`Error saving checkbox: ${error}`))
	}
	const loadCheckboxesFromDatabase = function() {
		var ref = database.ref().child(`checkboxes/${userID}/${courseID}/${pageID}`)
		
		var valuePromise = ref.once("value")
			.then(snapshot => {
				if (snapshot.numChildren() > 0) {
					checkboxData = new Map(Object.entries(snapshot.val()))
				}
			})
			.catch(error => console.error(`Unable to load checkboxes: ${error}`))
		
		ref.on('child_changed', function(childSnapshot) {

		}, function(error) {
			console.log(`Error: ${error}`)
		})
		return valuePromise
	}
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
		var checkboxID = el.innerText.slice(0,20).scrub()
		// var key = `${userID}-${courseID}-${pageID}-${checkboxID}`
		if (el.querySelector('input') == null) {
			el.innerHTML = `<input type="checkbox" style="margin-right:1rem;"/>${el.innerHTML}`
		}
		var check = el.down('input')
		el.style.display = "flex"
		el.style.alignItems = "center"
		el.style.marginLeft = "-2rem"
	
		check.addEventListener('click', event => {
			changeCheckboxStyles(el, check.checked)
			saveCheckboxToDatabase(checkboxID, check.checked)
		})
		if ((checkboxData != null) && checkboxData.has(checkboxID)) {
			check.checked = (checkboxData.get(checkboxID) === true)
			changeCheckboxStyles(el, check.checked)
		}
	}
	const makeTheMagicHappen = function() {
		showLoadingIndicator()
		if (appInstance == null) {
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
				hideLoadingIndicator()
			})
	}
			
	
	
	if ((editingStatusElement == null) || (editingStatusElement.innerText == "OFF")) {
		[{
			"id": 		"FirebaseApp",
			"src": 		"https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js"
		}, {
			"id": 		"FirebaseDatabase",
			"src": 		"https://www.gstatic.com/firebasejs/7.18.0/firebase-database.js"
		}].forEach(x => {
			if (!document.getElementById(x.id)) {
				var link = document.createElement('script')
				Object.entries(x).forEach(([key, val]) => link.setAttribute(key, val))
				head.appendChild(link)
			}
		})
		if (!document.getElementById('FontAwesome')) {
			var link = document.createElement("link")
			Object.entries({
				"rel": 		"stylesheet",
				"id": 		"FontAwesome",
				"href": 		"https://pro.fontawesome.com/releases/v5.12.0/css/all.css",
				"integrity":	"sha384-ekOryaXPbeCpWQNxMwSWVvQ0+1VrStoPJq54shlYhR8HzQgig1v5fas6YgOqLoKz",
				"crossorigin":	"anonymous"
			}).forEach( function([key,val]) { link.setAttribute(key, val) })
			head.appendChild(link)
		}
	}
	return {
		begin: (makeTheMagicHappen != null) ? makeTheMagicHappen :(() => {})
	}
	
})()
window.setTimeout(BbChecklist.begin, 250)