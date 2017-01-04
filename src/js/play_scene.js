'use strict';

/*Enumerados: PlayerState son los estado por los que pasa el player. 
Directions son las direcciones a las que se puede mover el player.*/
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3, 'GRAB':4, 'UNHAND': 5}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

var nextJump = 0;
var nextGravityFall = 0;


//Scena de juego.
var PlayScene = {
    _rush: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 250, //velocidad de salto
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.

    gravityFall: false,
    //Método constructor...
  create: function () {
      //Creamos al player con un sprite por defecto.
      //Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
      this._rush = this.game.add.sprite(10,10,'rush');

      //Cargamos el tilemap en el map
      this.map =  this.game.add.tilemap('tilemap');

      //Asignamos al tileset 'patrones' la imagen de sprites tiles
      this.map.addTilesetImage('patrones','tiles');

      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('BackgroundLayer');
      this.groundLayer = this.map.createLayer('GroundLayer');

      //plano de muerte
      this.death = this.map.createLayer('Death');
      this.gravity = this.map.createLayer('Gravity');

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      //Rango de tiles con colision
      this.map.setCollisionBetween(1, 5000, true, 'Death');
      this.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
      this.map.setCollisionBetween(1,5000,true, 'Gravity');
      this.death.visible = false;

      //Cambia la escala a x3.
      this.groundLayer.setScale(3,3);
      this.backgroundLayer.setScale(3,3);
      this.death.setScale(3,3);
      this.gravity.setScale(3,3);
      
      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen
      
      //nombre de la animación, frames, framerate, isloop
      this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this._rush.animations.add('grab',
                     Phaser.Animation.generateFrameNames('rush_kick_a_',1,3,'',2),10,true);//Animación de agarre
      this.configure();


        this.buttonContinue = this.game.add.button(this.game.camera.x, 
                                               this.game.camera.y + 100, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 0, 0);
        var textContinue = this.game.add.text(this.buttonContinue.x + 140, this.buttonContinue.y - 20, "Continue");//Creamos el texto
        textContinue.font = 'Sniglet';//Elegimos la fuente
        this.buttonContinue.addChild(textContinue);//Metemos el texto en el botón
        textContinue.anchor.set(-2);//Anclamos el botón

        this.buttonContinue.visible = false;
        this.buttonContinue.inputEnabled = false;

        this.pause = false;


  },

   //Al pulsar el botón
    actionOnClick: function(){
        this.game.physics.arcade.isPaused=false;
        this.pause = false;
        this._rush.animations.paused = false;

        this.buttonContinue.visible = false;
        this.buttonContinue.inputEnabled = false;

    }, 
    
    //IS called one per frame.
    update: function () {
     
       if (!this.pause)
       {
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
        var movement = this.GetMovement();//Input derecha/izquierda
        this._rush.body.gravity.x -= this._rush.body.gravity.x *0.05;//Gravedad


        //Pausa
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)){           
            this.buttonContinue.visible = true;
            this.buttonContinue.inputEnabled = true;
            this.game.physics.arcade.isPaused=true;
            this.pause = true;
            this.buttonContinue.anchor.set(-2);//Anclamos el botón
            this._rush.animations.paused = true;//Paramos la animación
            this.buttonContinue.x = this.game.camera.x;

        }

        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap) && this.game.time.now > nextJump){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._rush.y;
                    this._rush.animations.play('jump');
                    nextJump = this.game.time.now + 1000;


                }
                else if(this.gravityFall)
                {
                    this._playerState = PlayerState.FALLING;
                    this._rush.animations.play('jump');
                }

                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:

                if(this.isGrabbing(collisionWithTilemap))//Comprobamos si está colisionando
                {
                    this._playerState = PlayerState.GRAB;
                    this._rush.animations.play('grab');
                }

                
                else
                {
                this._playerState = (!this.isFalling())
                    ? PlayerState.JUMP : PlayerState.FALLING;
                }

                           if (collisionWithTilemap && this._rush.body.blocked.up//No te puedes mover hacia abajo
         || this._rush.body.touching.up)
                    this._playerState = PlayerState.FALLING;
                
         

                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }

                    
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                    nextJump = 0;

                }
                else if(this.isGrabbing(collisionWithTilemap))
                {
                    this._playerState = PlayerState.GRAB; 
                    this._rush.animations.play('grab');

                }
                break;

            case PlayerState.GRAB://Caso agarre
            
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > nextJump){//Caso en el que salta estando agarrado                  
                    this._playerState = PlayerState.UNHAND;
                    this._initialJumpHeight = this._rush.y;
                    this._rush.animations.play('jump');
                    nextJump = this.game.time.now + 1000;
                    

                } 
                else if(this.game.input.keyboard.isDown(Phaser.Keyboard.H)){//Caso en el que se suelta estando agarrado
                    this._playerState = PlayerState.FALLING;   
                } 
                break;

            case PlayerState.UNHAND://Caso soltarse

                if(this.isGrabbing(collisionWithTilemap))//Caso en el que se agarra
                {
                    this._playerState = PlayerState.GRAB;
                    this._rush.animations.play('grab');
                }

                else if (!collisionWithTilemap)
                {
                    this._playerState = (!this.isFalling())
                    ? PlayerState.UNHAND : PlayerState.FALLING;
                }

                else if (collisionWithTilemap)
                        this._playerState = PlayerState.FALLING;

            break;

        }

        //States
        switch(this._playerState){
                
            case PlayerState.STOP:
                moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    moveDirection.x = this._speed;
                    if(this._rush.scale.x < 0)
                    {
                        this._rush.body.position.x = this._rush.body.position.x -30;
                        this._rush.scale.x *= -1;
                    }
                }
                else if (movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._rush.scale.x > 0)
                    {
                        this._rush.body.position.x = this._rush.body.position.x +30;
                        this._rush.scale.x *= -1; 
                    }
                }
                if(this._playerState === PlayerState.JUMP)
                    moveDirection.y = -this._jumpSpeed;
                

                break;  

            case PlayerState.GRAB:
                moveDirection.y =  this.currentJumpHeight;


                break;

            case PlayerState.UNHAND:
                moveDirection.y = -this._jumpSpeed * 1.5;

                //Caso en el que la dir de salto es izquierda
                if (this.jumpDirection === Direction.LEFT) 
                {
                    moveDirection.x = -this._jumpSpeed / 3 - 100 ;
                    this._rush.body.gravity.x= -20000;//Gravedad

                }
                
                //Caso en el que la dir de salto es derecha
                else if (this.jumpDirection === Direction.RIGHT)
                {
                    moveDirection.x = this._jumpSpeed / 3 + 100;  
                    this._rush.body.gravity.x= 20000;//Gravedad

                }                                

                break;
                
        }
        //movement
        this.movement(moveDirection,50,
                      this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);

        this.checkPlayerFell();//Comprueba si el jugador se ha caido
        this.modifyGravity();
    }
    
    },

    //Comprobamos si está en contacto con la pared tanto por la derecha como por la izquierda y bloqueamos el movimiento
    isGrabbing: function(collisionWithTilemap){

        //Si el personaje se agarra a la pared por la izquierda, la dir de salto es derecha
        if (this._rush.body.touching.left || this._rush.body.blocked.left) 
            this.jumpDirection = Direction.RIGHT;
     
        //Si el personaje se agarra a la pared por la derecha, la dir de salto es izquierda
        else if (this._rush.body.touching.right || this._rush.body.blocked.right)
            this.jumpDirection = Direction.LEFT;
            
        return this.game.input.keyboard.isDown(Phaser.Keyboard.G) && collisionWithTilemap && 
        ((this._rush.body.touching.left || this._rush.body.blocked.left) ||(this._rush.body.touching.right || this._rush.body.blocked.right)); 
    },
    
    //Detección de si puede saltar
    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },
    
    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap;//jamping???
    },

    isStanding: function(){
        this.gravityFall = false;
        if (this._rush.body.gravity.y < 0)
        {
            return this._rush.body.blocked.up//No te puedes mover hacia abajo
         || this._rush.body.touching.up;//Colisionas por debajo
        }

        else
        {
        return this._rush.body.blocked.down//No te puedes mover hacia abajo
         || this._rush.body.touching.down;//Colisionas por debajo
     }
    },
    //Controlamos si la velocidad es negativa(el personaje cae)
    isFalling: function(){    
            if (this._rush.body.gravity.y > 0)
                return(this._rush.body.velocity.y < 0);
            else
                 return(this._rush.body.velocity.y > 0);

    },

    
    //Colisión con muerte
    onPlayerFell: function(){
        this.game.state.start('gameOver');
        this.destroy();
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._rush, this.death))
            this.onPlayerFell();
    },

    modifyGravity: function(){

    if(this.game.physics.arcade.collide(this._rush, this.gravity) && this.game.time.now > nextGravityFall){
        this.gravityFall= !this.gravityFall;
        this._rush.body.gravity.y = -this._rush.body.gravity.y;

        if(this._rush.body.gravity.y < 0)
            this._rush.body.position.y = this._rush.body.position.y +50;
        else
            this._rush.body.position.y = this._rush.body.position.y -50;

        this._rush.scale.y *= -1; 
        this._jumpSpeed = -this._jumpSpeed;
        nextGravityFall = this.game.time.now + 1000;

    }
    //return (this._rush.body.touching.up || this._rush.body.blocked.up);

    },
    //Colisión con muerte//
  
    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },

    

     //Movimiento del jugador
    movement: function(point, xMin, xMax){
        if (point.y !== 0)
            this._rush.body.velocity = point;//
        else
            this._rush.body.velocity.x = point.x

        //Comrpuebo con los límites del juego

        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;

    },
    
   
    //Configura la escena al inicio
    configure: function(){
        //Start the Arcade Physics systems
        this.game.world.setBounds(0, 0, 2400, 160);//Límite del mundo

        this.game.physics.startSystem(Phaser.Physics.ARCADE);//Carga físicas
        this.game.stage.backgroundColor = '#a9f0ff';//Color de fondo
        this.game.physics.arcade.enable(this._rush, Phaser.Physics.ARCADE);
        

        //this._rush.body.bounce.y = 0.2; //Rebota pero no se modifica nada
        this._rush.body.gravity.y = 400;//Gravedad

       // this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;
        this.game.camera.follow(this._rush,Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);//La cámara te sigue
    },

   
    //Destruimos los recursos tilemap, tiles y logo.
    destroy: function()
    {
        this.groundLayer.destroy();
        this.backgroundLayer.destroy();
        this.map.destroy();
        this._rush.destroy();
        this.game.world.setBounds(0,0,800,600);

    }

};

module.exports = PlayScene;