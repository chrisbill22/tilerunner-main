var demo = {
    
	marker:null,
	specailCutsceneID:null,
    enemySpecial1Paused:false,
    
	preload: function(){
	},
	
	create: function(){
		var canvas = $("canvas");
        var thisRef = this;
        
        //creates the level and the player character
		runnerLevel_create();
		
        //debug helper
        if(enemyLogging == true){
            this.levelDebugger();
        }
		
		enemy_create();
        
        //--------------------
        //LEVEL CREATE
        //--------------------
		
		game.camera.flash("0x000000");
		
		//this.topLayer = map.createLayer('top');
		
		console.log("end create");
	},
	
	update: function(){
        
        runnerLevel_update();
		player_update();
		enemy_update(character, map, layer, this.marker);
		
        //--------------------
        //LEVEL UPDATE
        //--------------------
        var thisRef = this;
        game.physics.arcade.overlap(character, items, function(character, item){
            item.kill();
            console.log(item);
            
            checkStandardItems(item);
        });	
        
	},
	
	render: function(){
		game.debug.text(game.time.fps, 2, 14, "#000000");
	},	
	
	
	
	
	showCutscene: function(){
		
	},
    
	
    levelDebugger: function(){
        //Tile info debug marker
		this.marker = game.add.graphics();
		this.marker.lineStyle(2, 0x33ccff, 1);
		this.marker.drawRect(0, 0, map.tileWidth, map.tileHeight);

		//mouse input
		game.input.onTap.add(moveSelectedToCursor, this);
		
		//keyboard input
		var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		right.onDown.add(function () {
			movePlayer("right")
		}, this);

		var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(function () {
			movePlayer("left")
		}, this);

		var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		up.onDown.add(function () {
			movePlayer("up")
		}, this);

		var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		down.onDown.add(function () {
			movePlayer("down")
		}, this);
    }
};