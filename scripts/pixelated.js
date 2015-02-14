
//Let's design the game around what a character can do.
//For everything that a character needs to be able to do, go and build that functionality.

//On init, the game should make ajax calls for additional data
//or the game should take params from the client side
//i.e. tileSize, pathPercent

//these properties are internal to the game
//a tile map with tiles 40x40 pixels provides 5x5 sections of 8x8 pixels
//the sections are calculated and gathered recursively until no more can be gathered
//20 is the smallest available tile size, due to stack overflow from recursively generating the map
//16 will blow up

	
var pxl = new Game();
pxl.setup = function(){
	var container = this.UISetup();
	
	//mapPercent, tileSize, pathPercent
	this.map = this.mapSetup(0.99, 20, .3, container);
	this.character = this.characterSetup(this.map.getPathRootTile());
	
	//apply the character's start position texture
	this.map.applyTexture(this.character.pos, 'character');
};
pxl.setup();

//forwards and backwards array that keeps upcoming and previous position strings to be used ['N'] as such
//an array of string directions that represents the entire path



//when looking at a tile, check each of it's directions
//if a direction is !null and !path then push it into a temporary array
//pass the temp array to a getRandom direction method
//the random direction method uses the length of the array to generate a random index number
//and then returns the direction from the array at the randomly generated index
//mark the new path tile as path = true, and increment the current path length counter
