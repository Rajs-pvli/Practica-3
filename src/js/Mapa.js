'use strict';

var Objetos = require('./Objects.js');
var Personajes = require('./Entidades.js');

var ObjectPhysical = Objetos.ObjectPhysical;
var Rocket = Objetos.Rocket;
var Gem = Objetos.Gem;


var Entity= Personajes.Entity;
var Player= Personajes.Player;
var Enemy= Personajes.Enemy;

function BuildMap(game)
{
	this.game = game;

	if(this.game.currentLevel === 1)
	{
        //Cargamos el tilemap en el map
        this.game.map =  game.add.tilemap('tilemap1');

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

    	//Colisiones con el plano de muerte y con el plano de muerte y con suelo.
    	this.game.map.setCollisionBetween(1, 500, true, 'Death');
    	this.game.map.setCollisionBetween(1, 500, true, 'GroundLayer');
        this.game.map.setCollisionBetween(1,500,true, 'Trigger');

        //Limites de colisiones
        this.game.world.setBounds(0, 0, this.game.map.widthInPixels, this.game.map.heightInPixels);//Límite del mundo

    	//Cambia la escala a x3.
    	//this.game.groundLayer.setScale(3,3);

        
        this.player = new Personajes.Player(this.game,200,200);
        this.game.world.addChild(this.player);

        var enemy = new Personajes.Enemy(this.game,210,700);
        var enemy2 = new Personajes.Enemy(this.game,1400,560);
        var enemy3 = new Personajes.Enemy(this.game,700,2060);
        var enemy4 = new Personajes.Enemy(this.game,1610,2060);
        var enemy5 = new Personajes.Enemy(this.game,2450,1050);
        var enemy6 = new Personajes.Enemy(this.game,5390,1330);

        this.enemies = this.game.add.group();
        this.enemies.add(enemy);
        this.enemies.add(enemy2);
        this.enemies.add(enemy3);
        this.enemies.add(enemy4);
        this.enemies.add(enemy5);
        this.enemies.add(enemy6);

        this.game.world.addChild(this.enemies);


        var gemBlue = new Gem(this.game,840,140,'gemaAzul');
        var gemGreen = new Gem(this.game,350,1680,'gemaVerde');
        var gemRed = new Gem(this.game,6890,420,'gemaRoja');
        var gemYellow = new Gem(this.game,6890,1330,'gemaAmarilla');

        this.gems = this.game.add.group();

        this.gems.add(gemBlue);
        this.gems.add(gemGreen);
        this.gems.add(gemRed);
        this.gems.add(gemYellow);
        this.game.world.addChild(this.gems);

        this.currentGems = 4;

        this.rocket = new Objetos.Rocket(this.game,400,200); 
        this.game.world.addChild(this.rocket);

        //Texto en el menú
        var goText = this.game.add.text(400, 100, "GameOver");
        goText.font = 'Indie Flower';//Elegimos la fuente
        goText.fontSize = 50;

        var i = 0;

        goText.visible = false;

        goText.anchor.set(0.5);

    
    }

    else if(this.game.currentLevel === 2)
    {
          //Cargamos el tilemap en el map
        this.game.map =  game.add.tilemap('tilemapSpace');

        //Asignamos al tileset 'patrones' la imagen de sprites tiles
        //patrones es lo de tiled y tiles, el nombre que tu le das en el main
        this.game.map.addTilesetImage('tiles_spritesheet','tiles');
        this.game.map.addTilesetImage('back','background');

        //Creacion de las layers
        this.game.backgroundLayer = game.map.createLayer('fondo');
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
        this.game.world.setBounds(0, 0, this.game.map.widthInPixels, this.game.map.heightInPixels);//Límite del mundo


        this.player = new Personajes.Player(this.game, 300,14500);
        var enemy = new Personajes.Enemy(this.game,600,300);
        var enemy2 = new Personajes.Enemy(this.game,2000,400);


        this.enemies = this.game.add.group();
        this.enemies.add(enemy);
        this.enemies.add(enemy2);


        this.game.world.addChild(this.player);
        this.game.world.addChild(this.enemies);


    }

    game.groundLayer.resizeWorld(); //resize world and adjust to the screen

};


BuildMap.prototype.update_ = function(){

    this.player.update_();
    this.enemies.forEach(function(enemy) {
        enemy.updateEnemy_();
    });
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
    //ENTIDADES
    this.player.destroy();
    this.enemies.destroy();

    //LAYERS
    this.game.groundLayer.destroy();
    this.game.backgroundLayer.destroy();
    this.game.death.destroy();
    this.game.trigger.destroy();
    if(this.game.currentLevel - 1=== 2)
        this.game.gravity.destroy();

    //MAPA
    this.game.map.destroy();
};

module.exports = BuildMap;