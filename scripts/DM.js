//generic dom functions
var DM = {};
//remove all child elements from a list
DM.removeChildren = function(parent){
	while(parent.hasChildNodes()){
        parent.removeChild(parent.firstChild);
    }
};
//typically, first and second are wrap divs
DM.swapChildUp = function(parent, child){
	var previousSibling = child.previousSibling;
	if(previousSibling !== null){
		var tempChild = parent.removeChild(child);
		parent.insertBefore(tempChild, previousSibling);
	}
};
DM.swapChildDown = function(parent, child){
	var nextSibling = child.nextSibling;
	var tempChild = parent.removeChild(child);
	if(nextSibling === null){
		//last in the list, append to parent
		parent.appendChild(tempChild);
	}else{
		parent.insertBefore(tempChild, nextSibling.nextSibling);
	}
};
//create and return a dom element
DM.genEl = function(tag, innerHTML, id, cls){
	var el = document.createElement(tag);
        if(innerHTML != null){
            el.innerHTML = innerHTML;
        }
        if(id != null){
            el.id = id;
        }
        if(cls !=null){
            el.setAttribute('class', cls);
        }
        return el;
};
//creates and returns an anchor element, href required
DM.genAnchor = function(href, innerHTML, id, cls){
        var a = document.createElement('a');
        a.href = href;
        if(innerHTML != null){
            a.innerHTML = innerHTML;
        }
        if(id != null){
            a.id = id;
        }
        if(cls != null){
            a.setAttribute('class', cls);
        }
        return a;
}, 
//creates and returns an image element, src required
DM.genImage = function(src, cls){
	var img = document.createElement('img');
        img.src = src;
        if(cls != null){
            img.setAttribute('class', cls);
        }
        return img;
};
//acquires the element position based traversing parent nodes
DM.getElementPosition = function(el){
	var offsetLeft = 0, offsetTop = 0;
	if (el.offsetParent) {
		do{
			offsetLeft += el.offsetLeft;
			offsetTop += el.offsetTop;
		}while(el = el.offsetParent);
	}
	return [offsetLeft, offsetTop];
};