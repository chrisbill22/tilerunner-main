

var level1 = {
    
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
		
		
		
		//Level 1 stuff
		if(currentState == "tutorial"){
			this.ftuxRectangle_left = game.add.graphics();
			this.ftuxRectangle_left.lineStyle(4, 0xffffff, 1);
			this.ftuxRectangle_left.drawRect(2, 2, canvas.width()/2, canvas.height()-4-64);
			this.ftuxRectangle_left.fixedToCamera = true;
			this.ftuxRectangle_left.alpha = 0;
			
			this.ftuxRectangle_right = game.add.graphics();
			this.ftuxRectangle_right.lineStyle(4, 0xffffff, 1);
			this.ftuxRectangle_right.drawRect((canvas.width()/2)-2, 2, canvas.width()/2, canvas.height()-4-64);
			this.ftuxRectangle_right.fixedToCamera = true;
			this.ftuxRectangle_right.alpha = 0;
			
			this.ftux = game.add.text((canvas.width()/2) - 70, (canvas.height()/2) - 50, 'Tap to Start', {
				fontSize: '28px',
				fill: '#FFF'
			});
			this.ftux.setShadow(0, 2, 'rgba(0,0,0,1)', 4);
			this.ftux.fixedToCamera = true;
		}
		
		//cutscene box
		this.cutscene = game.add.graphics();
		this.cutscene.lineStyle(2, 0xffffff, 1);
		this.cutscene.beginFill(0x222222);
		this.cutscene.drawRect(10, 10, canvas.width()-20, 100);
		
		this.cutscene.lineStyle(2, 0xffffff, 1);
		this.cutscene.beginFill(0x222222);
		this.cutscene.drawRect(15, 15, canvas.width()-30, 90);
		
		this.cutscene.fixedToCamera = true;
		
		this.cutsceneText = game.add.text(25, 25, 'This is text This is text This is text This is text This is text', {
			fontSize: '18px',
			fill: '#FFFFFF'
		});
		this.cutsceneText.wordWrap = true;
		this.cutsceneText.wordWrapWidth = canvas.width()-50;
		this.cutsceneText.fixedToCamera = true;
		
		this.clickToContinueText = game.add.text(25, 125, 'Tap anywhere to continue', {
			fontSize: '18px',
			fill: '#333333'
		});
		this.clickToContinueText.fixedToCamera = true;

		this.cutscene.alpha = 0;
		this.cutsceneText.alpha = 0;
		this.clickToContinueText.alpha = 0;
		
		game.input.onDown.add(function(){
			if(game.paused == true){
				console.log("unpausing")
				game.paused = false;
				thisRef.cutscene.alpha = 0;
				thisRef.cutsceneText.alpha = 0;
				thisRef.clickToContinueText.alpha = 0;
				if(thisRef.specailCutsceneID == 2){
					runningCutscene = true;
					//console.log("fancy cutscene!!");
					thisRef.character.body.velocity.x = 0;
					thisRef.character.body.velocity.y = 0;
				}else if(thisRef.specailCutsceneID == 1){
					//enemy starts moving on it's own so no need for this anymore
                    console.log("SPECIAL 1");
                    enemies.children[0].body.velocity.y = -100;
				}else if(thisRef.specailCutsceneID == 3){
                    
                }
			}
		}, self);
		
		
		game.camera.flash("0x000000");
		
		//this.topLayer = map.createLayer('top');
		
		console.log("end create");
	},
	
	update: function(){
        
        runnerLevel_update();
		player_update();
		enemy_update(character, map, layer, this.marker);
		
        //Track items and cutscenes
        var thisRef = this;
        game.physics.arcade.overlap(character, items, function(character, item){
            item.kill();
            console.log(item);
            
            checkStandardItems(item);
            
            if(item.name == "ftux1"){
                thisRef.ftux.setText("Tap the left side of the screen");
                var canvas = $("canvas");
                levelState.ftux.setTextBounds(-90, -200);
                //thisRef.ftux.setTextBounds(80)
                thisRef.ftux.wordWrap = true;
                thisRef.ftux.wordWrapWidth = (canvas.width()/2)-map.tileWidth;
                game.add.tween(thisRef.ftuxRectangle_left).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }else if(item.name == "ftux2"){
                thisRef.ftux.setText("Tap the right side of the screen");
                var canvas = $("canvas");
                //levelState.ftux.setTextBounds(-80, -200);
                levelState.ftux.setTextBounds(95, -200);
                game.add.tween(thisRef.ftuxRectangle_right).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }else if(item.name == "ftux3"){
                thisRef.ftux.setText("Tap either side of the screen");
                var canvas = $("canvas");
                levelState.ftux.setTextBounds(0, 0);
                game.add.tween(thisRef.ftuxRectangle_right).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftuxRectangle_left).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
            }else if(item.name == "cutscene"){
                game.paused = true;
                thisRef.cutsceneText.setText(item.text);
                thisRef.cutscene.alpha = 1;
                thisRef.cutsceneText.alpha = 1;
                thisRef.clickToContinueText.alpha = 1;
                if(item.specialID){
                    console.log("SPECIAL ID = "+item.specialID);
                    thisRef.specailCutsceneID = item.specialID;
                }
            }
        });
        
        
        game.physics.arcade.overlap(enemies.children[0], items, function(enemy, item){
            if(item.specialID == 3){
                thisRef.camera.shake();
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
            }else if(item.specialID == 2 && thisRef.enemySpecial1Paused == false){
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
                thisRef.enemySpecial1Paused = true;
            }
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