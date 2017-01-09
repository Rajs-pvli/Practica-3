'use strict';

///////////////ROCKET///////////////////////
function Rocket(game,posX,posY)
{
    this.game = game;
    Phaser.Sprite.call(this,game,posX,posY,'Rocket');
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.game.physics.arcade.enable(this);

}
Rocket.prototype = Object.create(Phaser.Sprite.prototype);//Ajustamos el prototipo
Rocket.constructor = Rocket;

Rocket.prototype.getRocket = function(){
    return this;
};

//Obtiene el Input del jugador
Rocket.prototype.move= function()
{
  this.body.velocity.y = 200;

};

///////////////ROCKET///////////////////////

///////////////COLLECTABLE///////////////////////
function Collectable(game,posX,posY)
{
    this.game = game;
    Phaser.Sprite.call(this,game,posX,posY,'Collectable');
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.game.physics.arcade.enable(this);

}
Collectable.prototype = Object.create(Phaser.Sprite.prototype);//Ajustamos el prototipo
Collectable.constructor = Collectable;
///////////////ROCKET///////////////////////
module.exports = {Rocket: Rocket, Collectable: Collectable};
