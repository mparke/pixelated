function Map(canvas){
	this.events = {};
	
	this.directions = ['N', 'S', 'E', 'W'];
	this.oppDirections = {
		'N':'S',
		'S':'N',
		'E':'W',
		'W':'E'
	};
	this.terrainMap = {};
	this.terrainTypes = [];
	
	this.ctx = canvas.getContext('2d');
};
inherit(Map, Observable);
Map.prototype.setupTerrains = function(terrains){
	var len = terrains.length,
	ter;
	for(var i = 0; i < len; i++){
		ter = terrains[i];
		this.terrainMap[ter.name] = ter;
		this.terrainTypes.push(ter.name);
	}
};
Map.prototype.setupTiles = function(canvas, tileSize, height, width){
	//how should the map be stru ctured in data?
	var refObj = this.genRefObject(null, null, null, null);
	return this.buildTileSet(height, width, 0, 0, tileSize, refObj);
};
Map.prototype.setupPath = function(tile, tileSize, pathPercent, mapHeight, mapWidth){
	var totalTiles = ((mapHeight * mapWidth) / (tileSize * tileSize)),
	//calculate the minimum path length based on a % of the total number of tiles
	minPathLength = Math.floor(totalTiles * pathPercent),
	pathArr = [];
	return this.buildPath(tile, minPathLength, 0, pathArr);
};

/**
*	Builds a quad linked list of tile objects based on the available pixel size specified by
*	maxHeight and maxWidth, the tileSize, and starting x and y values
*	@param {Number} maxHeight the total height of the canvas bitmap
*	@param {Number} maxWidth the total width of the canvas bitmap
*	@param {Number} startX the starting x position on the canvas ( typically 0 )
*	@param {Number} startY the starting y position on the canvas ( typically 0 )
*	@param {Number} tileSize the desired size of tiles to me made
*	@param {Object} refs 4 tile object references, one for each direction on the map
*	@param {Object/Tile} refs.north the tile object to the north
*	@param {Object/Tile} refs.west the tile object to the west
*	@param {Object/Tile} refs.east the tile object to the east	
*	@param {Object/Tile} refs.south the tile object to the south
*/
Map.prototype.buildTileSet = function(maxHeight, maxWidth, startX, startY, tileSize, refs){
	//for now, just generate the object representation with proper sizing
	var tile = null,
	refObj = null,
	north;
	if((startY + tileSize) > maxHeight){
		//done return null
		return refs.N; //should be the last created tile
	}else {
		if((startX + tileSize) <= maxWidth){
			tile = new Tile(startX, (startX + tileSize), startY, (startY + tileSize));
			tile.setReferences(refs.N, refs.W, refs.E, refs.S);
			//INVARIANT: we are still generating tiles in this row
			startX = startX + tileSize;
			north = (!isVoid(refs.N) ? refs.N.E : null);
			refObj = this.genRefObject(north, refs.S, refs.E, tile);
		}else{
			//INVARIANT: we have reached the max width of the bitmap
			startX = 0;
			startY = startY + tileSize;
			var leftMost = refs.W.findLeftMost();
			refObj = this.genRefObject(leftMost, null, null, null);
		}
		return this.buildTileSet(maxHeight, maxWidth, startX, startY, tileSize, refObj);
	}
};
/**
*	Builds and returns array of string variables and marks tiles as path tiles as a side effect
*	
*/
Map.prototype.buildPath = function(tile, minPathLength, pathLengthSoFar, pathArr){
	if(pathLengthSoFar >= minPathLength){
		//done
		console.log('about to exit' + tile);
		return tile;
	}else{
		//INVARIANT: we can continue down the path
		tile.path = true;
		this.applyTexture(tile, 'rock');

		//var me = this;
		//this needs to be able to return two params, use a callback
		tile = this.choosePath(tile, pathArr);
		//function(pTile, randomDir){
		//	//save the direction of the path
		//	pathArr.push(randomDir);
		//	//increment path length
		//	++pathLengthSoFar;
		//	console.log(pTile[randomDir]);
		//	//setTimeout(function(){
		//	//	me.buildPath(minPathLength, pathLengthSoFar, pTile[randomDir], pathArr);
		//	//}, 50);
		//	me.buildPath(pTile[randomDir], minPathLength, pathLengthSoFar, pathArr);
		//});
		++pathLengthSoFar;
		return this.buildPath(tile, minPathLength, pathLengthSoFar, pathArr);
	}
};
/**
*	Chooses the next tile to be a path tile
*	Checks the available path options pointing out from the current tile. If there are available paths,
*	pick one at random, and if not, backtrack until there are available paths.
*	@param {Object} tile the current tile
*	@param {Array} pathArr an array of single character strings that represents each direction stepped along the path thus far
*	@param {Function} exitFn the callback function to pass the tile ( potentially backtracked ) and new random direction back
*/
Map.prototype.choosePath = function(tile, pathArr){
	//if we have reached a desired length, we can be done, if not, find the next path option
	//optionally use pathArr[pathArr.length - 1] as lastDir for pathOpts generation
	var pathOpts = this.genPathOpts(tile);
	//if path options is empty, we need to backtrack until a path option is available
	if(pathOpts.length > 0){
		//pass the last direction in the pathArr as the last visited direction
		//we want to avoid making two lefts, or two rights in a row
		var randomDir = genRandomArrayChoice(pathOpts);
		pathArr.push(randomDir);
		return tile[randomDir];
	}else{
		//INVARIANT: we have run out of path options, start backtracking
		var backtrackTile = this.backtrack(tile, pathArr);
		return this.choosePath(backtrackTile, pathArr);
	}
};
/**
*	Checks and generates available path options by checking the current tile against
*	the 4 available directions N S E W, making sure that a tile exists in the direction,
*	and that it is not already a path.
*	@param {Object} tile the tile to generate path options for
*/
Map.prototype.genPathOpts = function(tile){
	var pathOpts = [],
	len = this.directions.length,
	dir,
	randomDir;
	for(var i = 0; i < len; i++){
		dir = this.directions[i];
		//console.log('dir: ' + dir + ' and last dir : ' + lastDir);
		//dir !== lastDir && 
		if(!isVoid(tile[dir])){
			if(!tile[dir].path){
				//console.log('pushing ' + dir);
				pathOpts.push(dir);
			}
		}
	}
	return pathOpts;
};
/**
*	Backtracks 1 tile from the given tile using the given pathArr to reverse direction
*	@param {Object} tile the tile to backtrack from
*	@param {Array} pathArr an array of single character strings that represents each direction stepped along the path thus far
*/
//TODO: look into scenarios of deep backtracking, where backtracking to a tile results in
//backtracking to a place that wasn't in the pathArr originally, ending in null?
Map.prototype.backtrack = function(tile, pathArr){
	var lastDir = pathArr.pop();
	var backDir = this.oppDirections[lastDir];
	//console.log('backtracking from ' + lastDir + '  to  ' + backDir);
	return tile[backDir];
};
Map.prototype.genRefObject = function(N, S, E, W){
	return {
		N: N,
		S: S, 
		E: E,
		W: W
	};
};
//in the future, this should take a variety of different parameters
//iterating through the tiles with different applyTexture functions for each
//different terrain type
Map.prototype.applyTerrains = function(){
	this.ctx.fillStyle =  '#B6AFA9';
	this.iterateTiles(this.rootTile, this.applyTexture, 'grass');
};

