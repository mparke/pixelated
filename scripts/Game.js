var Game = function(){
	this.events = {};
};
inherit(Game, Observable);
Game.prototype.UISetup = function(){
	var wrap = document.getElementById('gameWrap'),
	mapContainer = document.getElementById('game');
	
	var eightyWidth = (wrap.offsetWidth * .8);
	//alert(eightyWidth);
	mapContainer.style.width = (eightyWidth - (eightyWidth % 2));
	
	return mapContainer;
};
Game.prototype.mapSetup = function(mapPercent, tileSize, pathPercent, container){
	var mapHeight = this.getMapHeight(mapPercent, tileSize, container),
	mapWidth = this.getMapWidth(mapPercent, tileSize, container),
	canvas = this.createCanvas(mapHeight, mapWidth, container),
	terrains = [
		{
			name: 'grass',
			color: '#66CC33'
		},
		{
			name: 'dirt',
			color: '#663300'
		},
		{
			name: 'rock',
			color: '#333333'
		},
		{
			name: 'character',
			color: '#FFFFFF'
		}
	],
	map = new Map(canvas);
	
	//, tileSize, mapHeight, mapWidth, pathPercent, terrains
	map.setupTerrains(terrains);
	
	//Have these functions be pure, by returning a tile reference when they are finished
	//this ensures that each setup function is finished before the next one starts
	//and keeps the code clean and readable by lack of nested callbacks
	var tile = map.setupTiles(canvas, tileSize, mapHeight, mapWidth);
	tile = map.setupPath(tile, tileSize, pathPercent, mapHeight, mapWidth);
	console.log(tile);
	
	tile = map.setPathRootTile(tile);
	tile = map.setRootTile(tile);
	//the tile is now the rootTile, being the top left of the map
	map.applyTerrains(tile);
	return map;
};
Game.prototype.characterSetup = function(pathRootTile){
	var character = this.createCharacter(pathRootTile);
	character.addListener('movement', this.handleCharacterMovement, this);
	return character;
};
Game.prototype.handleCharacterMovement = function(options){
	//options should come with 
	this.map.applyTexture(options.currentTile, 'rock');
	this.map.applyTexture(options.nextTile, 'character');
};
Game.prototype.getMapHeight = function(percent, tileSize, container){
	var percentHeight = (container.offsetHeight * percent);
	return (percentHeight - (percentHeight % tileSize));
};
Game.prototype.getMapWidth = function(percent, tileSize, container){
	var percentWidth = (container.offsetWidth * percent);
	return (percentWidth - (percentWidth % tileSize));
};
Game.prototype.createCanvas = function(mapHeight, mapWidth, container){
	var canvas = document.createElement('canvas');
	canvas.id = 'tileMap';
	canvas.width = mapWidth;
	canvas.height = mapHeight;
	container.appendChild(canvas);
	return document.getElementById('tileMap');
};
Game.prototype.createCharacter = function(startTile){
	var attributes = {
		hp: 100,
		mana: 100
	};
	var baseActions = {
	};
	var specials = {
	};
	var items = {
		'Health Potion': 5,
		'Mana Potion': 5,
		'Rice': 10
	};
	return new Character(startTile, attributes, baseActions, specials, items);
};