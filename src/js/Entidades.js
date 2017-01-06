'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3, 'GRAB': 4};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

var nextJump = 0;//Contador para el próximo salto

function Player(scene)
{
	this._rush= {}; //player
    this._speed = 300; //velocidad del player
    this._jumpSpeed = 500; //velocidad de salto
    this._playerState= PlayerState.STOP; //estado del player
    this._direction = Direction.NONE;  //dirección inicial del player. NONE es ninguna dirección.
    this.gravityFall = false;

	this.scene = scene;
	//Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
	this._rush = this.scene.game.add.sprite(10,10,'rush');

	//nombre de la animación, frames, framerate, isloop
    this._rush.animations.add('run',
                Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
    this._rush.animations.add('stop',
                Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
    this._rush.animations.add('jump',
                Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
    this._rush.animations.add('grab',
                Phaser.Animation.generateFrameNames('rush_kick_a_',1,3,'',2),10,true);//Animación de agarre

    this.scene.game.physics.arcade.enable(this._rush);

    this._rush.body.collideWorldBounds = true;


    //Gravedad del juego
    //this._rush.body.bounce.y = 0.2;
    this._rush.body.gravity.y = 400;
    this._rush.body.gravity.x = 0;

    //Velocidad del jugador
    this._rush.body.velocity.x = 0;

    this.scene.game.camera.follow(this._rush,Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);//La cámara te sigue

};

Player.prototype.update = function()
{
	var moveDirection = new Phaser.Point(0, 0);
    var movement = this.GetMovement();
    this._rush.body.gravity.x -= this._rush.body.gravity.x *0.05;//Gravedad

    //transitions
    switch(this._playerState)
    {
        case PlayerState.STOP:
        case PlayerState.RUN:
            if(this.isJumping() && this.scene.game.time.now > nextJump)
            {
                this._playerState = PlayerState.JUMP;
                this._rush.animations.play('jump');
                nextJump = this.scene.game.time.now + 1000;

            }
            /*  else if(this.gravityFall)
                {
                    this._playerState = PlayerState.FALLING;
                    this._rush.animations.play('jump');
                }
                */
            else
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    this._rush.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    this._rush.animations.play('stop');
                }
            }    
            break;
                
        case PlayerState.JUMP:
            if(this.isGrabbing())//Comprobamos si está colisionando
                {
                    this._playerState = PlayerState.GRAB;
                    this._rush.animations.play('grab');
                }

            else
            {
                this._playerState = (this.isFalling())
                ? PlayerState.FALLING : PlayerState.JUMP;
            }

             if (this.isTouchingCeiling())
                    this._playerState = PlayerState.FALLING;
            break;
          
                
        case PlayerState.FALLING:
            if(this.isStanding())
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    this._rush.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    this._rush.animations.play('stop');
                }
                nextJump = 0;

            }
            else if(this.isGrabbing())
            {
                this._playerState = PlayerState.GRAB; 
                this._rush.animations.play('grab');

            }
            break;

        case PlayerState.GRAB://Caso agarre
            
                if(this.scene.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.scene.game.time.now > nextJump){//Caso en el que salta estando agarrado                  
                    this._playerState = PlayerState.UNHAND;
                    this._rush.animations.play('jump');
                    nextJump = this.scene.game.time.now + 1000;
                    

                } 
                else if(this.scene.game.input.keyboard.isDown(Phaser.Keyboard.H)){//Caso en el que se suelta estando agarrado
                    this._playerState = PlayerState.FALLING;   
                } 
                break; 

        case PlayerState.UNHAND://Caso soltarse

                if(this.isGrabbing())//Caso en el que se agarra
                {
                    this._playerState = PlayerState.GRAB;
                    this._rush.animations.play('grab');
                }
                else 
                {
                    this._playerState = (!this.isFalling())
                    ? PlayerState.UNHAND : PlayerState.FALLING;
                }

                if (this.isTouchingCeiling())
                    this._playerState = PlayerState.FALLING;

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
                if(this._rush.scale.x < 0)
                {
                    this._rush.body.position.x = this._rush.body.position.x -30;
                    this._rush.scale.x *= -1;
                 }
            }
            else if (movement === Direction.LEFT)
            {
                moveDirection.x = -this._speed;
                if(this._rush.scale.x > 0)
                {
                    this._rush.body.position.x = this._rush.body.position.x +30;
                    this._rush.scale.x *= -1; 
                }
            }
            if(this._playerState === PlayerState.JUMP)
                moveDirection.y = -this._jumpSpeed;
            else if(this._playerState === PlayerState.FALLING)
                moveDirection.y = 0;
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

    //Movimiento del jugador
    this.movement(moveDirection);
};

