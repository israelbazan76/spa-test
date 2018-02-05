/**
 * global variables
 */

var lastId=0; /* counter of IDs */
var nItems=0; /* counter of items */
var list = document.getElementById( "list" ); /* main list \*/
var listForStorage=new Array(); /* list of items to be stored*/


/**
 * Validations functions
 * 
 */
function isValidLengthDescription(description){
	var maxLength = 300;

	if(description.length>maxLength){
		 //alert("Invalid Description. Maximun length : "+maxLength);
		 swal("Invalid description!", "Maximun characters allowed: "+maxLength, "error");
 		 return false;
	}
    return true;	
}
function isValidSize(image){
	
	//return true;//solo para probar  borrar!
	
	var validWidth = 320, validHeight = 320;

	if(!(image.width == validWidth && image.height == validHeight)){
		 //alert("Invalid File. Valid sizes are width: "+validWidth+"px and height: "+validHeight+"px");
		 swal("Invalid File!", "The allowed measurements of the image are width: "+validWidth+"px and height: "+validHeight+"px", "error");
 		 return false;
	}
    return true;	
}
function isValidFileType(file){
	var filePath = file.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(filePath)){
        //alert('Please upload file having extensions .jpeg/.jpg/.png/.gif only.');
    	swal("Invalid File!", "The allowed file extensions are .jpeg/.jpg/.png/.gif only.", "error");

        return false;
    }
    return true;
}
/*
 * Preview functions
 */
function previewImage(event) 
{
	if(isValidFileType(event.target)){
		var reader = new FileReader();
		 reader.onload = function()
		 {
			 var image = new Image();
    		 image.src = reader.result;
    		 image.onload = function() {
    			 
    			 if(isValidSize(image)){
    				
    				 var output = document.getElementById("output_image");
    			     output.src = reader.result;
    			     document.getElementById( "btnAdd" ).focus();
    			 }
    		 };
    		 
		 }
		 reader.readAsDataURL(event.target.files[0]);		
	}
 
}
function previewEditedImage(event) 
{
	
	if(isValidFileType(event.target)){
		var reader = new FileReader();
		 reader.onload = function()
		 {
			 var image = new Image();
    		 image.src = reader.result;
    		 image.onload = function() {
    			 
    			 if(isValidSize(image)){
    				 
    				 var output = event.target.parentNode.getElementsByTagName("img")[0];
    			     output.src = reader.result;
    			     
    			 }
    		 };
    		 
		 }
		 reader.readAsDataURL(event.target.files[0]);		
	}
	
 
}

/*
 * submit function for Add Form
 */

var addFormSubmit = function(event) {
	addDataToList();
    event.preventDefault();
};

/*
 * Updates Counter of items (if add is false decrease the counter)
 */
function updateNitems(add=true){
	if(add){
		nItems++;
	}else{
		nItems--;
	}
	document.getElementById( "counter" ).innerHTML =nItems+" items";
}

/*
 * Deletes item from the List
 */
