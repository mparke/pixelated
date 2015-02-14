//protoype chain generator
function inherit(child, parent){
	function F(){};
	//this allows for prototype chaining where if we inherit further from the new child
	//this parent will not acquire the new child's prototype functions
	F.prototype = parent.prototype;
	child.prototype = new F();
}

//null and undefined check
function isVoid(val){
	return (val === null) || (val === undefined);
}

//define the class
function Observable(){};
//add prototype methods
Observable.prototype.addEvent = function(eventName){
	//we only want to add if it doesn't already exist, so we don't overwrite
	if(isVoid(this.events[eventName])){
		this.events[eventName] = [];
	}
};
Observable.prototype.addEvents = function(arr){
	var i = 0,
	length = arr.length;
	for(i; i < length; i++){
		this.addEvent(arr[i]);
	}
};
Observable.prototype.addListener = function(eventName, handler, scope){
	if(!isVoid(this.events[eventName])){
		var bound = handler.bind(scope);
		this.events[eventName].push(bound);
	}
};
Observable.prototype.fireEvent = function(eventName, options){
	var i = 0,
	length,
	arr;
	if(!isVoid(this.events[eventName])){
		arr = this.events[eventName];
		length = arr.length;
		for(i; i < length; i++){
			arr[i](options);
		} 
	}
};