//Deteccion de si el jugador salta
Player.prototype.isJumping = function()
{
   return this.isStanding()  
         && this.scene.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
};

Player.prototype.isStanding= function()
{
	if (!this.gravityFall)
	{
   		return this._rush.body.blocked.down//No te puedes mover hacia abajo
         || this._rush.body.touching.down;//Colisionas por debajo
    }
    else
    {
    	return this._rush.body.blocked.up//No te puedes mover hacia abajo
         || this._rush.body.touching.up;//Colisionas por debajo
     }

};

Player.prototype.isTouchingCeiling= function()
{
    if (!this.gravityFall)
    {
        return this._rush.body.blocked.up//No te puedes mover hacia abajo
         || this._rush.body.touching.up;//Colisionas por debajo
    }
    else
    {
        return this._rush.body.blocked.down//No te puedes mover hacia abajo
         || this._rush.body.touching.down;//Colisionas por debajo
     }



}


Player.prototype.isFalling= function(){
	if (!this.gravityFall)
    	return(this._rush.body.velocity.y < 0);
	
	else
		return(this._rush.body.velocity.y > 0);

};

//Obtiene el Input del jugador
Player.prototype.GetMovement= function()
{
 	var movement = Direction.NONE
    //Move Right
    if(this.scene.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        movement = Direction.RIGHT;
        
    //Move Left
    if(this.scene.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        movement = Direction.LEFT;
        
    return movement;

};

//Movimiento del jugador
Player.prototype.movement= function(point)
{
 	//Si no hay salto, para que afecte la gravedad
    if(point.y === 0)
        this._rush.body.velocity.x = point.x;
    else
        this._rush.body.velocity = point;

};

Player.prototype.isGrabbing= function()
{
 //Si el personaje se agarra a la pared por la izquierda, la dir de salto es derecha
        if (this._rush.body.touching.left || this._rush.body.blocked.left) 
            this.jumpDirection = Direction.RIGHT;
     
        //Si el personaje se agarra a la pared por la derecha, la dir de salto es izquierda
        else if (this._rush.body.touching.right || this._rush.body.blocked.right)
            this.jumpDirection = Direction.LEFT;
            
        return this.scene.game.input.keyboard.isDown(Phaser.Keyboard.G) && 
        ((this._rush.body.touching.left || this._rush.body.blocked.left) ||(this._rush.body.touching.right || this._rush.body.blocked.right)); 
    
};


Player.prototype.swapGravity= function()
{
	this.gravityFall= !this.gravityFall;
    this._rush.body.gravity.y = -this._rush.body.gravity.y;

    if(this.gravityFall)
        this._rush.body.position.y = this._rush.body.position.y +50;
    else
        this._rush.body.position.y = this._rush.body.position.y -50;

    this._rush.scale.y *= -1; 
    this._jumpSpeed = -this._jumpSpeed;
    this._playerState = PlayerState.FALLING;
    this._rush.animations.play('jump');
};

Player.prototype.getPj = function(){
	return this._rush;
}

Player.prototype.getPjAnimations = function(){
	return this._rush.animations;
}

Player.prototype.destroy = function(){
	this._rush.destroy();
}


module.exports = Player;