/**
*	Builds terrain on the map by iterating through all
*/
Map.prototype.iterateTiles = function(tile, applyFn, applyParams){
	//can we get all the left most tiles, and then move left to right
	while(!isVoid(tile)){
		this.iterateTileRow(tile, applyFn, applyParams);
		tile = tile.S;
	}
};
//builds a row of terrain left to right
Map.prototype.iterateTileRow = function(tile, applyFn, applyParams){
	if(!isVoid(tile)){
		if(!tile.path){
			applyFn.call(this, tile, applyParams);
		}
		this.iterateTileRow(tile.E, applyFn, applyParams);
	}
};
//iterates only the path 
Map.prototype.iteratePath = function(){
	
};

//INVARIANT: we should be gauranteed that the tile and terrain both exist here.
Map.prototype.applyTexture = function(tile, terrainType){
	this.ctx.fillStyle = this.terrainMap[terrainType].color;
	this.ctx.fillRect(tile.startX, tile.startY, (tile.endX - tile.startX), (tile.endY - tile.startY));
};

Map.prototype.setRootTile = function(tile){
	this.rootTile = tile.findTopLeft();
	return this.rootTile;
};
Map.prototype.setPathRootTile = function(tile){
	this.pathRootTile = tile.findBottomLeft();
	return this.pathRootTile;
};
Map.prototype.getRootTile = function(){
	//this needs to return the first path tile
	//path always starts from the bottom left?
	//TODO: rename root tile to something more fitting, like "currTile or currentTile"
	return this.rootTile.findTopLeft();
};
Map.prototype.getPathRootTile = function(){
	return this.pathRootTile.findBottomLeft();
};

//Should all of the tiles be given properties on creation, or should properties be applied to the blank tiles

//NEXT: surrounding terrain generation
//questions to ask
//Do you border a path tile?
//if you border a path tile, on how many sides and which?
//if you don't border a path tile, default to some terrain type

//NEXT: item generation
//place special items ( at least 1 per dungeon ) on the map
//you cannot read what the item is until you reach it

//NEXT: search for items
//create the ability to search a number of times ( with a cooldown )
//if you search, a random generator should try to find cheap items for you
//within the available items to be searched in the dungeon
//there should also be a cap for searchable items per dungeon, as
//if you've been looking around and can't find anything else

//NEXT: character
//as character moves, each tile they step onto calls a function to randomly decide battle

//NEXT: message system, game -- player interaction
//instructions on how to play

//NEXT: Command window
//text commands? GUI commands? (thinking GUI is probably cooler)

//NEXT: write about the map generating algorithm and pseudorandom choices
//NEXT: write about simple backtracking