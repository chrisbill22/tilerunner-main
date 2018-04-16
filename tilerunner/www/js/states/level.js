var levelState = {
	map:null,
	layer:null,
	marker:null,
	selectedTile:null,
	character:null,
	characterStarted:false,
	currentLane:{
		x: 0,
		y: 0
	},
	playerVelocity:-200,
	movingLanes:false,
	movingDelta:0,
	items:null,
	gold:0,
	goldText:null,
	healthProgress:null,
	footerBackground:null,
	endingY:null,
	tilesetOffset:0,
	
	blockRecharging:false,
	pitIds:Array(423,424,425),
	runningCutscene:false,
	specailCutsceneID:null,
	npcs:Array(),
	
    enemySpecial1Paused:false,
    
	preload: function(){
	},
	
	create: function(){
		
		var canvas = $("canvas");
		
		//load the map from the preload
		this.map = this.game.add.tilemap('map');
        if(currentState == "demo64"){
            this.map.setTileSize(64, 64);
        }
        //this.game.stage.backgroundColor = "#4488AA";

		//apply the tileset image which will be parsed out and loaded into the timemap
        if(currentState == "demo64"){
            console.log("64 set");
            groundtile = this.map.addTilesetImage('batch-necessary64', 'groundTile', 64, 64);
            this.map.addTilesetImage('protoblocks64', 'protoblocks', 64, 64);
        }else{
            this.map.addTilesetImage('batch-necessary', 'groundTile');
            this.map.addTilesetImage('protoblocks', 'protoblocks');
        }
        
        
        
        if(currentState == "level1"){
			//365 tile offset
            for(var i=0; i!=this.map.tilesets.length; i++){
                if(this.map.tilesets[i].name == "batch-necessary"){
                    this.groundTileOffset = this.map.tilesets[i].firstgid;
                }else if(this.map.tilesets[i].name == "protoblocks"){
                    this.tilesetOffset = this.map.tilesets[i].firstgid;
                }
            }
		}else if(currentState == "demo"){
			//1264 tile offset
			this.tilesetOffset=901;
			this.groundTileOffset = 1;
		}else if(currentState == "tutorial"){
			//tile offset
			this.tilesetOffset=1801;
			this.groundTileOffset = 0;
		}else if(currentState == "ai"){
			//1264 tile offset
			this.tilesetOffset=901;
			this.groundTileOffset = 0;
		}else if(currentState == "demo64"){
			//1264 tile offset
			this.tilesetOffset=901;
			this.groundTileOffset = 0;
		}
		console.log("CharacterStarted = "+this.characterStarted);
        
        
	
		//add all the standard layers we have in our Tiled file.
		//These must match Tiled layers
		this.layer = this.map.createLayer('foreground');
		this.map.setCollisionBetween(330+this.tilesetOffset, 500+this.tilesetOffset);

		this.layer.resizeWorld();

		//add the character
		this.character = this.game.add.sprite(0, 0, 'groundTile', 181);
        //this.character = this.game.add.tileSprite(0, 0, 64, 64, 'groundTile', 181+this.groundTileOffset);
        this.character.width = this.map.tileWidth;
        this.character.height = this.map.tileHeight;
        
		this.character.animations.add('walkUp', [189, 190, 191], 30, true);
		this.character.animations.add('walkDown', [180, 181, 182], 30, true);
		this.character.animations.add('walkLeft', [183, 184, 185], 30, true);
		this.character.animations.add('walkRight', [186, 187, 188], 30, true);
		this.character.animations.add('walkUpRight', [195, 196, 197], 30, true);
		this.character.animations.add('walkUpLeft', [198, 199, 200], 30, true);

		this.character.health = 4;
		this.character.maxHealth = 4;
		this.character.data.weapon = 0;

		this.character.events.onKilled.add(function(){
			//restartState();
			loadUpState("map");
		});
		
		this.game.physics.arcade.enable(this.character);

		this.game.camera.follow(this.character);
		this.game.camera.targetOffset.y = -64*2;

		//Tile info debug marker
		this.marker = this.game.add.graphics();
		this.marker.lineStyle(2, 0x33ccff, 1);
		this.marker.drawRect(0, 0, this.map.tileWidth, this.map.tileHeight);

		//mouse input
		game.input.onTap.add(this.moveSelectedToCursor, this);
		
		//keyboard input
		var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		right.onDown.add(function () {
			this.movePlayer("right")
		}, this);

		var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		left.onDown.add(function () {
			this.movePlayer("left")
		}, this);

		var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		up.onDown.add(function () {
			this.movePlayer("up")
		}, this);

		var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		down.onDown.add(function () {
			this.movePlayer("down")
		}, this);

		//create items and pits
		this.items = game.add.group();
		this.items.enableBody = true;
		var objectNames = Array();
		var thisRef = this;
		this.map.objects.objectsLayer.forEach(function (object) {
			if (object.type == "item" && objectNames.indexOf(object.name) == -1) {
				console.log("item, "+object.name);
				objectNames.push(object.name);
				var tileID = 541;
				if(object.gid != undefined){
					tileID = (object.gid - 1)
				}
				thisRef.map.createFromObjects("objectsLayer", object.name, "groundTile", tileID, true, false, thisRef.items, Phaser.Sprite, false);
			} else if (object.type == "playerStart") {
				thisRef.character.x = object.x;
				thisRef.character.y = object.y - thisRef.map.tileHeight;
			} else if(object.type == "gameEnd"){
				thisRef.endingY = object.y+object.height;
			}
		});
		
		console.log(objectNames);

		enemy_create(this.map, this.tilesetOffset, this.groundTileOffset);
		
		//big button input
		leftButton = this.game.add.button(0, 0, 'protoblocks', function(){}, this, 2, 2, 2);
        leftButton.onInputDown.add(function(){
            leftButtonDown = true;
        });
        leftButton.onInputUp.add(function(){
            leftButtonDown = false;
        });

		leftButton.width = canvas.width()/2;
		leftButton.height = canvas.height();
		leftButton.fixedToCamera = true;
		
        leftButtonDown = false;
        
		rightButton = this.game.add.button(canvas.width()/2, 0, 'protoblocks', function(){}, this, 2, 2, 2);
        
        rightButton.onInputDown.add(function(){
            rightButtonDown = true;
        });
        rightButton.onInputUp.add(function(){
            rightButtonDown = false;
        });
		rightButton.width = canvas.width()/2;
		rightButton.height = canvas.height();
		rightButton.fixedToCamera = true;
        
        rightButtonDown = false;
		
        console.log("render HUD");

		//HUD

		this.footerBackground = this.game.add.image(0, canvas.height() - 64, 'footerBackground');
		this.footerBackground.fixedToCamera = true;

		this.healthProgress = game.add.group();
		this.healthProgress.fixedToCamera = true;
		var health1 = game.add.sprite(24, 32, 'groundTile', 155);
        if(currentState == "demo64"){
            health1.scale.setTo(0.5);
        }
		this.healthProgress.add(health1);
		if(this.character.maxHealth > 4){
			var shieldsToAdd = Math.ceil(this.character.maxHealth/4)-1;
			for(var i=0; i!=shieldsToAdd; i++){
				//add health sprite
				//0 = 151
				var healthDiff = this.character.health-((i+1)*4);
				var healthFrame = 155;
				console.log(healthDiff);

				if(healthDiff <= 0){
					healthFrame = 151;
				}else if(healthDiff == 1){
					healthFrame = 152;
				}else if(healthDiff == 2){
					healthFrame = 153;
				}else if(healthDiff == 3){
					healthFrame = 154;
				}
				var tempHealth = game.add.sprite(24+((i+1)*32), 32, 'groundTile', healthFrame);
				this.healthProgress.add(tempHealth);
			}
		}
		this.healthProgress.setAllChildren("y", canvas.height() - 32 - 16);

		this.goldText = game.add.text(canvas.width() - 30, canvas.height() - 50, '0', {
			fontSize: '32px',
			fill: '#DDD'
		});
		this.goldText.fixedToCamera = true;
		
		//Level 1 stuff
		if(currentState == "tutorial"){
			this.ftuxRectangle_left = this.game.add.graphics();
			this.ftuxRectangle_left.lineStyle(4, 0xffffff, 1);
			this.ftuxRectangle_left.drawRect(2, 2, canvas.width()/2, canvas.height()-4-64);
			this.ftuxRectangle_left.fixedToCamera = true;
			this.ftuxRectangle_left.alpha = 0;
			
			this.ftuxRectangle_right = this.game.add.graphics();
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
		this.cutscene = this.game.add.graphics();
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
		
		this.game.input.onDown.add(function(){
			if(this.game.paused == true){
				console.log("unpausing")
				thisRef.game.paused = false;
				thisRef.cutscene.alpha = 0;
				thisRef.cutsceneText.alpha = 0;
				thisRef.clickToContinueText.alpha = 0;
				if(thisRef.specailCutsceneID == 2){
					thisRef.runningCutscene = true;
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
		
		//used to track FPS rate
		game.time.advancedTiming = true;
		
		blockbutton = this.game.add.button(240, canvas.height() - 44, 'protoblocks', resolvePit, this, 29, 29, 29);
        if(currentState == "demo64"){
            blockbutton.scale.setTo(0.5);
        }
        
		function resolvePit(){
			console.log("resolve pit");
			if(this.blockRecharging == false){
				//get the tile above
				var topTile = this.map.getTileAbove(0, Math.round(this.character.x/this.map.tileWidth), Math.round(this.character.y/this.map.tileHeight));
				
				console.log(topTile);
				if(this.pitIds.includes(topTile.index-this.tilesetOffset)){
					//there's a pit infront of me remove the block and replace it with the ground tile
					levelState.map.removeTile(topTile.x,topTile.y);
					levelState.map.putTile(this.tilesetOffset, topTile.x,topTile.y);
					//get the player moving again
					this.movePlayer("up");
					//freeze out the recharge button
					var thisRef = this;
					blockbutton.alpha = 0.3;
					setTimeout(function(){
						thisRef.blockRecharging = false;
						blockbutton.alpha = 1;
					}, 1000);
				}
			}
		}
		blockbutton.fixedToCamera = true;
		this.game.camera.flash("0x000000");
		
		//this.topLayer = this.map.createLayer('top');
		
		//set this so during restart it picks it up
		this.characterStarted = false;
		startEnemies = false;
		this.character.body.velocity.x = 0;
		this.character.body.velocity.y = 0;
		
		//enemy debugging
		var loggingDelay = false;
		if(enemyLogging && !loggingDelay){
			var canvas = $("canvas");
			this.enemyDebugButton = this.game.add.button(20, canvas.height()-35, 'level1btn', function(){
				for(var i=0; i != enemies.length; i++){
					var enemy = enemies.children[i];
					if(enemy.data.aiActivated != true && loggingDelay == false){
						loggingDelay = true;
						setTimeout(function(){
							loggingDelay = false;
						},500)
						enemy.data.aiActivated = true;
						console.log(enemy.data.speed);
						enemy.body.velocity.y = enemy.data.speed;
						this.game.camera.follow(enemy);
						break;
					}
				}
				enableEnemies();
			}, this, 1, 1, 1);
			this.enemyDebugText = game.add.text(34, canvas.height()-30, 'Enable', {
				fontSize: '18px',
				fill: '#000'
			});
			this.enemyDebugText.fixedToCamera = true;
			this.enemyDebugButton.fixedToCamera = true;
		}
        
        
		
		
		/*if(currentState == "level1"){
			var friend = this.game.add.sprite(32,32,'groundTile', 181+60);
			friend.animations.add('walkUp', [189+60, 190+60, 191+60], 30, true);
			friend.animations.add('walkDown', [180+60, 181+60, 182+60], 30, true);
			friend.animations.add('walkLeft', [183+60, 184+60, 185+60], 30, true);
			friend.animations.add('walkRight', [186+60, 187+60, 188+60], 30, true);
			friend.animations.add('walkUpRight', [195+60, 196+60, 197+60], 30, true);
			friend.animations.add('walkUpLeft', [198+60, 199+60, 200+60], 30, true);
			friend.x = 7*32;
			friend.y = 108*32;
			this.game.physics.arcade.enable(friend);
			this.npcs.push(friend);
		}*/
		
		console.log("end create");
        console.log(this.character.frame);
	},
	
	update: function(){
        
        if(leftButtonDown == true){
            this.movePlayer("left");
            console.log("left");
        }
        if(rightButtonDown == true){
            this.movePlayer("right");
            console.log("right");
        }
        
		if(this.character.y <= this.endingY){
			loadUpState("map");
		}
		
		 if(this.characterStarted == false && (this.charStartingY-this.character.y) > 8){
			this.characterStarted = true;
			enableEnemies();
		}
		
		if (this.movingLanes == true) {
			if (this.movingDelta > 0) {
				//was 100 less
				this.character.body.velocity.x = (this.playerVelocity+50)*-1;
			} else if (this.movingDelta < 0) {
				this.character.body.velocity.x = (this.playerVelocity+50)*1;
			}
			if (Math.abs(Math.round(this.character.body.x - this.currentLane.x)) >= Math.abs(this.movingDelta)) {
				//find the top tile
				var topTile = this.map.getTileAbove(0, Math.round(this.character.x/this.map.tileWidth), Math.round(this.character.y/this.map.tileHeight));
				//If top tile is a ground tile and not a blocked tile
				if(topTile.index == this.tilesetOffset){
					this.character.body.velocity.x = 0;
					this.character.body.x = Math.round(this.character.body.x / this.map.tileWidth) * this.map.tileWidth;
					this.currentLane.x = this.character.body.x;
					this.movingDelta = 0;
					this.movingLanes = false;
					this.character.body.velocity.y = this.playerVelocity;
					this.character.animations.play("walkUp");
				}else{
					this.currentLane.x = this.character.body.x;
					//there's a tile infront
					if(this.movingDelta > 0){
						this.movePlayer("right");
					}else if((this.movingDelta < 0)){
						this.movePlayer("left");
					}
				}
			}
		}

		if (this.character.body.velocity.x == 0 && this.character.body.velocity.y == 0) {
			this.character.animations.stop();
		}
		
		enemy_update(this.character, this.map, this.layer, this.marker);
		game.physics.arcade.collide(enemies, this.layer);

		game.physics.arcade.collide(this.character, this.layer);

		var thisRef = this;
		game.physics.arcade.overlap(this.character, this.items, function(character, item){
			item.kill();
			console.log(item);
			if (item.name == "gold") {
				thisRef.gold += 1;
				thisRef.goldText.text = thisRef.gold;
			} else if (item.name == "potion") {
				character.heal(25);
				thisRef.updateHealthImage();
			} else if(item.name == "ftux1"){
				thisRef.ftux.setText("Tap the left side of the screen");
				var canvas = $("canvas");
				levelState.ftux.setTextBounds(-90, -200);
				//thisRef.ftux.setTextBounds(80)
				thisRef.ftux.wordWrap = true;
				thisRef.ftux.wordWrapWidth = (canvas.width()/2)-thisRef.map.tileWidth;
				thisRef.game.add.tween(thisRef.ftuxRectangle_left).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				thisRef.game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}else if(item.name == "ftux2"){
				thisRef.ftux.setText("Tap the right side of the screen");
				var canvas = $("canvas");
				//levelState.ftux.setTextBounds(-80, -200);
				levelState.ftux.setTextBounds(95, -200);
				thisRef.game.add.tween(thisRef.ftuxRectangle_right).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				thisRef.game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}else if(item.name == "ftux3"){
				thisRef.ftux.setText("Tap either side of the screen");
				var canvas = $("canvas");
				levelState.ftux.setTextBounds(0, 0);
				thisRef.game.add.tween(thisRef.ftuxRectangle_right).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				thisRef.game.add.tween(thisRef.ftuxRectangle_left).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
				thisRef.game.add.tween(thisRef.ftux).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
			}else if(item.name == "cutscene"){
				thisRef.game.paused = true;
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
        
        game.physics.arcade.overlap(enemies.children[0], this.items, function(enemy, item){
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
		
		game.physics.arcade.collide(this.character, this.pits, function(character, pit){
			//character.body.velocity.y = 0;
			//thisRef.getTopItem(character);
		});
		
		game.physics.arcade.collide(enemies, this.character, function (character, enemy) {
			//face forward
			character.frame = 181;
			
			var knockbackDuration = 200;
			var damageFromPlayer = allWeapons[character.data.weapon].power;

			enemyAttacked(enemy, knockbackDuration, damageFromPlayer, character);
			
			thisRef.updateHealthImage(); 
		});
        
	},
	
	render: function(){
		game.debug.text(game.time.fps, 2, 14, "#000000");
	},
	
	
	
	movePlayer:function(direction) {
		if(this.character.alive && this.runningCutscene == false){
			if(this.characterStarted == true){
				var left = this.character.left;
				var bottom = this.character.bottom;
				if (direction == "left") {
					if (this.movingDelta == 0) {
						this.currentLane.x = this.character.body.x;
					}
					if (this.character.body.velocity.y == 0) {
						this.character.animations.play("walkLeft");
					} else {
						this.character.animations.play("walkUpLeft");
					}
					this.movingLanes = true;
					this.movingDelta = - this.map.tileWidth;

					if(currentState == "tutorial"){
						if(this.ftux.text == "Tap the left side of the screen"){
							this.game.add.tween(this.ftuxRectangle_left).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
						}else if(this.ftux.text == "Tap either side of the screen"){
							this.game.add.tween(this.ftuxRectangle_right).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftuxRectangle_left).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
						}
					}
				}
				if (direction == "right") {
					if (this.movingDelta == 0) {
						this.currentLane.x = this.character.body.x;
					}
					if (this.character.body.velocity.y == 0) {
						this.character.animations.play("walkRight");
					} else {
						this.character.animations.play("walkUpRight");
					}
					this.movingLanes = true;
					this.movingDelta = this.map.tileWidth;

					if(currentState == "tutorial"){
						if(this.ftux.text == "Tap the right side of the screen"){
							this.game.add.tween(this.ftuxRectangle_right).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
						}else if(this.ftux.text == "Tap either side of the screen"){
							this.game.add.tween(this.ftuxRectangle_right).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftuxRectangle_left).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
						}
					}
				}
				if (direction == "up") {
					this.character.animations.play("walkUp");
					this.character.body.velocity.y = this.playerVelocity;
				}
				if (direction == "down") {
					this.character.animations.play("walkDown");
					this.character.body.velocity.y = this.playerVelocity*-1;
				}
			}else{
				if(currentState == "tutorial"){
					this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
				}
				this.character.body.velocity.y = this.playerVelocity;
				this.character.animations.play("walkUp");
				this.charStartingY = this.character.y;
			}
		}
	},
	
	/*attackEnemy:function (character, enemy) {
		//face forward
		character.frame = 181;
		character.damage(enemy.data.attackPower);
		this.updateHealthImage();

		var knockbackDuration = 200;
		var damageFromPlayer = allWeapons[character.data.weapon].power;

		this.enemyAttacked(enemy, knockbackDuration, damageFromPlayer);
	},*/

	/*getItem:function (character, item) {
		item.kill();
		console.log(item);
		if (item.name == "gold") {
			globalThis.gold += 1;
			globalThis.goldText.text = globalThis.gold;
		} else if (item.name == "potion") {
			character.heal(25);
			globalThis.updateHealthImage();
		}
	},*/
	
	updateHealthImage:function () {
		var newFrame;
		if (this.character.health == 0) {
			newFrame = 151;
		} else if (this.character.health == 1) {
			newFrame = 152;
		} else if (this.character.health == 2) {
			newFrame = 153;
		} else if (this.character.health == 3) {
			newFrame = 154;
		} else {
			newFrame = 155;
		}

		this.healthProgress.children[0].frame = newFrame;
	},
	
	moveSelectedToCursor: function() {
		//get x and y of the cursor
		var x = this.layer.getTileX(game.input.activePointer.worldX);
		var y = this.layer.getTileY(game.input.activePointer.worldY);

		//get the tile the cursor is over
		tempSelectedTile = this.map.getTile(x, y, this.layer);

		if(tempSelectedTile){
			console.log("Tile Data");
			console.log(tempSelectedTile);
			console.log(tempSelectedTile.index);
		}

		//check if a valid tile
		if (tempSelectedTile != undefined) {
			//set tile
			this.selectedTile = tempSelectedTile;
			//move cursor
			this.marker.x = x * this.map.tileWidth;
			this.marker.y = y * this.map.tileHeight;
		}
	},
	
	getTopItem: function(character){
		for(var i=0; i!=this.pits.children.length; i++){
			var item = this.pits.children[i];
			//console.log(item.x+" >= "+character.x+" ("+(item.x >= character.x)+") && "+item.x+ " < "+(character.x+32)+" ("+(item.x < (character.x+32))+") && "+item.y+" == "+(character.y-32))
			console.log(item.x+" == "+character.x+" && "+item.y+" == "+(character.y-this.map.tileHeight));
			console.log(item.x == character.x && item.y == (character.y-this.map.tileHeight));
			if(item.x == character.x && item.y == (character.y-this.map.tileHeight)){
				console.log(item);
				return item;
				break;
			}
		}
	},
	
	showCutscene: function(){
		
	},
    
    zoomOut: function(){
        game.camera.scale.setTo(0.5);
        this.layer.height *=2;
        this.layer.width *=2;
    }
	
};