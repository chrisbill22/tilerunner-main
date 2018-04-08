var bootState = {
	create: function(){
		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		console.log("game booted.");
		// Calling the load state now that the game is booted
		game.state.start('load');
	}
}