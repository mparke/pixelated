var DARKGREY = '#303030';
var WHITE = '#FFFFFF';
var LIGHTBLUE = '#319bd2';
var OFFWHITE = '#f5f5f5';
var WINDOWHEIGHT = window.innerHeight;
var WINDOWWIDTH = window.innerWidth;

function getSize(obj){
	var counter = 0;
	for(var index in obj){
		++counter;
	}
	return counter;
};

//Object.prototype.augment = function(config){
//	var index;	
//	for(index in config){
//		this[index] = config[index];
//	}
//};

//protoype chain generator
function inherit(child, parent){
	function F(){};
	//this allows for prototype chaining where if we inherit further from the new child
	//this parent will not acquire the new child's prototype functions
	F.prototype = parent.prototype;
	child.prototype = new F();
}

function isVoid(val){
	return (val === null) || (val === undefined);
}

function genRandomArrayChoice(arr){
	var len = arr.length,
	rand = Math.floor(Math.random() * len);
	return arr[rand];
}