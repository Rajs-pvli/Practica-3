'use strict';

var Pausa = require('./Pausa.js');
var Mapa = require('./Mapa.js');
var Personajes = require('./Entidades.js');

var nextGravityFall = 0;

//Scena de juego.
var PlayScene = 
{
    //Método constructor...
  create: function () 
  {
    this.mapa = new Mapa(this, 1);

    this.player = new Personajes(this);

    this.configure();

    //Creamos la pausa
    this.pausa = new Pausa(this,this.player.getPjAnimations());
  },
    
    //IS called one per frame.
    update: function () {
        if (!this.pausa.isPaused())
        {
            var collisionWithTilemap = this.game.physics.arcade.collide(this.player.getPj(), this.mapa.getGroundLayer());

            this.player.update();

            //Comprueba si se ha tocado el modificador de gravedad
            this.modifyGravity();

            //Comprueba si el jugador ha caido
            this.checkPlayerFell();

            //Detectar input de pausa
            this.pausa.inputPause();
        }
    },

    //Colisión con muerte
    checkPlayerFell: function()
    {
        if(this.game.physics.arcade.collide(this.player.getPj(), this.mapa.getDeathLayer()))
        {
            this.game.state.start('gameOver');
            this.destroy();

        }
    },

    //Colision con gravityFall
    modifyGravity: function(){
        if(this.game.physics.arcade.collide(this.player.getPj(), this.mapa.getGravityLayer())&& this.game.time.now > nextGravityFall)
        {
            this.player.swapGravity();
            nextGravityFall = this.game.time.now + 1000;
        }

    },


    //Configura la escena al inicio
    configure: function()
    {
        //Color de fondo
        this.game.stage.backgroundColor = '#a9f0ff';

        //Start the Arcade Physics systems
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this.player.getPj());

        //Limites de colisiones
        this.game.world.setBounds(0, 0, 2400, 600);//Límite del mundo

    },
    
    //Destruimos los recursos tilemap, tiles y logo.
    destroy: function()
    {
        this.mapa.destroy();//Destruye todo lo referente al mapa
        this.player.destroy();
        this.game.world.setBounds(0,0,800,600);

    }

};

module.exports = PlayScene;
