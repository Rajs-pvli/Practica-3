var GameOver = {
    create: function () {
        console.log("Game Over");

        //Boton reset game
        var button = this.game.add.button(300, 300, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);

        //Texto en el menú
        var goText = this.game.add.text(400, 100, "GameOver");
        goText.anchor.set(0.5);

        //Texto dentro del botón
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        button.addChild(text);
        
        //Botón vuelta al menu
        var button2 = this.game.add.button(500, 300, 
                                          'button', 
                                          this.returnMainMenu, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);

        //Texto dentro del botón
        var text2 = this.game.add.text(0, 0, "Return menu");
        text2.anchor.set(0.5);
        button2.addChild(text2);
    },
    

    actionOnClick: function()
    {
        this.game.state.start('play');
    },

    returnMainMenu: function()
    {
        this.game.state.start('boot');
    }

};

module.exports = GameOver;