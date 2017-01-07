'use strict';

//Require de las escenas
var PlayScene = require('./play_scene.js');
var GameOverScene = require('./gameover_scene.js');
var MenuScene = require('./menu_scene.js');


//Carga imágenes del menu y llama al state menu
var BootScene = {
  preload: function () {
    //Carga
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');//Barra de carga
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70,3);//Imagen del botón
    this.game.load.image('logo', 'images/phaser.png');//Imagen del logo
  },

  create: function () {
      this.game.state.start('menu');//Se carga la escena Menú
  }
};


var PreloaderScene = {
  
  preload: function () {
    //Barra de carga
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');//Añadimos la barra de carga
    this.loadingBar.anchor.setTo(0, 0.5);//Anclamos la barra
    this.game.load.setPreloadSprite(this.loadingBar);//Añadimos el sprite de precarga

    //Color de fondo en la escena de carga
    this.game.stage.backgroundColor = "#000000";

    //Nos suscribimos al evento de cuando se inicia la carga
    this.load.onLoadStart.add(this.loadStart, this);

    //Cargamos sprites
    this.game.load.tilemap('tilemap', 'images/mapa.json',null,Phaser.Tilemap.TILED_JSON);//Cargar el tilemap(hecho)
    this.game.load.image('tiles', 'images/tiles_spritesheet.png');//cargar sprites del tilemap
    this.game.load.image('grassTiles', 'images/sheet.png');//cargar sprites del tilemap
    this.game.load.image('fox','images/foxy.png');
    this.game.load.atlas('rush', 'images/rush_spritesheet.png','images/rush_spritesheet.json',Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);//cargar imagen personaje

    this.load.onLoadComplete.add(this.loadComplete, this);//Nos suscribimos al evento de cuando finaliza la carga
  },

  //Evento cuando inicia carga
  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
    
  //Evento cuando termina la carga
  loadComplete: function ()
  {
      this.game.state.start('play');
  },

  //Esto debería avanzar la barra de carga
  update: function(){//Aqui faltan cosas
      this._loadingBar
  }
};

//Cuando termina la carga de la ventana
window.onload = function () {
  WebFont.load(wfconfig);//Cargamos la fuente de la web
};

//Configuración de la fuente
var wfconfig = {
    //Se llama al principio
    active: function() { 
        console.log("font loaded");
        init();//llamamos a iniciar el juego
    },
    
    //Tipo de fuente
    google: {
        families: ['Sniglet']
    }
 
};

//Inicia el juego
function init()
{
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');//Creación del juego

//Asignación de los states
  game.state.add('boot', BootScene);
  game.state.add('menu', MenuScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('gameOver', GameOverScene);

//iniciamos el state 'boot'
  game.state.start('boot');//Inicia el menú

};



