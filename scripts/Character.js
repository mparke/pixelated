/**
*	@class Character a character in the game
*	@param {Object} attributes a key:value map of character attributes
*	@param {Object} baseActions a key:value map of base action functions
*	@param {Object} specials a key:value map of special action functions
*	@param {Object} items a key:value map of items to be added to this character's inventory
*/
function Character(tile, attributes, baseActions, specials, items){
	this.events = {};
	
	//key code map
	this.keyCodeMap = {
		119:'N', //w
	    97:'W', //a
		115:'S', //s
		100:'E' //d
	};

	this.attributes = {};
	this.actions = {};
	this.specials = {};
	this.inventory = {};
	this.initAttributes(attributes);
	this.initBaseActions(baseActions);
	this.initSpecials(specials);
	this.initInventory(items);
	
	//set the current character position
	this.pos = tile;
	this.initPublications();
	
	var movementHandler = this.genMovementHandler();
	this.initMovement(movementHandler);

	this.initUI();
}
inherit(Character, Observable);
Character.prototype.initPublications = function(){
	this.addEvent('movement');
};
//the character is responsible for knowing how to walk across path tiles
//but not for what is on those path tiles.
//let's implement a search
Character.prototype.genMovementHandler = function(){
	var me = this;
	return function(e){
		//console.log(me.keyCodeMap[e.charCode]);
		if(!isVoid(me.keyCodeMap[e.charCode])){
			var dir = me.keyCodeMap[e.charCode];
			if(!isVoid(me.pos[dir]) && me.pos[dir].path){
				me.fireEvent('movement', {
					currentTile: me.pos,
					nextTile: me.pos[dir]
				});
				me.pos = me.pos[dir];
				//so now that a new position has been set, the character should find out what's on the tile he just stepped on
				//call getActions on tile, which should be actions the character is forced to receive
			}
		}
	};
};

Character.prototype.initAttributes = function(attributes){
	for(var index in attributes){
		this.attributes[index] = attributes[index];
	}
};
Character.prototype.initBaseActions = function(actions){
	for(var index in actions){
		this.actions[index] = actions[index];
	}
};
Character.prototype.initSpecials = function(specials){
	for(var index in specials){
		this.specials[index] = specials[index];
	}
};
Character.prototype.initInventory = function(items){
	for(var index in items){
		this.inventory[index] = items[index];
	}
};
Character.prototype.initMovement = function(movementHandler){
	window.addEventListener('keypress', movementHandler, false);
};

//Uses the DM to init the UI for a character's options
//also hooks listeners to each UI option
//UI should utilize an exiting panel on the page to insert options into a list
Character.prototype.initUI = function(){
	
};