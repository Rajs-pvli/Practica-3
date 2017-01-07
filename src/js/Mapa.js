'use strict';

function BuildMap(game,nivel)
{
	this.game = game;
	if(nivel === 1)
	{
		//Cargamos el tilemap en el map
    	this.game.map =  game.add.tilemap('tilemap');


    	//Asignamos al tileset 'patrones' la imagen de sprites tiles
    	this.game.map.addTilesetImage('patrones','tiles');
        this.game.map.addTilesetImage('sheet','grassTiles');


    	//Creacion de las layers
    	this.game.backgroundLayer = game.map.createLayer('BackgroundLayer');
    	this.game.groundLayer = game.map.createLayer('GroundLayer');

    	//plano de muerte
    	this.game.death = game.map.createLayer('Death');
    	this.game.gravity = game.map.createLayer('Gravity');


    	//Colisiones con el plano de muerte y con el plano de muerte y con suelo.
    	this.game.map.setCollisionBetween(1, 5000, true, 'Death');
    	this.game.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
    	this.game.map.setCollisionBetween(1,5000,true, 'Gravity');

    	//Cambia la escala a x3.
    	//this.game.groundLayer.setScale(3,3);
    	//this.game.backgroundLayer.setScale(3,3);
    	//this.game.death.setScale(3,3);
    	//this.game.gravity.setScale(3,3);
    	game.groundLayer.resizeWorld(); //resize world and adjust to the screen
	}


};

BuildMap.prototype.getGroundLayer = function()
{
	return this.game.groundLayer;
};

BuildMap.prototype.getDeathLayer = function()
{
	return this.game.death;
};

BuildMap.prototype.getGravityLayer = function()
{
	return this.game.gravity;
};

BuildMap.prototype.destroy = function()
{
	this.game.groundLayer.destroy();
    this.game.backgroundLayer.destroy();
    this.game.map.destroy();
};

module.exports = BuildMap;