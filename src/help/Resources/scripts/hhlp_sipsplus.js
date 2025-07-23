

var popOpen, theImg, theDiv, e;

var ie4 = false;
var advanced = false;
var curLang = null;
var curFilter = null;
var showAll = true;
var cook = null;

var state = "hide";

var menuOpen = "";

var lastMenu = null;

var cook = null;

var L_PopUpBoxStyle_Style = "WIDTH:120PX; PADDING:5px 7px 7px 7px; BACKGROUND-COLOR:#D6D3CE; BORDER:SOLID 1 #000000; VISIBILITY:HIDDEN; POSITION:ABSOLUTE; TOP:0PX; LEFT:0PX; Z-INDEX:2;";

var baseUrl = document.scripts[document.scripts.length - 1].src.replace(/[^\/]+.js/, "");

var popupDIV = "<DIV ID='popUpWindow' STYLE='"+L_PopUpBoxStyle_Style+"'>" + "</DIV>";

// le hunte popups
var openPopups = new Array();
// If( displayStyle == "hide" ) the Popup is hidden,
// for all other values the Popup is shown
function DisplayPopup(id, mode) {
	var el = document.getElementById(id);
	if(el) {
		if (mode == "hide") {

			HideDynamicElements(el);
			el.style.display = "none";

		} else {
			if (el.style.display == "none")
			{
				HideAllPopUps();
				openPopups[ openPopups.length ] = id;
				el.style.display = "";
				if (el.style.top==""){
					var body = document.body;
					var bodyHeight = body.clientHeight;
					var bodyWidth = body.clientWidth;
					//var eventX = window.event.offsetX+20;
					//var eventY = window.event.offsetY + 5;
					var eventX = event.clientX +20;
					var eventY = event.clientY-70;		
					var popupWidth = el.offsetWidth;
					var popupHeight = el.offsetHeight;

					el.style.left=eventX  + "px";
					el.style.top=eventY + "px";
					
					if( popupHeight + eventY > bodyHeight ) {
						if( popupHeight < bodyHeight ){
							el.style.top=bodyHeight - popupHeight;
						}
						else
						{
							el.style.top = 0;
						}
					}
					if( popupWidth + eventX > bodyWidth ) {
						el.style.left = bodyWidth-popupWidth-20;
					}
				}
			}
		}
	}
}
// hides all open popups if the Esc key is pressed (like Winhelp)
// in fact: all popups are hidden,
// that opened at least one time in the past
function HideAllPopUps() {
	for( var i=0; i < openPopups.length; i++ ) {
		DisplayPopup( openPopups[i], "hide" );
	}
}

// hides dynamic elements in popup
function HideDynamicElements(element) {

	if (element) {

		var i, j = 0;
		// dynamic images
		while (j < element.all.tags("img").length) {
			imgSrc = element.all.tags("img")(j).src;
			if (endsWith(imgSrc, "iconClosed.gif")) {
				element.all.tags("img")(j).src = "../Resources/images/iconClosed.gif";
			}
			else if (endsWith(imgSrc.toLowerCase(), "avi")) {
				element.all.tags("img")(j).setAttribute("dynsrc", "DUMMY.gif");
			}
			j = j + 1;
		}

		// dynamic blocks and images
		while (i < element.all.tags("div").length) {
			if (element.all.tags("div")(i).id.indexOf("blockId") == 0) {
				element.all.tags("div")(i).className = "dynamicblock";
			}

			if (element.all.tags("div")(i).id.indexOf("dynImgLoID") == 0)
				element.all.tags("div")(i).className = "dyniconshow";

			if (element.all.tags("div")(i).id.indexOf("dynImgHiID") == 0)
				element.all.tags("div")(i).className = "dynimagehide";

			i = i + 1;
		}

		// expandingglossaryentry
		i = 0;
		while (i < element.all.tags("span").length) {
			if (element.all.tags("span")(i).id.indexOf("expge_id") == 0) {
				element.all.tags("span")(i).style.display = "none";
			}
			i = i + 1;
		}
	}
}


