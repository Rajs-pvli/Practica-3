'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3, 'GRAB': 4};
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

var nextJump = 0;//Contador para el próximo salto


 ////////////ENTITY////////////////////////
function Entity(game,speed,direction,posX,posY,name){
    this.game=game;
    this._speed = speed;
    this._direction = direction;
    Phaser.Sprite.call(this,game,posX,posY,name);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

}

Entity.prototype = Object.create(Phaser.Sprite.prototype);//Ajustamos el prototipo
Entity.constructor = Entity;

Entity.prototype.changeDirectionLeft= function()
{
    if(this.scale.x > 0)
    {
        this.scale.x *= -1; 
    }

};

Entity.prototype.changeDirectionRight= function()
{
    if(this.scale.x < 0)
    {
        this.scale.x *= -1; 
    }

};

Entity.prototype.getEntity = function(){
    return this;
};

Entity.prototype.movement= function(x)
{
    //Si no hay salto, para que afecte la gravedad
    this.body.velocity.x =x;
};

Entity.prototype.isTouchingRight = function()
{
    return (this.body.touching.right || this.body.blocked.right);
}

Entity.prototype.isTouchingLeft = function()
{
    return (this.body.touching.left || this.body.blocked.left);
}

 ////////////ENTITY////////////////////////




/////////////////ENEMY////////////////////


function Enemy(game){

    Entity.call(this,game,400,Direction.LEFT,600, 1730,'enemy');
};

Enemy.prototype = Object.create(Entity.prototype);//Ajustamos el prototipo
Enemy.constructor = Enemy;

Enemy.prototype.updateEnemy_ = function(){

var moveDirection = new Phaser.Point(0, 0);
if(this._direction === Direction.RIGHT){
    moveDirection.x = this._speed;
    this.changeDirectionRight();
}
else if (this._direction === Direction.LEFT){
    moveDirection.x = -this._speed;
    this.changeDirectionLeft();

}
this.changeDirectionEnemy();
this.movement(moveDirection.x);

};


Enemy.prototype.changeDirectionEnemy = function(){//Cambia la dirección al chocar una pared
if(this.isTouchingRight()){
    
    this._direction = Direction.LEFT;
}
else if(this.isTouchingLeft()){
    
    this._direction = Direction.RIGHT;
}
//this.scale.x *= -1;
}

/////////////////ENEMY////////////////////


///////////////PLAYER///////////////////////

function Player(game)
{
    Entity.call(this,game,300,Direction.NONE,200,1700,'fox');
    this._jumpSpeed = 300; //velocidad de salto
    this._playerState= PlayerState.STOP; //estado del player
    this.gravityFall = false;
    this.gravityValue = 400;
    this.valueUnhandSpeed = 500;

	//nombre de la animación, frames, framerate, isloop
    /*
    //this.animations.add('run',
                Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
    //this.animations.add('stop',
                Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
    //this.animations.add('jump',
                Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
    //this.animations.add('grab',
                Phaser.Animation.generateFrameNames('rush_kick_a_',1,3,'',2),10,true);//Animación de agarre
    */

    //Gravedad del juego
    //this.body.bounce.y = 0.2;
    this.body.gravity.y = this.gravityValue;
    this.body.gravity.x = 0;

    //Velocidad del jugador
    this.body.velocity.x = 0;

    this.game.camera.follow(this,Phaser.Camera.FOLLOW_LOCKON);//La cámara te sigue

};

Player.prototype = Object.create(Entity.prototype);//Ajustamos el prototipo
Player.constructor = Player;


