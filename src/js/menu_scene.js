//State
var MenuScene = {
  //Al inicio del state
    create: function () {

        //Añadimos sprite de logo
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);//Anclamos el logo

        //Añadimos el botón
        var buttonStart = this.game.add.button(this.game.world.centerX + 50, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 0, 0);
        buttonStart.anchor.set(0.5);//Anclamos el botón

        buttonStart.scale.x*= 1.5;
        buttonStart.scale.y*= 1.5;

        var textStart = this.game.add.text(0, 0, "Start");//Creamos el texto
        textStart.font = 'Poppins';//Elegimos la fuente
        textStart.anchor.set(0.5);//Anclamos el texto
        //textStart.fill = '#43d637';//PODEMOS PODER COLOR ASÍ

        textStart.fill = '#FFA500';
        textStart.stroke = '#FF0000';
        textStart.strokeThickness = 3;


        buttonStart.addChild(textStart);//Metemos el texto en el botón
    },
    
    //Al pulsar el botón
    actionOnClick: function(){
        this.game.state.start('preloader');//Vamos al state de carga
    } 
};

module.exports = MenuScene;