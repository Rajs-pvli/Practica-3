'use strict';

var Pausa = require('./Pausa.js');
var Mapa = require('./Mapa.js');


var nextGravityFall = 0;

//Scena de juego.
var PlayScene = 
{
    
    //Método constructor...
  create: function () 
  {
    if(this.game.currentLevel === 1)
        this.mapa = new Mapa(this.game, 1);
     
    
    else if (this.game.currentLevel === 2)
        this.mapa = new Mapa(this.game, 2);

    this.configure();
    //Creamos la pausa
    this.pausa = new Pausa(this.game/*,this.player.getPjAnimations()*/);
  },
    
    //IS called one per frame.
    update: function () 
    {
        if (!this.pausa.isPaused())
        {
            this.game.physics.arcade.collide(this.mapa.player.getEntity(), this.mapa.getGroundLayer());
            this.game.physics.arcade.collide(this.mapa.enemy.getEntity(), this.mapa.getTriggerLayer());
         
            this.mapa.update_();



            //Comprueba si se ha tocado el modificador de gravedad
            this.modifyGravity();

            //Comprueba si el personaje se ha chocado con el enemigo o la capa death
            this.checkPlayerDeath();

               if(this.game.currentLevel === 1 && this.game.physics.arcade.collide(this.mapa.player.getEntity(), this.mapa.rocket.getRocket()))
                this.goToNextNevel();

            //Detectar input de pausa
            this.pausa.inputPause();
        }
        else if (this.pausa.goToMenu())
        {
            this.destroy();
            this.game.state.start('boot');

        }
    },

    //Comprueba si el jugador ha muerto por colision con la capa muerte o con el enemigo
    checkPlayerDeath: function()
    {
        if(this.game.physics.arcade.collide(this.mapa.player.getEntity(), this.mapa.enemy.getEntity())  
            || this.game.physics.arcade.collide(this.mapa.player.getEntity(), this.mapa.getDeathLayer()))
        {
            this.game.state.start('gameOver');
            this.destroy();
        }
    },

        //Comprueba si el jugador ha muerto por colision con la capa muerte o con el enemigo
    goToNextNevel: function()
    {
        this.game.currentLevel = 2;
        this.destroy();
        this.game.state.start('preloader');

        //DESTRUIR RECURSOS DEL NIVEL 1
        
    },


    //Colision con gravityFall
    modifyGravity: function()
    {
        if(this.game.physics.arcade.collide(this.mapa.player.getEntity(), this.mapa.getGravityLayer())&& this.game.time.now > nextGravityFall)
        {
            this.mapa.player.swapGravity();
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
    },
    
    //Destruimos los recursos tilemap, tiles y logo.
    destroy: function()
    {
        this.mapa.destroy();//Destruye todo lo referente al mapa
        

        this.game.world.setBounds(0,0,800,600);
    }

};

module.exports = PlayScene;
