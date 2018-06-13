var exampleState = {
    
	marker:null,
	specailCutsceneID:null,
    enemySpecial1Paused:false,
    
	preload: function(){
	},
	
	create: function(){
		var canvas = $("canvas");
        var thisRef = this;
        
        //creates the level and the player character
		basicLevel_create();
		hud_create();
        
        //--------------------
        //LEVEL CREATE
        //--------------------
		
		//see basicLevel.js
		enableGroundTileDebugger();
		
		game.camera.flash("0x000000");
		
		console.log("end create");
	},
	
	update: function(){
        
        basicLevel_update();

        //--------------------
        //LEVEL UPDATE
        //--------------------
        
	},
	
	render: function(){
		//used to capture the frame rate
		game.debug.text(game.time.fps, 2, 14, "#000000");
	},	
	
    
	
    
};