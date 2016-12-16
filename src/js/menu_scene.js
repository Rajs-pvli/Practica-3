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
        var buttonStart = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 0, 0);
        buttonStart.anchor.set(0.5);//Anclamos el botón

        var textStart = this.game.add.text(0, 0, "Start");//Creamos el texto
        textStart.font = 'Sniglet';//Elegimos la fuente
        textStart.anchor.set(0.5);//Anclamos el texto
        buttonStart.addChild(textStart);//Metemos el texto en el botón
    },
    
    //Al pulsar el botón
    actionOnClick: function(){
        this.game.state.start('preloader');//Vamos al state de carga
    } 
};

module.exports = MenuScene;