Player.prototype.update_ = function()
{
	var moveDirection = new Phaser.Point(0, 0);
    var movement = this.GetMovement();

    //transitions
    switch(this._playerState)
    {
        case PlayerState.STOP:
        case PlayerState.RUN:
            if(this.isJumping() && this.game.time.now > nextJump)
            {
                this._playerState = PlayerState.JUMP;
                moveDirection.y = -this._jumpSpeed;
                this.jump(moveDirection.y);

                ////this.animations.play('jump');
                nextJump = this.game.time.now + 1000;
            }
            else if (this.isStanding())
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    ////this.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    ////this.animations.play('stop');
                }
            }    
            else
                this._playerState = PlayerState.FALLING;
            break;
                
        case PlayerState.JUMP:
            if(this.isGrabbing())//Comprobamos si está colisionando
                {
                    this.body.allowGravity = false;
                    this._playerState = PlayerState.GRAB;
                    //this.animations.play('grab');
                }

            else
            {
                this._playerState = (this.isFalling() || this.isTouchingCeiling() || this.isTouchingRight() || this.isTouchingLeft())
                ? PlayerState.FALLING : PlayerState.JUMP;

            }
            break;
          
        case PlayerState.FALLING:
            if(this.isStanding())
            {
                if(movement !== Direction.NONE)
                {
                    this._playerState = PlayerState.RUN;
                    //this.animations.play('run');
                }
                else
                {
                    this._playerState = PlayerState.STOP;
                    //this.animations.play('stop');
                }
                nextJump = 0;

            }
            else if(this.isGrabbing())
            {
                this.body.allowGravity = false;
                this._playerState = PlayerState.GRAB; 
                //this.animations.play('grab');
            }
            break;

        case PlayerState.GRAB://Caso agarre
            
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > nextJump){//Caso en el que salta estando agarrado     
                    this.body.allowGravity = true;
             
                    this._playerState = PlayerState.UNHAND;
                    //this.animations.play('jump');
                    moveDirection.y = -this._jumpSpeed;
                    this.jump(moveDirection.y);


                    if(this.jumpDirection === Direction.RIGHT)
                        this.unhandSpeed =  this.valueUnhandSpeed;
                    else
                        this.unhandSpeed = - this.valueUnhandSpeed;


                    nextJump = this.game.time.now + 1000;                    

                } 
                else if(this.game.input.keyboard.isDown(Phaser.Keyboard.H)){//Caso en el que se suelta estando agarrado
                    this.body.allowGravity = true;
                    this._playerState = PlayerState.FALLING;   
                    //this.animations.play('stop');
                } 
                break; 

        case PlayerState.UNHAND://Caso soltarse

                if(this.isGrabbing())//Caso en el que se agarra
                {
                    this.body.allowGravity = false;
                    this._playerState = PlayerState.GRAB;
                    //this.animations.play('grab');
                }
                else if(this.isStanding())
                {
                    this._playerState = PlayerState.STOP;
                }
                else if(this.isTouchingRight() || this.isTouchingLeft() || (this.jumpDirection ===Direction.RIGHT && this.unhandSpeed< 0) || (this.jumpDirection ===Direction.LEFT && this.unhandSpeed> 0))
                    this._playerState = PlayerState.FALLING;


            break;

    }
    //States
    switch(this._playerState)
    {       
        case PlayerState.STOP:
            this.body.velocity.x = 0;

            break;
        case PlayerState.JUMP:
        case PlayerState.RUN:
        case PlayerState.FALLING:
            if(movement === Direction.RIGHT)
            {
                moveDirection.x = this._speed;
                this.changeDirectionRight();
            }
            else if (movement === Direction.LEFT)
            {
                moveDirection.x = -this._speed;
                this.changeDirectionLeft();
            }
            this.movement(moveDirection.x);
            break;    

        case PlayerState.GRAB:
            this.body.velocity.y = 0;
            break;


        case PlayerState.UNHAND:
        //this.jumpStrength -= 0.01;
            if(this.jumpDirection === Direction.RIGHT)
            {
                this.unhandSpeed = this.unhandSpeed - 2000/this.unhandSpeed;
                this.changeDirectionLeft();

            }
            else
            {
                this.unhandSpeed = (this.unhandSpeed - 2000/this.unhandSpeed);
                this.changeDirectionRight();
            }

            this.movement(this.unhandSpeed);                         

            break;
    }

    //Movimiento del jugador
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

Player.prototype.jump= function(y)
{
    this.body.velocity.y = y;
};


Player.prototype.isFalling= function(){
    if (!this.gravityFall)
        return(this.body.velocity.y > 0);
    
    else
        return(this.body.velocity.y < 0);

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

Player.prototype.isTouchingCeiling= function()//Caso en el que el personaje se choca con el techo
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

Player.prototype.isGrabbing= function()
{
    //Si el personaje se agarra a la pared por la izquierda, la dir de salto es derecha
    if (this.body.touching.left || this.body.blocked.left) 
        this.jumpDirection = Direction.RIGHT;
     
    //Si el personaje se agarra a la pared por la derecha, la dir de salto es izquierda
    else if (this.body.touching.right || this.body.blocked.right)
        this.jumpDirection = Direction.LEFT;
            
    return this.game.input.keyboard.isDown(Phaser.Keyboard.G) &&  (this.isTouchingRight() || this.isTouchingLeft());
};


Player.prototype.swapGravity= function()
{
	this.gravityFall= !this.gravityFall;
    this.body.gravity.y = -this.body.gravity.y;

    this.scale.y *= -1; 
    this._jumpSpeed = -this._jumpSpeed;

    this._playerState = PlayerState.FALLING;
    //this.animations.play('jump');
};

Player.prototype.getPjAnimations = function(){
	//return //this.animations;
};

///////////////PLAYER///////////////////////

module.exports = {Player: Player, Enemy: Enemy, Entity: Entity};
