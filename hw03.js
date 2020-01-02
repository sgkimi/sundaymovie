var count;

function newCalendar(){
	var calendar = document.getElementById("calendar");

	for(var i = -2; i<32; i++){
		if((i+2)%7 == 0){
			var row = document.createElement("tr");
			calendar.appendChild(row);
		}
		var date = document.createElement("td");
		if(i>0){
			date.innerText = i;
			date.setAttribute("id", i);
			date.setAttribute("ondrop", "drop(event)");
			date.setAttribute("ondragover","allowDrop(event)");		
		}
		row.appendChild(date);
	}
	calendar.style.width = "90%";
}

window.onload = function(){
	if(localStorage.length > 0)	count = localStorage.getItem("count", count);
	else	count = 0;
	newCalendar();
}
	
function newNote(){
	var notes = document.getElementById("notes");
	var textNote = document.createElement("div");
	var editNode = document.createElement("div");
	var noteID = "note["+count+"]";
	
	var image = document.createElement("img");
	image.src = "./delete.jpg";
	image.style.width = "10px";
	image.style.height = "10px";
	image.style.position = "absolute";
	image.style.marginLeft = "-5px";
	image.style.marginTop = "-5px";
	
	editNode.setAttribute("Contenteditable", "true");
	
	textNote.style.width = "60px"
	textNote.style.backgroundColor = "yellow";
	textNote.style.border = "1px solid black";
	textNote.setAttribute("draggable", "true");
	textNote.setAttribute("ondragstart", "drag(event)");
	
	textNote.setAttribute("id", noteID);
	
	textNote.appendChild(image);
	textNote.appendChild(editNode);
	
	editNode.onblur = function(){
		if(textNote.parentNode.id != "notes"){
			save(textNote.parentNode.id, editNode.innerText, noteID)};
	}
	
	image.style.display = "none";
	
	textNote.onmouseover = function(){loadIcon(image);};
	textNote.onmouseout = function(){deleteIcon(image);};
	
	image.onclick = function(){deleteNote(textNote)};
	
	notes.appendChild(textNote);
	
	count++;
}

function allowDrop(ev){
	ev.preventDefault();
}

function drag(ev){
	ev.dataTransfer.setData("Text", ev.target.id);
	ev.dataTransfer.setData("Node", ev.target.childNodes[1].innerText);
}

function drop(ev){
	var day = ev.target.id;
	var node = ev.dataTransfer.getData("Node");
	var nodeID = ev.dataTransfer.getData("Text");
	if(day != ""){
		ev.preventDefault();
		var data = ev.dataTransfer.getData("Text");
		ev.target.appendChild(document.getElementById(data));
	
		save(day, node, nodeID);
		localStorage.setItem("count", count);
	}
	else false;
}

		
function loadIcon(img){
	img.style.display = "inline";
}

function deleteIcon(img){
	img.style.display = "none";
}

function deleteNote(node){
	var notes = node.parentNode;
	remove(node.id);
	notes.removeChild(node);
}

function save(day, note, noteID){
	var val = day + "," + note;
	if(typeof(Storage) != "undefined"){
		localStorage.setItem(noteID, val);
	}
	else{
		alert("브라우져가 Web Storage를 지원하지않습니다.");
	}
}

function remove(noteID){
	if(typeof(Storage) != "undefined"){
		localStorage.removeItem(noteID);
	}
	else{
		alert("브라우져가 Web Storage를 지원하지않습니다.");
	}
}

function loadcalendar(){
	
	for(var i =1; i<32; i++){ 
	//Read Note를 누를때 계속 Note가 추가되는 것을 방지하기위해 달력을 싹 비워준다.
		var day = document.getElementById(i);
		var childSize = day.childNodes.length;
		if(childSize > 1){
			for(var x = childSize-1; x>0; x--){
					day.removeChild(day.childNodes[x]);
			}
		}
	}
	
	for(var noteID in localStorage){
		if(noteID != "count"){
			var day = localStorage.getItem(noteID).split(",")[0];
			var note = localStorage.getItem(noteID).split(",")[1]; //note에 있는 내용
			
			var val = setNote(noteID, note);		
			var dayBlock = document.getElementById(day);
			
			dayBlock.appendChild(val);
		}
	}
	
	
}

function setNote(id, val){
	var notes = document.getElementById("notes");
	var textNote = document.createElement("div");
	var editNode = document.createElement("div");
	var noteID = id;
	
	var image = document.createElement("img");
	image.src = "./delete.jpg";
	image.style.width = "10px";
	image.style.height = "10px";
	image.style.position = "absolute";
	image.style.marginLeft = "-5px";
	image.style.marginTop = "-5px";
	
	editNode.setAttribute("Contenteditable", "true");
	editNode.innerText = val;
	
	textNote.style.width = "120px"
	textNote.style.backgroundColor = "yellow";
	textNote.style.border = "1px solid black";
	textNote.setAttribute("draggable", "true");
	textNote.setAttribute("ondragstart", "drag(event)");

	textNote.setAttribute("id", noteID);
	
	textNote.appendChild(image);
	textNote.appendChild(editNode);
	
	image.style.display = "none";
	
	editNode.onblur = function(){
		if(textNote.parentNode.id != "notes"){
			save(textNote.parentNode.id, editNode.innerText, noteID)};
	}
	
	textNote.onmouseover = function(){loadIcon(image);};
	textNote.onmouseout = function(){deleteIcon(image);};
	
	image.onclick = function(){deleteNote(textNote)};
	
	return textNote;
}