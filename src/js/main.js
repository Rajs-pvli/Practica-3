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
    this.game.load.image('backPreloader_bar', 'images/fondoBarraCarga.png');//Barra de carga
    this.game.load.spritesheet('button', 'images/boton_azul.png', 190,46,3);//Imagen del botón
    this.game.load.spritesheet('buttonExit', 'images/boton_naranja.png', 190,45.5,3);//Imagen del botón
    this.game.load.image('logo', 'images/fondo.png');//Imagen del logo

    this.game.currentLevel = 1;

  },

  create: function () {
      this.game.state.start('menu');//Se carga la escena Menú
  }
};


var PreloaderScene = {
  
  preload: function () {
    //Barra de carga

    var fondoBarraCarga = this.game.add.sprite(80,300,'backPreloader_bar');
    fondoBarraCarga.anchor.setTo(0,0.5);
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');//Añadimos la barra de carga
    this.loadingBar.anchor.setTo(0, 0.5);//Anclamos la barra
    this.game.load.setPreloadSprite(this.loadingBar);//Añadimos el sprite de precarga

    //Color de fondo en la escena de carga
    this.game.stage.backgroundColor = "#000000";

    //Nos suscribimos al evento de cuando se inicia la carga
    this.load.onLoadStart.add(this.loadStart, this);

    if(this.game.currentLevel === 1)
    {
      //MAPA
      this.game.load.tilemap('tilemap1', 'images/mapa.json',null,Phaser.Tilemap.TILED_JSON);//Cargar el tilemap(hecho)
      
      //PERSONAJES
      this.game.load.image('fox','images/foxy.png');
      this.game.load.image('enemy','images/enemy.png');

      //TILES
      this.game.load.image('grassTiles', 'images/sheet.png');//cargar sprites del tilemap
      this.game.load.image('tiles', 'images/tiles_spritesheet.png');//cargar sprites del tilemap

      //OBJETOS
      this.game.load.image('gemaAzul','images/gemBlue.png');
      this.game.load.image('gemaRoja','images/gemRed.png');
      this.game.load.image('gemaAmarilla','images/gemYellow.png');
      this.game.load.image('gemaVerde','images/gemGreen.png');
      this.game.load.image('Rocket','images/cohete_off.png');
    }

    else if(this.game.currentLevel === 2)
    {
      /////////////DESTRUIR CACHE/////////////
      //MAPA
      this.game.cache.removeTilemap('tilemap1');

      //TILES
      this.game.cache.removeImage('grassTiles');

      //OBJETOS
      this.game.cache.removeImage('Rocket');
      this.game.cache.removeImage('gemaRoja');
      this.game.cache.removeImage('gemaAmarilla');
      this.game.cache.removeImage('gemaAzul');
      this.game.cache.removeImage('gemaVerde');
      ////////////////DESTRUIR CACHE/////////

      //MAPA
      this.game.load.tilemap('tilemapSpace', 'images/spaceLevel.json',null,Phaser.Tilemap.TILED_JSON);//Cargar el tilemap(hecho)
      
      //TILES
      this.game.load.image('background', 'images/back.png');//cargar sprites del tilemap
    }

    //this.game.load.atlas('rush', 'images/rush_spritesheet.png','images/rush_spritesheet.json',Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);//cargar imagen personaje

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
  update: function(){
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
        families: ['Poppins','Indie Flower']//boton, titulo / game over
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



