//State
var FinalScene = {
  //Al inicio del state
    create: function () {

        //Añadimos sprite de logo
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'fondoFinal');
        logo.anchor.setTo(0.5, 0.5);//Anclamos el logo

        //Añadimos el botón
        var buttonMenu = this.game.add.button(this.game.world.centerX + 50, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 0, 0);
        buttonMenu.anchor.set(0.5);//Anclamos el botón

        buttonMenu.scale.x*= 1.5;
        buttonMenu.scale.y*= 1.5;

        var textMenu = this.game.add.text(0, 0, "Go to Menu");//Creamos el texto
        textMenu.font = 'Poppins';//Elegimos la fuente
        textMenu.anchor.set(0.5);//Anclamos el texto
        //textMenu.fill = '#43d637';//PODEMOS PODER COLOR ASÍ

        textMenu.fill = '#FFA500';
        textMenu.stroke = '#FF0000';
        textMenu.strokeThickness = 3;

        buttonMenu.addChild(textMenu);//Metemos el texto en el botón
    },
    
    //Al pulsar el botón
    actionOnClick: function(){
        //IMAGENES DEL PRELOADER
        this.game.cache.removeImage('preloader_bar');
        this.game.cache.removeImage('backPreloader_bar');
        this.game.cache.removeImage('fondoFinal');


        this.game.state.start('boot');//Vamos al state de carga
    } 
};

module.exports = FinalScene;