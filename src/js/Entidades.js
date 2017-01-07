'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3, 'GRAB': 4};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

var nextJump = 0;//Contador para el próximo salto

function Player(game)
{
    this.game = game;
    this._speed = 300; //velocidad del player
    this._jumpSpeed = 300; //velocidad de salto
    this._playerState= PlayerState.STOP; //estado del player
    this._direction = Direction.NONE;  //dirección inicial del player. NONE es ninguna dirección.
    this.gravityFall = false;
    this.gravityValue = 400;

	//Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
    Phaser.Sprite.call(this,game,10,10,'rush');

	//nombre de la animación, frames, framerate, isloop
    this.animations.add('run',
                Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
    this.animations.add('stop',
                Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
    this.animations.add('jump',
                Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
    this.animations.add('grab',
                Phaser.Animation.generateFrameNames('rush_kick_a_',1,3,'',2),10,true);//Animación de agarre

    this.game.physics.arcade.enable(this);

    this.body.collideWorldBounds = true;

    //Gravedad del juego
    //this.body.bounce.y = 0.2;
    this.body.gravity.y = this.gravityValue;
    this.body.gravity.x = 0;

    //Velocidad del jugador
    this.body.velocity.x = 0;

    this.game.camera.follow(this,Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);//La cámara te sigue

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.constructor = Player;

Player.prototype.update = function()
{
	var moveDirection = new Phaser.Point(0, 0);
    var movement = this.GetMovement();
    this.body.gravity.x -= this.body.gravity.x *0.05;//Gravedad

    //transitions
    switch(this._playerState)
    {
        case PlayerState.STOP:
        case PlayerState.RUN:
            if(this.isJumping() && this.game.time.now > nextJump)
            {
                this._playerState = PlayerState.JUMP;
                this.animations.play('jump');
                nextJump = this.game.time.now + 1000;

            }
            else
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    this.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    this.animations.play('stop');
                }
            }    
            break;
                
        case PlayerState.JUMP:
            if(this.isGrabbing())//Comprobamos si está colisionando
                {
                    this._playerState = PlayerState.GRAB;
                    this.animations.play('grab');
                    this.gravityValue = this.body.gravity.y;

                }

            else
            {
                this._playerState = (this.isFalling())
                ? PlayerState.FALLING : PlayerState.JUMP;

                if (this.isTouchingCeiling())
                    this._playerState = PlayerState.FALLING;
            }
            break;
          
                
        case PlayerState.FALLING:
            if(this.isStanding())
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    this.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    this.animations.play('stop');
                }
                nextJump = 0;

            }
            else if(this.isGrabbing())
            {
                this._playerState = PlayerState.GRAB; 
                this.animations.play('grab');
                this.gravityValue = this.body.gravity.y;

            }
            break;

        case PlayerState.GRAB://Caso agarre
            
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > nextJump){//Caso en el que salta estando agarrado                  
                    this._playerState = PlayerState.UNHAND;
                    this.animations.play('jump');
                    nextJump = this.game.time.now + 1000;
                    this.body.gravity.y = this.gravityValue;

                    

                } 
                else if(this.game.input.keyboard.isDown(Phaser.Keyboard.H)){//Caso en el que se suelta estando agarrado
                    this._playerState = PlayerState.FALLING;   
                    this.animations.play('stop');
                    this.body.gravity.y = this.gravityValue;

                } 
                break; 

        case PlayerState.UNHAND://Caso soltarse

                if(this.isGrabbing())//Caso en el que se agarra
                {
                    this._playerState = PlayerState.GRAB;
                    this.animations.play('grab');
                    this.gravityValue = this.body.gravity.y;

                }
                else 
                {
                    this._playerState = (!this.isFalling())
                    ? PlayerState.UNHAND : PlayerState.FALLING;

                    if (this.isTouchingCeiling())
                        this._playerState = PlayerState.FALLING;
                }


            break;

    }
    //States
    switch(this._playerState)
    {       
        case PlayerState.STOP:
            moveDirection.x = 0;
            break;
        case PlayerState.JUMP:
        case PlayerState.RUN:
        case PlayerState.FALLING:
            if(movement === Direction.RIGHT)
            {
                moveDirection.x = this._speed;
                if(this.scale.x < 0)
                {
                    this.body.position.x = this.body.position.x -30;
                    this.scale.x *= -1;
                 }
            }
            else if (movement === Direction.LEFT)
            {
                moveDirection.x = -this._speed;
                if(this.scale.x > 0)
                {
                    this.body.position.x = this.body.position.x +30;
                    this.scale.x *= -1; 
                }
            }
            if(this._playerState === PlayerState.JUMP)
                moveDirection.y = -this._jumpSpeed;
            else if(this._playerState === PlayerState.FALLING)
                moveDirection.y = 0;
            break;    

        case PlayerState.GRAB:
                moveDirection.y =  "grab";


                break;

            case PlayerState.UNHAND:
                moveDirection.y = -this._jumpSpeed * 1.5;

                //Caso en el que la dir de salto es izquierda
                if (this.jumpDirection === Direction.LEFT) 
                {
                    moveDirection.x = -this._jumpSpeed / 3 - 100 ;
                    this.body.gravity.x= -20000;//Gravedad

                }
                
                //Caso en el que la dir de salto es derecha
                else if (this.jumpDirection === Direction.RIGHT)
                {
                    moveDirection.x = this._jumpSpeed / 3 + 100;  
                    this.body.gravity.x= 20000;//Gravedad

                }                                

                break;
        }

    //Movimiento del jugador
    this.movement(moveDirection);
};

