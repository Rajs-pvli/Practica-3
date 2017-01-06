'use strict';

function Pause (scene,pausePlayer) {
  this.scene = scene;
  this.pause = false;
  this.pauseAnimationPlayer = pausePlayer;
  this.createButton();
};

Pause.prototype.createButton = function ()
{
  this.buttonContinue = this.scene.game.add.button(this.scene.game.camera.x, 
                                        this.scene.game.camera.y + 100, 
                                        'button', 
                                        this.actionOnClick, 
                                        this, 2, 0, 0);
  var textContinue = this.scene.game.add.text(this.buttonContinue.x + 140, this.buttonContinue.y - 20, "Continue");//Creamos el texto
  textContinue.font = 'Sniglet';//Elegimos la fuente
  this.buttonContinue.addChild(textContinue);//Metemos el texto en el botón
  textContinue.anchor.set(-2);//Anclamos el botón

  this.buttonContinue.visible = false;
  this.buttonContinue.inputEnabled = false;
};

//Cuando se pulsa el boton
Pause.prototype.actionOnClick = function()
{
  this.scene.game.physics.arcade.isPaused=false;
  this.pauseAnimationPlayer.paused = false;

  this.buttonContinue.visible = false;
  this.buttonContinue.inputEnabled = false;

  this.pause = false;
};

//Se llama desde el update y detecta cuando se pulsa la p para activar la Pause
Pause.prototype.inputPause = function()
{
  if (this.scene.game.input.keyboard.isDown(Phaser.Keyboard.P))
  {        
    this.scene.game.physics.arcade.isPaused=true;
    this.pauseAnimationPlayer.paused = true;//Paramos la animación  

    this.buttonContinue.x = this.scene.game.camera.x;
    this.buttonContinue.visible = true;
    this.buttonContinue.inputEnabled = true;
    this.buttonContinue.anchor.set(-2);//Anclamos el botón

    this.pause = true;
  }
        
};

//Se le llama desde juego para comprobar si está Pausedo
Pause.prototype.isPaused = function()
{
  return this.pause;
};

module.exports = Pause;