if (navigator.appName == "Microsoft Internet Explorer") {
	var ver = navigator.appVersion;
	var v = new Number(ver.substring(0,ver.indexOf(".", 0)));
	if (v >= 4) {
		advanced = true;
		ie4 = true;

		// Look for 5.x buried somewhere in the version string.
		var toks = ver.split(/[^0-9.]/);
		if (toks) {
			for (var i = 0; i < toks.length; i++) {
				var tok = toks[i];
				if (tok.indexOf(".", 0) > 0) {
					if (tok >= 5)
						ie4 = false;
				}
			}
		}
	}
}
if (advanced)
	window.onload = bodyOnLoad;
	window.onbeforeprint = set_to_print;
	window.onafterprint = reset_form;


function finishOnLoad(){
	document.onkeypress = ieKey;
	window.onresize = closeIE4;
	document.body.onclick = bodyOnClick;
	//IF THE USER HAS IE4+ THEY WILL BE ABLE TO VIEW POPUP BOXES
	if (advanced){
		document.body.insertAdjacentHTML('beforeEnd', popupDIV);
	}
return;}

function endsWith(string, suffix) {
    if (string == null)
        return false;
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function bodyOnClick(){

	if (advanced) {
		var elem = window.event.srcElement;
		for (; elem; elem = elem.parentElement) {
			if (elem.id == "reftip")
				return;
		}
		hideMenus();
		resizeBan();
	}
}


function ieKey(){
	if (window.event.keyCode == 27){
		hideMenus();
		resizeBan();
		closeIE4();
		HideAllPopUps();
	}
return;}


function closeIE4(){
	document.all.popUpWindow.style.visibility = "hidden";
	popOpen = false;
	resizeBan();  //also resize the non-scrolling banner
return;}



function bodyOnLoad(){

	if (advanced) {
		var address = location.href;
		var bookmarkStart = address.indexOf("#")
		// If it has a bookmark, check to see if Language is near A Name
		
		initMenus();
		initDynamicImages();
		resizeBan();
	}
	
	finishOnLoad();

}


function hideMenus(){
	
	window.status= "";
	var menus = document.all.tags("span");

	if (menus) {
		var iElem = menus.length;
		
		for (iElem = 0; iElem < menus.length; iElem++) {
			var elem = menus[iElem];
			
			if (elem.className == "menuActive" || elem.className == "menuClicked") {
			
				var popupName = elem.id + "Popup";
				var div = document.all[popupName];
			
				if (div) {
				
				   setMenuItemStyle(div, "none");

				   div.style.visibility = "hidden";

				}

				elem.className = "menuActive"; 
			}

			
		}
	}
	
	menuOpen = "";
	
	var sbP = document.all.scrollButtonPopup;
	
	if (sbP) {
		
	   sbP.style.visibility = "hidden";

	}
	

}

function hideMenu(elem){
	
	window.status= "";
			
			if (elem.className == "menuActive" || elem.className == "menuClicked") {
			
				var popupName = elem.id + "Popup";
				var div = document.all[popupName];
			
				if (div) {
				
				   setMenuItemStyle(div, "none");

				   div.style.visibility = "hidden";

				}

				elem.className = "menuActive"; 
			}

	menuOpen = "";

}

function initMenus(){

	var menus = document.all.tags("span");

	if (menus) {
		var iElem = menus.length;
		
		for (iElem = 0; iElem < menus.length; iElem++) {
			var elem = menus[iElem];
			
			if (elem.className == "menuActive") {
			
				var m = elem.id;
				initMenu(elem, m);
				
				lastMenu = elem;

			}
		}
	}

}


function clickMenuItem() {

	if(window.event.srcElement.all.length == 0)
		window.event.srcElement.click();

	if(window.event.srcElement.all.length == 1)
		window.event.srcElement.all[0].click();
}



function initMenu(elem, menuName){

	var divS = new String;
	var itemsFound = false;
	var divR = new String;
	var itemsName = menuName + "Items";
	
	var divs = document.all.tags("div");
	if (divs) {
		for (var i = 0; i < divs.length; i++) {
			var div = divs[i];
			if (div.id==itemsName) {
					
					var anchors = div.all.tags("a");
					itemsFound = false;
					
					if(anchors) {
					
					divS += '<table class="menuItem" width="100%" border="0" cellspacing="0" cellpadding="0" onMouseLeave="leaveMenuItems();">';

					
						for (var j = 0; j < anchors.length; j++) {
							var menuItem = anchors[j];
							itemsFound = true;
							
							if(menuItem.innerText != '-')
							{
								divS += "<tr><td class=menuItem onMouseEnter='menuItemIn();' onMouseLeave='menuItemOut();' onclick='clickMenuItem();' nowrap>" + menuItem.outerHTML + "</td></tr>";
							}
							else {
								divS += "<tr class='menuSpacer'><td class='menuSpacer' style='display:none;'></td></tr>";
								divS += "<tr class='menuSeparator'><td class='menuSeparator' style='display:none;'></td></tr>";
								divS += "<tr class='menuSpacer'><td class='menuSpacer' style='display:none;'></td></tr>";
							}
						}

					divS += '</table>';
					/* divS += div.innerHTML; */
					
					
					}
					
			}
		}
	}
	
	if(!itemsFound){
	
		elem.className = "menuInactive";
	}
	
	var pos = getNext(menuBar.parentElement);
	if (divS != "" && itemsFound) {

		divS = '<DIV ID=' + menuName + 'Popup CLASS=menuPopup onkeypress=ieKey>' + divS.replace(" | ", "<br>") + '</DIV>';
		elem.onclick = showMenu;
		elem.onkeyup = ieKey;
		elem.onkeypress = showMenu;
		elem.onmouseenter = enterMenu;
		elem.onmouseleave = leaveMenu;

		if (advanced){
			nsbanner.insertAdjacentHTML('AfterEnd', divS);
		}
		else {
			document.body.insertAdjacentHTML('BeforeEnd', divS);
		}

	}

}



function openMenu(elem)
{

	popupName = elem.id + "Popup";

	bodyOnClick();

	elem.className = "menuClicked";

	window.event.returnValue = false;
	window.event.cancelBubble = true;

	var div = document.all[popupName];
	var lnk = elem;

	if (div && lnk) {
		div.style.pixelTop = lnk.offsetTop + lnk.offsetHeight + 1;
		div.style.pixelLeft = lnk.offsetLeft + 1;
		setMenuItemStyle(div, "");
		div.style.visibility = "visible";
	}

	menuOpen = elem.id;
	
}

function moveMenu(menuName)
{

	popupName = menuName + "Popup";
	var div = document.all[popupName];
	var lnk = document.all[menuName];
	var elem = lnk;

	elem.className = "menuClicked";

	window.event.returnValue = false;
	window.event.cancelBubble = true;

	if (div && lnk) {
		div.style.pixelTop = lnk.offsetTop + lnk.offsetHeight + 1;
		div.style.pixelLeft = lnk.offsetLeft + 1;
		setMenuItemStyle(div, "");
		div.style.visibility = "visible";
	}

	menuOpen = lnk.id;
	
}


function setMenuItemStyle(div, styleString)
{
	
	var items = div.all.tags("td");
	
	if(items)
	{
		for (var j = 0; j < items.length; j++) {

			var item = items[j];
			item.style.display=styleString;
		}
	}

}

function showMenu(){
	
	if(menuOpen != window.event.srcElement.id) {
		openMenu(window.event.srcElement);
	}
	else {	
		bodyOnClick();
		window.event.srcElement.className = "menuHover";	
	}
	
}

function enterMenu(){

		openMenu(window.event.srcElement);

}

function leaveMenu(){
	
	var offsetX = event.offsetX;
	var offsetY = event.offsetY;

	if(event.offsetX < window.event.srcElement.offsetLeft || event.offsetX > window.event.srcElement.offsetLeft + window.event.srcElement.offsetWidth || event.offsetY < window.event.srcElement.offsetTop + window.event.srcElement.offsetHeight)
	{
		hideMenu(window.event.srcElement);
		return true;
	}
	else if(event.offsetY > window.event.srcElement.offsetHeight)
	{		
			openMenu(window.event.srcElement);
	}
	
	
}

function leaveMenuItems(){
	
		hideMenus();
}



function menuMouseIn(){
	if(window.event.srcElement.className == "menuActive") {
		
		if(menuOpen) {
			window.event.srcElement.className = "menuClicked";
			openMenu(window.event.srcElement);
		}
		else {
			window.event.srcElement.className = "menuHover";
		}
		
	}
}

function menuMouseOut(){

	if(window.event.srcElement.className == "menuHover") {
		window.event.srcElement.className = "menuActive";
	}
}



function menuItemIn(){
	window.event.srcElement.className = "menuItemHover";

}

function menuItemOut(){
	window.event.srcElement.className = "menuItem";
}



function getNext(elem){
	for (var i = elem.sourceIndex + 1; i < document.all.length; i++) {
		var next = document.all[i];
		if (!elem.contains(next))
			return next;
	}
	return null;
}
 

function searchALink(ctrlId){
	var hhctrl = document.all[ctrlId];
	if(hhctrl) {
		hhctrl.click();
	}
}


function showPDF() {
	var pdfControl = document.all["pdfCtrl"];
	if(pdfControl) {
		pdfControl.Click();
	}
	else {
		alert("Error while calling HtmlHelp control.");
	}
}

function resizeBan(){
//resizes nonscrolling banner

	if (document.body.clientWidth==0) return;
	var oBanner= document.all.item("nsbanner");
	var oText= document.all.item("nstext");
	if (oText == null) return;
	var oMenu = document.all.item("menu");
	var oTitleRow = document.all.item("titlerow");
	if (oMenu != null){
		var iScrollWidth = bodyID.scrollWidth - 3;
		oMenu.style.marginRight = 0 - iScrollWidth;
		//
	}
	
	if(menuOpen != null && menuOpen != "")
	{
		moveMenu(menuOpen);
	}
	
	if (oTitleRow != null){
		oTitleRow.style.padding = "0px 10px 0px 22px; ";
	}
	if (oBanner != null){

//Uncomment the following 4 lines for slingshot
//		if (document.all.tags('iframe') !=null){
//		document.body.scroll = "yes"
//		return; 
//	}
		document.body.scroll = "no"
		oText.style.overflow= "auto";
 		oBanner.style.width= document.body.offsetWidth-2;
		oText.style.paddingRight = "20px"; // Width issue code
		//oText.style.width= document.body.offsetWidth-4;
		oText.style.top=0;  
		if (document.body.offsetHeight > oBanner.offsetHeight)
		{
			if (document.body.offsetHeight - oBanner.offsetHeight>3)
    			oText.style.height= document.body.offsetHeight - (oBanner.offsetHeight+4) 
    		else
    			oText.style.height= document.body.offsetHeight - oBanner.offsetHeight 
		}
		else oText.style.height=0
	}	
} 


function set_to_print(){
//breaks out of divs to print

    // keep current state
    state = "hide";
    toggleDynamicBlocks();
    
    var i;

	if (window.text)document.all.text.style.height = "auto";
			
	for (i=0; i < document.all.length; i++){
		if (document.all[i].tagName == "BODY") {
			document.all[i].scroll = "yes";
			}
		if (document.all[i].id == "nsbanner") {
			document.all[i].style.margin = "0px 0px 0px 0px";
			}
		if (document.all[i].id == "nstext") {
			document.all[i].style.overflow = "visible";
			document.all[i].style.top = "5px";
			document.all[i].style.width = "100%";
			document.all[i].style.padding = "0px 10px 0px 30px";
			}
		//if (document.all[i].tagName == "A") {
		//    document.all[i].outerHTML = "<A HREF=''>" + document.all[i].innerHTML + "</a>";
    	//}
	}
}


function reset_form(){
//returns to the div nonscrolling region after print

	 document.location.reload();
}	

//*************************************************************
// Function:   toggleDynamicBlocks
// Arguments:  ()
// Purpose:    Toggle the state from all dynamic blocks.
//*************************************************************
function toggleDynamicBlocks()
{
	var i = 0;
	var j = 0;
	var imgSrc;

	switch (state)
	{
		case "hide":

			// dynamic images
			while (j < document.all.tags("img").length)
			{
				imgSrc = document.all.tags("img")(j).src;
				if (endsWith(imgSrc, "iconOpen.gif")) {
					document.all.tags("img")(j).src = "../Resources/images/iconOpen.gif";
				}
				else if (endsWith(imgSrc.toLowerCase(), "avi")) {
					document.all.tags("img")(j).setAttribute("dynsrc", imgSrc);
				}
				j = j + 1;
			}

			// dynamic blocks and images
			while (i < document.all.tags("div").length)
			{
				if (document.all.tags("div")(i).id.indexOf("blockId") == 0)
				    document.all.tags("div")(i).className = "dynamicexpandedblock";
				
				if (document.all.tags("div")(i).id.indexOf("dynImgLoID") == 0)
				    document.all.tags("div")(i).className = "dyniconhide";

				if (document.all.tags("div")(i).id.indexOf("dynImgHiID") == 0)
				    document.all.tags("div")(i).className = "dynimageshow";
				
				i = i + 1;
			}

			// expandingglossaryentry
			i = 0;
			while (i < document.all.tags("span").length)
			{
				if (document.all.tags("span")(i).id.indexOf("expge_id") == 0){
					document.all.tags("span")(i).style.display="inline";
				}
				i= i+1;
			}
			state="show";
			break;

		case "show":

			// dynamic images
			while (j < document.all.tags("img").length)
			{
				imgSrc = document.all.tags("img")(j).src;
				if (endsWith(imgSrc, "iconClosed.gif")) {
					document.all.tags("img")(j).src = "../Resources/images/iconClosed.gif";
				}
				else if (endsWith(imgSrc.toLowerCase(), "avi")) {
					document.all.tags("img")(j).setAttribute("dynsrc", "DUMMY.gif");
				}
				j = j + 1;
			}

			// dynamic blocks and images
			while (i < document.all.tags("div").length)
			{
				if (document.all.tags("div")(i).id.indexOf("blockId") == 0)
				    document.all.tags("div")(i).className = "dynamicblock";
				
				if (document.all.tags("div")(i).id.indexOf("dynImgLoID") == 0)
				    document.all.tags("div")(i).className = "dyniconshow";
				
				if (document.all.tags("div")(i).id.indexOf("dynImgHiID") == 0)
				    document.all.tags("div")(i).className = "dynimagehide";
				
				i = i + 1;
			}

			// expandingglossaryentry
			i = 0;
			while (i < document.all.tags("span").length)
			{
				if (document.all.tags("span")(i).id.indexOf("expge_id") == 0){
					document.all.tags("span")(i).style.display="none";
				}
				i= i+1;
			}

			state="hide";
			break;
	}
}
	

//*************************************************************
// Function:   closeDynamicBlocks
// Arguments:  ()
// Purpose:    Close all dynamic blocks.
//*************************************************************
function closeDynamicBlocks()
{
	state = "show";
	toggleDynamicBlocks();
}

//*************************************************************
// Function:   closeDynamicBlocks
// Arguments:  ()
// Purpose:    Close all dynamic blocks.
//*************************************************************
function openDynamicBlocks()
{
	state = "hide";
	toggleDynamicBlocks();
}


//*************************************************************
// Function:   closeDynamicBlocks
// Arguments:  ()
// Purpose:    Close all dynamic blocks.
//*************************************************************
function showNext()
{
	history.forward();
	
}

//*************************************************************
// Function:   closeDynamicBlocks
// Arguments:  ()
// Purpose:    Close all dynamic blocks.
//*************************************************************
function showPrevious()
{
	history.back();
}


//*************************************************************
// Function:   hideImageIcon
// Arguments:  imgIdLo: element to hide
//             imgIdHi: element to show
//*************************************************************
function hideImageIcon(imgIdLo, imgIdHi) {
    // hide icon
    document.getElementById(imgIdLo).className = "dyniconhide";

    // show image
    document.getElementById(imgIdHi).className = "dynimageshow";
    return;
}

//*************************************************************
// Function:   showImageIcon
// Arguments:  imgIdLo: element to show
//             imgIdHi: element to hide
//*************************************************************
function showImageIcon(imgIdLo, imgIdHi) {
    // hide image
    document.getElementById(imgIdHi).className = "dynimagehide";

    // show icon
    document.getElementById(imgIdLo).className = "dyniconshow";
    return;
}


//*************************************************************
// Function:	showImageIconAVI
// Arguments:	imgIdLo: element to hide
//				imgIdHi: element to show
//				imgId: element to reload
//*************************************************************
function showImageIconAVI(imgIdLo, imgIdHi, imgId) {

	// stop playing
	document.getElementById(imgId).setAttribute("dynsrc", "DUMMY.gif");
	
	// hide avi
	document.getElementById(imgIdHi).className = "dynimagehide";

	// show icon
	document.getElementById(imgIdLo).className = "dyniconshow";
	return;
}

//*************************************************************
// Function:	hideImageIconAVI
// Arguments:	imgIdLo: element to hide
//				imgIdHi: element to show
//				imgId: element to reload
//*************************************************************
function hideImageIconAVI(imgIdLo, imgIdHi, imgId) {

	// fill dynamic source
	var imgSrc = document.getElementById(imgId).src;
	document.getElementById(imgId).setAttribute("dynsrc", imgSrc);
	
	// show avi
	document.getElementById(imgIdHi).className = "dynimageshow";

	// hide icon
	document.getElementById(imgIdLo).className = "dyniconhide";
	return;
}


//*************************************************************
// Function:	initDynamicImages
// Arguments:	
//*************************************************************
function initDynamicImages() {
	var j = 0;
	while (j < document.all.tags("img").length) {
		var img = document.all.tags("img")(j);
		if (img.className == "staticavi") {
			img.setAttribute("dynsrc", img.getAttribute("src"));
		}
		j = j + 1;
	}
}

//*************************************************************
// Function:   changeImageIcon
// Arguments:  imgID (number of the image that has to be changed)
//             imgSrc (adress of the new image)
//             imgWidth (width of the new image)
// Purpose:    Change the displayed image of an HTML document.
//*************************************************************
function changeImageIcon(imgID, imgSrc, imgWidth)
{	
	imgName = document.images[imgID].src;
	iconName = imgName.substr((imgName.length - 14), 14);
	if (iconName == "DialogIcon.gif")
	{
		document.images[imgID].src = imgSrc;
		document.images[imgID].width = imgWidth;
	}
	else
	{
		document.images[imgID].width = 20;
		document.images[imgID].src = "../Resources/images/DialogIcon.gif"
	}
	return;
}
function changeImageIconAVI(imgID, imgSrc, imgWidth)
{	
	imgName = document.images[imgID].src;
	iconName = imgName.substr((imgName.length - 14), 14);
	if (iconName == "DialogIcon.gif")
	{
		document.images[imgID].dynsrc = imgSrc;
		document.images[imgID].removeAttribute("src");
		document.images[imgID].width = imgWidth;
		document.images[imgID].removeAttribute("height");
	}
	else
	{
		document.images[imgID].width = 20;
		document.images[imgID].height = 20;
		document.images[imgID].src = "../Resources/images/DialogIcon.gif";
		document.images[imgID].removeAttribute("dynsrc");
		document.images[imgID].focus();
	}
	return;
}

//*************************************************************
// Function:   changeDropDownButton
// Arguments:  imgID (number of the image that has to be changed)
// Purpose:    Change the displayed image of an HTML document.
//*************************************************************
function changeDropDownButton(imgID)
{
	imgName = document.images[imgID].src;
	iconName = imgName.substr((imgName.length - 10), 10);
	if (iconName == "closed.gif")
	{
		document.images[imgID].src = "../Resources/images/open.gif"
	}
	else
	{
		document.images[imgID].src = "../Resources/images/closed.gif"
	}
	return;
}


//*************************************************************
// Function:   hideshow
// Arguments:  elem (the div id)
// Purpose:    Hide/Show a div section
//*************************************************************
function hideshow(elem)
{
	if (elem.style.display == "none")
	{
		elem.style.display = "";
	}
	else
	{
		elem.style.display = "none";
	}
}


//*************************************************************
// Function:   showOnlyThisTable
// Arguments:  n (number of the table)
//             e (the div id, or 'all')
// Purpose:    Show a dynamic table and hide all other dynamic tables
//*************************************************************
function showOnlyThisTable(n, e)
{
	var tableId = n + "_";
	if (e == "all")
	{
		i=0;
		while (i < document.all.tags("div").length)
		{
			if (document.all.tags("div")(i).id.indexOf(tableId) == 0)
			{
				document.all.tags("div")(i).style.display="";
			}
			i= i+1;
		}
	}
	else
	{
		i=0;
		while (i < document.all.tags("div").length)
		{
		    if (document.all.tags("div")(i).id.indexOf(tableId) == 0) {
		        document.all.tags("div")(i).style.display = "none";
		    }		   
			i= i+1;
		}
		document.getElementById(e).style.display = "";
	}
}

//*************************************************************
// Workbench: Glossary
//*************************************************************
function GoGlossaryEntry(entry) {
	showGlossaryEntry(entry);
	if(location.href.indexOf("#")>-1)
	{
		location.href = location.href.substring(0,location.href.indexOf("#")) + "#" + "ge-id-" + entry;
	}
	else
		location.href = location.href + "#" + "ge-id-" + entry;
 }
 
 function showGlossaryEntry(entry) {
	var e = document.getElementById("blockId" + entry);
	e.style.display = "";
	imgName = document.images["buttonId" + entry].src;
	iconName = imgName.substr((imgName.length - 10), 10);
	document.images["buttonId" + entry].src = "../Resources/images/open.gif"
	return;	
 }
 
 function refreshSelectBox(entry,SelectBox,myevent) {
	var success = false;
	entry=entry.toLowerCase();
	
	if (  myevent.keyCode  == 13 )
	{GoGlossaryEntry(SelectBox.options[SelectBox.selectedIndex].value);
	}
	else
	{
		while (entry.length>0) 
		{
			var i = 0;
			while (i < SelectBox.options.length )
			{
				if(SelectBox.options[i].text.toLowerCase().indexOf(entry)==0)
				{
					SelectBox.options[i].selected=true;
					success = true;
					break;
				}
				i=i+1;
			}
			if(success)
			{
				break;
			}
			else
			{
				entry=entry.substr(0,entry.length-1);
			}
		}
	}
 }
 
 
function DisplayExpGE(id) {
var node = document.getElementById(id);
	if(node.style.display=='none')
	{
		node.style.display='inline';
	}
	else
	{
		node.style.display='none';
	}
}
 
//*************************************************************
// Workbench: Copy a program code to clipboard
//*************************************************************
function getText(node) {
var s = "";
var type = node.nodeType;
var i=0;
	if( type == 3 ) {
		// text node
		s = node.nodeValue;
	} else if( type == 1 ) {
		// xml element node
		var c = node.childNodes;
		for( i=0; i < c.length; i++ ) {
		s = s + getText( c[i] );
	}
}
return s;
}
function isXmlElement( node, name ) {
	if( (node.nodeType == 1)
		&& (node.nodeName.toLowerCase() == name) ) {
		return true;
	} else { return false; }
}
function CopyFirstColumnToClipboard(id) {
// select table/tbody/tr
var node = document.getElementById(id);
	while( node ) {
		var s = "";
		if( node.nodeType == 1 ) {
			s = " Name: " + node.nodeName;
		}
		if( isXmlElement( node, "table" ) ) {
			node = node.firstChild;
		} else if( isXmlElement( node, "thead" ) ) {
			node = node.nextSibling;
		} else if( isXmlElement( node, "tbody" ) ) {
			break;
		} else if( isXmlElement( node, "tr" ) ) {
			node = node.parentNode;
			break;
		} else {
			node = node.nextSibling;
		}
	}
	if( ! node ) { return; }
	
	var children = node.childNodes;
	var s = "";
	var i = 0;
	for( i=0; i < children.length; i++ ) {
		var c = children[i];
		if( isXmlElement( c, "tr" ) ) {
			var cc = c.firstChild;
			if( isXmlElement( cc, "td" ) ) {
				var ccc = cc.firstChild;
				if (ccc && isXmlElement(ccc, "p") && ccc.getAttribute("className") == "p_table_footer") {
					// IGNORE FOOTER
				}
				else {
					s = s + cc.innerText + "\n";
				}
			}
		}
	}
	var ta = document.getElementById("textarea"+id);
	ta.value = s;
	var r = ta.createTextRange();
	//r.execCommand("RemoveFormat");
	r.execCommand("Copy");
}
 

//*************************************************************
// Function:   saveHistory
// Arguments:  none
// Purpose:    Saves the history in the window.name property (must be called on load)
//*************************************************************
function saveHistory() {
	var browsehistory = new Array();
	if(window.name != "")	browsehistory = window.name.split("\n\n");
	while(browsehistory.length > 10) browsehistory.shift();
	
	browsehistory.push(document.title + ";;" + location.href);
	window.name = browsehistory.join("\n\n");
}
saveHistory();

function openDecodedURI(myUri)
{
	if(myUri.indexOf('chm::/') >= 0)
	{
		window.location.href = decodeURI(myUri);
	}
	else
	{
		var chmPrefix = 0;
		chmPrefix = window.location.href.toLowerCase().lastIndexOf('chm::/');
		window.location.href=window.location.href.substr(0,chmPrefix)+ 'chm::/'+decodeURI(myUri);
	}
}


//*************************************************************
// Function:   hideshowBlock
// Arguments:  blockId (the div id)
//			   imgId (id of drop-down arrow)
// Purpose:    Hide/Show a dynamic block
//*************************************************************
function hideshowBlock(blockId, buttonId)
{
	var j = 0;
	var imgSrc;
    var pImages = "../../Resources/images/";

    var elem = document.getElementById(blockId);
    var arrow = document.images[buttonId];

    if (elem.className == "dynamicblock") {

    	// change drop down image
        arrow.src = pImages + "iconOpen.gif";

        while (j < elem.all.tags("img").length) {
        	imgSrc = elem.all.tags("img")(j).src;
        	if (endsWith(imgSrc, "iconOpen.gif")) {
                elem.all.tags("img")(j).src = pImages + "iconClosed.gif";
            }
        	if (endsWith(imgSrc.toLowerCase(), "avi")) {
        		elem.all.tags("img")(j).setAttribute("dynsrc", imgSrc);
            }
            j = j + 1;
        }
        elem.className = "dynamicexpandedblock";
    }
    else {
        // change drop down image
        arrow.src = pImages + "iconClosed.gif";

        while (j < elem.all.tags("img").length) {
        	imgSrc = elem.all.tags("img")(j).src;
        	if (endsWith(imgSrc, "iconOpen.gif")) {
                elem.all.tags("img")(j).src = pImages + "iconClosed.gif";
            }
        	if (endsWith(imgSrc.toLowerCase(), "avi")) {
        		elem.all.tags("img")(j).setAttribute("dynsrc", "DUMMY.gif");
			}
            j = j + 1;
        }
        elem.className = "dynamicblock";
    }
}

function endsWith(string, suffix) {
	if (string == null)
		return false;
	return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

var pImages = "../../Resources/images/";
//*************************************************************
// Function:   hideshowGlossary
// Arguments:  blockId, buttonId
// Purpose:    Hides and displays text block in glossary
//*************************************************************
function hideshowGlossary(blockId, buttonId) {

	var elem = document.getElementById(blockId);
    var button = document.images[buttonId];
    if (elem) {
    	if (elem.className == "dynamic") {
    		elem.className = "dynamicexpanded";
    		button.src = pImages + "iconOpen.gif"
    	}
    	else {
    		elem.className = "dynamic";
    		button.src = pImages + "iconClosed.gif"
    	}
    	hideshow(elem);
    }
}