//Deteccion de si el jugador salta
Player.prototype.isJumping = function()
{
   return this.isStanding()  
         && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
};

Player.prototype.isStanding= function()
{
	if (!this.gravityFall)
	{
   		return this.body.blocked.down//No te puedes mover hacia abajo
         || this.body.touching.down;//Colisionas por debajo
    }
    else
    {
    	return this.body.blocked.up//No te puedes mover hacia abajo
         || this.body.touching.up;//Colisionas por debajo
     }

};

Player.prototype.isTouchingCeiling= function()
{
    if (!this.gravityFall)
    {
        return this.body.blocked.up//No te puedes mover hacia abajo
         || this.body.touching.up;//Colisionas por debajo
    }
    else
    {
        return this.body.blocked.down//No te puedes mover hacia abajo
         || this.body.touching.down;//Colisionas por debajo
     }

};


Player.prototype.isFalling= function(){
	if (!this.gravityFall)
    	return(this.body.velocity.y < 0);
	
	else
		return(this.body.velocity.y > 0);

};

//Obtiene el Input del jugador
Player.prototype.GetMovement= function()
{
 	var movement = Direction.NONE
    //Move Right
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        movement = Direction.RIGHT;
        
    //Move Left
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        movement = Direction.LEFT;
        
    return movement;

};

//Movimiento del jugador
Player.prototype.movement= function(point)
{
 	//Si no hay salto, para que afecte la gravedad
    if(point.y === 0)
        this.body.velocity.x = point.x;
    else if (point.y === 'grab')
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.body.gravity.y = 0;
    }
    else
        this.body.velocity = point;

};

Player.prototype.isGrabbing= function()
{
    //Si el personaje se agarra a la pared por la izquierda, la dir de salto es derecha
    if (this.body.touching.left || this.body.blocked.left) 
        this.jumpDirection = Direction.RIGHT;
     
    //Si el personaje se agarra a la pared por la derecha, la dir de salto es izquierda
    else if (this.body.touching.right || this.body.blocked.right)
        this.jumpDirection = Direction.LEFT;
            
    return this.game.input.keyboard.isDown(Phaser.Keyboard.G) && 
        ((this.body.touching.left || this.body.blocked.left) ||(this.body.touching.right || this.body.blocked.right)); 
    
};


Player.prototype.swapGravity= function()
{
	this.gravityFall= !this.gravityFall;
    this.body.gravity.y = -this.body.gravity.y;

    if(this.gravityFall)
        this.body.position.y = this.body.position.y +50;
    else
        this.body.position.y = this.body.position.y -50;

    this.scale.y *= -1; 
    this._jumpSpeed = -this._jumpSpeed;

    this._playerState = PlayerState.FALLING;
    this.animations.play('jump');
};

Player.prototype.getPj = function(){
	return this;
};

Player.prototype.getPjAnimations = function(){
	return this.animations;
};

Player.prototype.destroy_ = function(){
	this.destroy();
};


module.exports = Player;