function deleteItem(btn) {
	var item = btn.parentNode.parentNode.parentNode;
	
	
	swal({
      title: "Are you sure?",
      text: "The item will be permanently removed!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
   .then((willDelete) => {
      if (willDelete) {
    	
    	
    	list.removeChild(item);
  	    updateNitems(false);
  		storeItems();
        
  		swal("The item has been deleted!", {
            icon: "success",
        });
  		
      }else {
    	  swal("The operation was aborted!");
      }
    });
	
};

/*
 * Open the Item edition form 
 */
function editItem(btn) {
	var div = btn.parentNode.parentNode;
	div.style.display="none";
	
	var desc = div.getElementsByTagName("label")[0];
	var form_edit = div.parentNode.getElementsByTagName("form")[0];
	
	form_edit.elements["newDescription"].value = desc.innerText; 
	form_edit.getElementsByTagName("img")[0].src = div.getElementsByTagName("img")[0].src; 
	
	form_edit.setAttribute("style","display:block");
	  
};
/*
 * Creates the item edition form
 */
function createEditForm(){
	var form_edit=document.createElement('FORM');
	form_edit.method='POST';
	form_edit.style.display="none";
	form_edit.setAttribute("onsubmit", "saveItem(this)");
	form_edit.setAttribute("class", "card");
	
	
	var newDescription=document.createElement('INPUT');
	newDescription.type='TEXT';
	newDescription.name='newDescription';
	newDescription.maxlength=300;
	
	var newFile=document.createElement('INPUT');
	newFile.type='FILE';
	newFile.id='newFile-'+lastId;
	newFile.setAttribute("class","show-for-sr");
	
	
	var newFileLabel=document.createElement('LABEL');
	newFileLabel.setAttribute("for",newFile.id);
	newFileLabel.setAttribute("class","button small");
	newFileLabel.innerText = "Upload image";
	
	
	newFile.accept="image/jpeg, image/png, image/gif";
	newFile.setAttribute("onchange","previewEditedImage(event)");
	
	var newImage=document.createElement('IMG');
	newImage.name='newImage';
	//newImage.setAttribute("style","height:100px");
	
	var divBtns=document.createElement('DIV');
	divBtns.setAttribute("class","small button-group");
	
	///*
	var btnCancel = document.createElement("BUTTON");
	btnCancel.appendChild(document.createTextNode("Cancel")); 
	btnCancel.setAttribute("onclick","cancelEditItem(this)");
	btnCancel.setAttribute("class","button secondary")
	//*/
	
	var btnSave = document.createElement("INPUT");
	btnSave.setAttribute("type", "submit");
	btnSave.setAttribute("value", "Save");
	btnSave.setAttribute("class","button")
	
	form_edit.appendChild(newImage);
	form_edit.appendChild(newDescription);
	
	form_edit.appendChild(newFileLabel);
	form_edit.appendChild(newFile);
	
	divBtns.appendChild(btnCancel);
	divBtns.appendChild(btnSave);
	form_edit.appendChild(divBtns);
	//form_edit.appendChild(btnCancel);
	//form_edit.appendChild(btnSave);
	return form_edit;
}

/*
 * Cancels the Edit operation / Close the item edit form 
 */
function cancelEditItem(btn){
	var form = btn.parentNode.parentNode;
	var div = form.parentNode.getElementsByTagName("div")[0];
	div.style.display="block";
	form.style.display="none";
	event.preventDefault();
}

/*
 * Saves the changes made to the item
 */
function saveItem(form) {
	
	var div = form.parentNode.getElementsByTagName("div")[0];
	var description = div.getElementsByTagName("label")[0];
	var image = div.getElementsByTagName("img")[0];
	
	if(isValidLengthDescription(form.elements["newDescription"].value.trim())){
			description.innerText = form.elements["newDescription"].value.trim();
			
			if(form.getElementsByTagName("img")[0].src !== ''){
				image.src = form.getElementsByTagName("img")[0].src;
			}
			form.style.display="none";
			div.style.display="block";
			
			storeItems();	
	}
   
	
    event.preventDefault();
    
};


function createListForStorage(item) {
	
	var imgSrc = item.getElementsByTagName("img")[0].src;
	var desc = item.getElementsByTagName("label")[0].innerText;

	var itemObj = {description:desc, imageSrc:imgSrc};
	listForStorage.push(itemObj);
}

function storeItems(){
	var items = document.querySelectorAll("#items li");
	listForStorage=new Array();
	[].forEach.call(items, createListForStorage);
	
	localStorage.setItem("listForStorage",  JSON.stringify(listForStorage));
}

/*************************
 * Drag & Drop functions
 ************************/
var dragSrcEl = null;

var dragstart_handler = function(e) {
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

}
var dragover_handler = function(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}



var drop_handler = function (e) {

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  if (dragSrcEl != this) {
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    setDragAndDropHandlers(dropElem);
    storeItems();
  }
  
  return false;
}


function setDragAndDropHandlers(element) {
	element.addEventListener("dragstart",dragstart_handler,false);
	element.addEventListener("dragover",dragover_handler,false);
	element.addEventListener("drop",drop_handler,false);
}

// drag and drop end

function addItem(description,imageSrc,toStore=true)
{
	// Crear nodo de tipo Element
	var item = document.createElement("li");
	var div = document.createElement("div");
	
	div.setAttribute("class","card")
	
	
	item.appendChild(div);
	item.setAttribute("draggable","true");
	item.setAttribute("class","columns large-3 medium-6")
	setDragAndDropHandlers(item);
	
	  
	var imageItem = document.createElement("IMG");
	
	imageItem.setAttribute("src",imageSrc);
	
	
	
	var desc = document.createElement("LABEL");
	
	desc.innerText = description;
	
	var div_desc = document.createElement("DIV");
	div_desc.setAttribute("class","card-divider");
	
	div_desc.appendChild(desc);
	
	/*create buttons*/
	
	var btnDelete = document.createElement("BUTTON");
	btnDelete.appendChild(document.createTextNode("Delete")); 
	btnDelete.setAttribute("onclick","deleteItem(this)");
	btnDelete.setAttribute("class","alert button");
	
	var btnEdit = document.createElement("BUTTON");
	btnEdit.appendChild(document.createTextNode("Edit")); 
	btnEdit.setAttribute("onclick","editItem(this)");
	btnEdit.setAttribute("class","success button");
	
	var divBtns=document.createElement('DIV');
	divBtns.setAttribute("class","button-group");
	divBtns.appendChild(btnDelete);
	divBtns.appendChild(btnEdit);
	
	
	/* add elements*/
	div.appendChild(imageItem);
	//div.appendChild(desc);
	div.appendChild(div_desc);

	//div.appendChild(btnDelete);
	//div.appendChild(btnEdit);
	div.appendChild(divBtns);
	
	
	/* add edit form to item*/
	item.appendChild(createEditForm());
    
	/*add item to list*/
	list.appendChild(item);
	
	if(toStore){
		storeItems();	
	}
	lastId++;
	updateNitems();
	
}

function loadStoredList()
{
	if (typeof(Storage) !== "undefined") {
	    // Store
	    
	    // Retrieve
	    if(localStorage.getItem("listForStorage") !== null){
	    	
	    	listForStorage = JSON.parse(localStorage.getItem("listForStorage"));
	    	for (data of listForStorage) {
	    		addDataToList(data);
	    	}
	    }
	    
	}
	else {
	    //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	    swal("Invalid browser!", "your browser does not support Web Storage", "error");
	}
		
}
function addDataToList(data=null){
   var description, imageSrc, toStore;
   if(data !== null){
	   description = data.description;
	   imageSrc = data.imageSrc;
	   toStore = false;
   }else{
	   document.getElementById("description").value = document.getElementById("description").value.trim();
	   description = document.getElementById("description").value.trim();
	   imageSrc = document.getElementById("output_image").src;
	   toStore = true;

	   var emptyImage="http://placehold.it/320x320";
	   if(imageSrc === emptyImage){
		   swal("Task Failed!", "You must upload an image file!", "error");
		  return false; 
	   } else if(!isValidLengthDescription(description)){
		  return false;
	   }
		  
	   
	   //clean preview
	   
	   document.getElementById("btnFile").value="";
	   document.getElementById("description").value = "";
	   document.getElementById("output_image").src = "http://placehold.it/320x320";
	   
	   //message success
	   
	   swal("Task Done!", "The item was added to the list!", "success");
   }
   addItem(description,imageSrc,toStore);
}
 
window.onload = function() {
	 loadStoredList();
	 document.getElementById( "btnAdd" ).focus();
	 document.getElementById("addForm").addEventListener("submit", addFormSubmit);

};