'use strict';

function BuildMap(scene,nivel)
{
	this.scene = scene;
	if(nivel === 1)
	{
		//Cargamos el tilemap en el map
    	this.scene.map =  scene.game.add.tilemap('tilemap');

    	//Asignamos al tileset 'patrones' la imagen de sprites tiles
    	this.scene.map.addTilesetImage('patrones','tiles');

    	//Creacion de las layers
    	this.scene.backgroundLayer = scene.map.createLayer('BackgroundLayer');
    	this.scene.groundLayer = scene.map.createLayer('GroundLayer');

    	//plano de muerte
    	this.scene.death = scene.map.createLayer('Death');
    	this.scene.gravity = scene.map.createLayer('Gravity');


    	//Colisiones con el plano de muerte y con el plano de muerte y con suelo.
    	this.scene.map.setCollisionBetween(1, 5000, true, 'Death');
    	this.scene.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
    	this.scene.map.setCollisionBetween(1,5000,true, 'Gravity');

    	this.scene.death.visible = false;

    	//Cambia la escala a x3.
    	this.scene.groundLayer.setScale(3,3);
    	this.scene.backgroundLayer.setScale(3,3);
    	this.scene.death.setScale(3,3);
    	this.scene.gravity.setScale(3,3);
    	//scene.groundLayer.resizeWorld(); //resize world and adjust to the screen
	}


}

BuildMap.prototype.getGroundLayer = function()
{
	return this.scene.groundLayer;
}

BuildMap.prototype.getDeathLayer = function()
{
	return this.scene.death;
}

BuildMap.prototype.getGravityLayer = function()
{
	return this.scene.gravity;
}

BuildMap.prototype.destroy = function()
{
	this.scene.groundLayer.destroy();
    this.scene.backgroundLayer.destroy();
    this.scene.map.destroy();
}

module.exports = BuildMap;