/**
*	@class A tile (40px) is an area of the map that is subdivided into other areas
*	A tile points N, S, E, W as a quad linked list to allow for character traversal.
*	The algorithm used generates tiles from left to right, and then down 
*	the 2 dimensional bitmap. Generating a series of rows, the first node
*	in a row is passed to each subsequent row once the end of the map in width has been reached.
*	
*			null			  null				 null
*			 N				   N				  N
*		  --------			--------		  --------
*		 |		  |	<-- W  |		| <-- W  |		  |
* null W |		  | E -->  |		| E -->  |		  | E null
*		 |		  |		   |		|		 |		  |
*		  --------			--------		  --------
*			 S 				   S 		  		  S
*			 | ^			   | ^				  | ^
*			 v |			   v |				  v |
*			   N				 N					N
*		  --------			--------		  --------
*		 |		  |		   |		|		 |		  |
*	
*
*
*	
*	@param {String} actions an array of string names to generate action methods
*/
function Tile(startX, endX, startY, endY){
	this.startX = startX;
	this.endX = endX;
	this.startY = startY;
	this.endY = endY;
	this.path = false; //whether or not this is a path tile
}
Tile.prototype.setReferences = function(N, W, E, S){
	this.setN(N);
	this.setW(W);
	this.setE(E);
	this.setS(S);
};
/**
*	Sets the north pointer of this tile
*	Based on a left > right and top > down generation algorithm, if we're setting a north pointer,
*	the north is gauranteed to need a south pointer.
*	@param {Object} tile the tile to the north on the map
*/
Tile.prototype.setN = function(tile){
	this.N = tile;
	if(!isVoid(tile)){
		tile.setS(this);
	}
};
/**
*	Sets the west pointer of this tile
*	Based on the left > right, and top > down generation algirithm, if we're setting a west pointer,
*	the west is gauranteed to need an east pointer.
*	@param {Object} tile the tile to the west on the map
*/
Tile.prototype.setW = function(tile){
	this.W = tile;
	if(!isVoid(tile)){
		tile.setE(this);
	}
};
/**
*	Sets the east pointer of this tile
*	@param {Object} tile the tile to the east on the map
*/
Tile.prototype.setE = function(tile){
	this.E = tile;
};
/**
*	Sets the south pointer of this tile
*	@param {Object} tile the tile to the south on the map
*/
Tile.prototype.setS = function(tile){
	this.S = tile;
};
Tile.prototype.findLeftMost = function(){
	var temp = this;
	while(!isVoid(temp.W)){
		temp = temp.W;
	}
	return temp;
};
Tile.prototype.findTopLeft = function(){
	var leftMost = this.findLeftMost();
	while(!isVoid(leftMost.N)){
		leftMost = leftMost.N;
	}
	return leftMost;
};
Tile.prototype.findBottomLeft = function(){
	var leftMost = this.findLeftMost();
	while(!isVoid(leftMost.S)){
		leftMost = leftMost.S;
	}
	return leftMost;
};
//Tile.prototype.initActions = function(actions){
//	var len = actions.length;
//	for(var i = 0; i < len; i++){
//		//apply all the actions by named map
//	}
//};

