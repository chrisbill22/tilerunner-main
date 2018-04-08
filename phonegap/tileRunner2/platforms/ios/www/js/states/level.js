var levelState = {
	map:null,
	layer:null,
	blockedLayer:null,
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
	
	blockRecharging:false,
	
	preload: function(){
	},
	
	create: function(){
		console.log("CharacterStarted = "+this.characterStarted);
		var canvas = $("canvas");
		
		//load the map from the preload
		this.map = this.game.add.tilemap('map');

		//apply the tileset image which will be parsed out and loaded into the timemap
		this.map.addTilesetImage('batch-necessary', 'groundTile');
		this.map.addTilesetImage('townSet', 'townSet');
		//Go through and setup collisions for each tile
		/*collisionIDs.forEach(function(item){
			map.setCollisionBetween(item,item+1);
		})*/

		//add all the standard layers we have in our Tiled file.
		//These must match Tiled layers
		this.layer = this.map.createLayer('foreground');
		this.blockedLayer = this.map.createLayer('obstacles');

		//Set collision for everything on the blocked layer
		this.map.setCollisionBetween(1, 2000, true, 'obstacles');

		//this.layer.resizeWorld();
		this.layer.resizeWorld();

		//add the character
		this.character = this.game.add.sprite(32, 32, 'groundTile', 181);
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
			console.log("ya dead");
			//restartState();
			loadUpState("map");
		});
		
		this.game.physics.arcade.enable(this.character);

		this.game.camera.follow(this.character);
		//this.game.camera.targetOffset.y = -64*2;

		//Tile info debug marker
		this.marker = this.game.add.graphics();
		this.marker.lineStyle(2, 0xffffff, 1);
		this.marker.drawRect(0, 0, 32, 32);

		//mouse input
		//game.input.onTap.add(this.moveSelectedToCursor, this);

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
		this.pits = game.add.group();
		this.items = game.add.group();
		this.items.enableBody = true;
		this.pits.enableBody = true;
		var objectNames = Array();
		var thisRef = this;
		this.map.objects.objectsLayer.forEach(function (object) {
			if (object.type == "item" && objectNames.indexOf(object.name) == -1) {
				console.log("item");
				objectNames.push(object.name);
				var tileID = 541;
				if(object.gid != undefined){
					tileID = (object.gid - 1)
				}
				thisRef.map.createFromObjects("objectsLayer", object.name, "groundTile", tileID, true, false, thisRef.items, Phaser.Sprite, false);
			} else if (object.type == "playerStart") {
				thisRef.character.x = object.x;
				thisRef.character.y = object.y - 32;
			} else if(object.type == "gameEnd"){
				thisRef.endingY = object.y+object.height;
			} else if(object.type == "pit" && objectNames.indexOf(object.name) == -1){
				console.log("pit");
				objectNames.push(object.name);
				console.log(object.gid);
				thisRef.map.createFromObjects("objectsLayer", object.name, "groundTile", (object.gid - 1), true, false, thisRef.pits, Phaser.Sprite, false);
			}
		});
		this.pits.setAllChildren("body.moves", false);
		this.pits.setAllChildren("body.immovable", true);
		
		console.log(objectNames);

		enemy_create(this.map);

		//HUD

		this.footerBackground = this.game.add.image(0, canvas.height() - 64, 'footerBackground');
		this.footerBackground.fixedToCamera = true;

		this.healthProgress = game.add.group();
		this.healthProgress.fixedToCamera = true;
		var health1 = game.add.sprite(24, 32, 'groundTile', 155);
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
		if(currentState == "level1"){
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
		
		
		//used to track FPS rate
		game.time.advancedTiming = true;
		
		blockbutton = this.game.add.button(240, canvas.height() - 44, 'blockbuttons', resolvePit, this, 0, 0, 0);
		function resolvePit(){
			console.log("resolve pit");
			if(this.blockRecharging == false){
				var item = this.getTopItem(this.character);
				if(item && item.alive == true){
					item.kill();
					this.movePlayer("up");
					this.blockRecharging = true;
					var thisRef = this;
					blockbutton.alpha = 0.3;
					setTimeout(function(){
						thisRef.blockRecharging = false;
						blockbutton.alpha = 1;
					}, 1000);
				}else{
				}
			}
		}
		blockbutton.fixedToCamera = true;
		this.game.camera.flash("0x000000");
		
		this.topLayer = this.map.createLayer('top');
		
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
						enemy.body.velocity.y = enemy.data.speed;
						this.game.camera.follow(enemy);
						break;
					}
				}
				
				/*enemies.forEachAlive(function (enemy) {
					enemy.data.aiActivated = true;
					enemy.body.velocity.y = enemy.data.speed;
					if(enemies.children.length == 1){
						this.game.camera.follow(enemy);
					}
				});*/
				enableEnemies();
			}, this, 1, 1, 1);
			this.enemyDebugText = game.add.text(34, canvas.height()-30, 'Enable', {
				fontSize: '18px',
				fill: '#000'
			});
			this.enemyDebugText.fixedToCamera = true;
			this.enemyDebugButton.fixedToCamera = true;
		}
	},
	
	update: function(){
		
		if(this.character.y <= this.endingY){
			loadUpState("map");
			/*this.game.camera.onFadeComplete.add(function(){
				
			});
			this.game.camera.fade();*/
		}
		
		//input TODO
		if(this.game.input.pointer1.isDown && this.character.alive){
			var canvas = $("canvas");
			var cursorX = game.input.activePointer.x;
			var cursorY = game.input.activePointer.y;
			if(cursorY < canvas.height() - 64){
				if(this.characterStarted == true){
					if(cursorX < game.width/2 && this.movingDelta >= 0){
						this.movePlayer("left");
						if(currentState == "level1"){
							if(this.ftux.text == "Tap the left side of the screen"){
								this.game.add.tween(this.ftuxRectangle_left).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
								this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							}else if(this.ftux.text == "Tap either side of the screen"){
								this.game.add.tween(this.ftuxRectangle_right).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
								this.game.add.tween(this.ftuxRectangle_left).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
								this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
							}
						}
					}else if(cursorX >= game.width/2 && this.movingDelta <= 0){
						this.movePlayer("right");
						if(currentState == "level1"){
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
				}else{
					if(currentState == "level1"){
						this.game.add.tween(this.ftux).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
					}
					this.character.body.velocity.y = this.playerVelocity;
					this.character.animations.play("walkUp");
					this.charStartingY = this.character.y;
				}
			}
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
				var topTile = this.map.getTileWorldXY(Math.round(this.character.x/32)*32, Math.round(this.character.y/32)*32 - 32, 32, 32, this.blockedLayer);
				
				if(topTile == undefined){
					this.character.body.velocity.x = 0;
					this.character.body.x = Math.round(this.character.body.x / 32) * 32;
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
		
		enemy_update(this.character, this.map, this.blockedLayer, this.marker);
		game.physics.arcade.collide(enemies, this.blockedLayer);

		game.physics.arcade.collide(this.character, this.blockedLayer);

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
				thisRef.ftux.wordWrapWidth = (canvas.width()/2)-32;
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
			this.movingDelta = -32;
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
			this.movingDelta = 32;
		}
		if (direction == "up") {
			this.character.animations.play("walkUp");
			this.character.body.velocity.y = this.playerVelocity;
		}
		if (direction == "down") {
			this.character.animations.play("walkDown");
			this.character.body.velocity.y = this.playerVelocity*-1;
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
		tempSelectedTile = this.map.getTile(x, y, this.blockedLayer);

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
			this.marker.x = x * 32;
			this.marker.y = y * 32;
		}
	},
	
	getTopItem: function(character){
		for(var i=0; i!=this.pits.children.length; i++){
			var item = this.pits.children[i];
			//console.log(item.x+" >= "+character.x+" ("+(item.x >= character.x)+") && "+item.x+ " < "+(character.x+32)+" ("+(item.x < (character.x+32))+") && "+item.y+" == "+(character.y-32))
			console.log(item.x+" == "+character.x+" && "+item.y+" == "+(character.y-32));
			console.log(item.x == character.x && item.y == (character.y-32));
			if(item.x == character.x && item.y == (character.y-32)){
				console.log(item);
				return item;
				break;
			}
		}
	}
	
};