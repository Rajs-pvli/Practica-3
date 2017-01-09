'use strict';

var Objetos = require('./Objects.js');
var Personajes = require('./Entidades.js');
var Rocket = Objetos.Rocket;
var Collectable = Objetos.Collectable;


var Entity= Personajes.Entity;
var Player= Personajes.Player;
var Enemy= Personajes.Enemy;

function BuildMap(game,nivel)
{
	this.game = game;
	if(nivel === 1)
	{
		//Cargamos el tilemap en el map
    	this.game.map =  game.add.tilemap('tilemap');


        this.player = new Personajes.Player(this.game);
        this.enemy = new Personajes.Enemy(this.game);

        this.game.world.addChild(this.player);
        this.game.world.addChild(this.enemy);


    	//Asignamos al tileset 'patrones' la imagen de sprites tiles
        //patrones es lo de tiled y tiles, el nombre que tu le das en el main
    	this.game.map.addTilesetImage('patrones','tiles');
        this.game.map.addTilesetImage('sheet','grassTiles');


    	//Creacion de las layers
    	this.game.backgroundLayer = game.map.createLayer('BackgroundLayer');
    	this.game.groundLayer = game.map.createLayer('GroundLayer');
        this.game.trigger = game.map.createLayer('Trigger');
        this.game.trigger.visible = false;


    	//plano de muerte
    	this.game.death = game.map.createLayer('Death');
    	this.game.gravity = game.map.createLayer('Gravity');


    	//Colisiones con el plano de muerte y con el plano de muerte y con suelo.
    	this.game.map.setCollisionBetween(1, 500, true, 'Death');
    	this.game.map.setCollisionBetween(1, 500, true, 'GroundLayer');
    	this.game.map.setCollisionBetween(1,500,true, 'Gravity');
        this.game.map.setCollisionBetween(1,500,true, 'Trigger');

        //Limites de colisiones
        this.game.world.setBounds(0, 0, 2400, 2100);//Límite del mundo

    	//Cambia la escala a x3.
    	//this.game.groundLayer.setScale(3,3);
    	//this.game.backgroundLayer.setScale(3,3);
    	//this.game.death.setScale(3,3);
    	//this.game.gravity.setScale(3,3);
    	game.groundLayer.resizeWorld(); //resize world and adjust to the screen

        this.rocket = new Objetos.Rocket(this.game,700,1700); 
        this.game.world.addChild(this.rocket);

	}


};
BuildMap.prototype.update_ = function(){

    this.player.update_();
    this.enemy.updateEnemy_();
}

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

BuildMap.prototype.getTriggerLayer = function()
{
    return this.game.trigger;
};

BuildMap.prototype.destroy = function()
{
	this.game.groundLayer.destroy();
    this.game.backgroundLayer.destroy();
    this.game.death.destroy();
    this.game.gravity.destroy();
    this.game.trigger.destroy();
    this.player.destroy();
    this.enemy.destroy();
    this.game.map.destroy();
};

module.exports = BuildMap;