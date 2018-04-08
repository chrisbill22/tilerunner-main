var townState = {
	map:null,
	layerForeground:null,
	layerForeground2:null,
	layerBlocked:null,
	layerBlocked2:null,
	marker:null,
	selectedTile:null,
	character:null,
	characterStarted:false,
	currentLane:{
		x: 0,
		y: 0
	},
	playerVelocity:-150,
	movingLanes:false,
	movingDelta:0,
	items:null,
	gold:0,
	goldText:null,
	healthProgress:null,
	footerBackground:null,
	blockedLayer:null,
	endingY:null,
	introTransition:true,
	exitTransition:false,
	movingToStore:false,
	storeIsOpen:false,
	exitingStore:false,
	mainY:0,
	
	blockRecharging:false,
	
	preload: function(){
	},
	
	create: function(){
		var canvas = $("canvas");
		
		//load the map from the preload
		this.map = this.game.add.tilemap('map');

		//apply the tileset image which will be parsed out and loaded into the timemap
		this.map.addTilesetImage('townSet', 'townSet');

		//Go through and setup collisions for each tile
		/*collisionIDs.forEach(function(item){
			map.setCollisionBetween(item,item+1);
		})*/

		//add all the standard layers we have in our Tiled file.
		//These must match Tiled layers
		
		//TODO: 4 layers lags like crazy. Keep to 2
		
		this.layerForeground = this.map.createLayer('foreground');
		this.layerForeground2 = this.map.createLayer('foreground2');
		this.layerBlocked = this.map.createLayer('obstacles');
		this.layerBlocked2 = this.map.createLayer('obstacles2');

		//Set collision for everything on the blocked layer
		this.map.setCollisionBetween(1, 1000, true, 'obstacles');
		//this.map.setCollisionBetween(1, 1000, true, 'obstacles2');

		this.layerForeground.resizeWorld();

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
		
		this.game.physics.arcade.enable(this.character);

		this.game.camera.follow(this.character);;

		
		//ITEMS
		//types = shop, portal
		//shop = weapons, armor, other, inn, mine
		//portal = exit, entrance
		
		this.items = game.add.group();
		this.items.inputEnableChildren = true;
		this.items.enableBody = true;
		
		var objectNames = Array();
		var thisRef = this;
		this.map.objects.objectsLayer.forEach(function (object) {
			if (object.type == "shop") {
				objectNames.push(object.name);
				thisRef.map.createFromObjects("objectsLayer", object.name, "townSet", 153, true, false, thisRef.items, Phaser.Sprite, false);
			} else if (object.name == "entrance") {
				thisRef.character.x = object.x;
				thisRef.character.y = object.y+32;
				thisRef.mainY = object.y+32;
				thisRef.map.createFromObjects("objectsLayer", object.name, "townSet", 153, true, false, thisRef.items, Phaser.Sprite, false);
			} else if(object.name == "exit"){
				thisRef.map.createFromObjects("objectsLayer", object.name, "townSet", 153, true, false, thisRef.items, Phaser.Sprite, false);
			}
		});
		
		//this.items.selectAllChildren()
		
		this.items.onChildInputDown.add(function(child){
			if(thisRef.movingToStore == false && thisRef.exitingStore == false){
				//thisRef.game.physics.arcade.moveToXY(thisRef.character,child.x,child.y);
				var shopName = child.name;
				
				//fixes the issue if they user clicks on the entrance block or the store
				if(shopName.indexOf("Entrance") == -1){
					shopName+="Entrance";
				}
				var entranceSprite = thisRef.items.getByName(shopName);
				
				/*
				console.log(shopName);
				console.log(entranceSprite.x+", "+entranceSprite.y);
				thisRef.targetX = entranceSprite.x;
				thisRef.targetY = entranceSprite.y;

				thisRef.movingDelta = thisRef.character.x - thisRef.targetX;
				console.log(thisRef.movingDelta);
				//console.log(thisRef.targetX+", "+thisRef.targetY);
				thisRef.movingToStore = true;
				*/
				setCharacterMoveTargetXY(thisRef.character, entranceSprite.x, entranceSprite.y, "shop", {shopName:shopName});
			}
		}, this);

		
		//CHARACTER INTRO
		if(this.introTransition == true){
			this.game.camera.flash("0x000000");
			setCharacterMoveTargetX(this.character, this.character.x+(32*2), "intro");
		}
		
		
		
		
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
		
		//used to track FPS rate
		this.game.time.advancedTiming = true;
		
		blockbutton = this.game.add.button(240, canvas.height() - 44, 'blockbuttons', resolvePit, this, 0, 0, 0);
		function resolvePit(){
			
		}
		blockbutton.fixedToCamera = true;
	},
	
	update: function(){
		var thisRef = this;
		moveCharacter(this.character, this.playerVelocity, function(moveKey, data){
			switch(moveKey){
				case "intro":
					thisRef.character.frame = 181;
					break;
				case "shop":
					thisRef.openStore(data.shopName);
					break;
			}
		});
		
		if(characterIsMoving == false){
			if(this.game.input.pointer1.isDown){
				var canvas = $("canvas");
				var cursorX = game.input.activePointer.x;
				var cursorY = game.input.activePointer.y;

				if(cursorY < canvas.height() - 64){
					if(cursorX < game.width/2 && this.movingDelta >= 0){
						//move LEFT
						this.character.animations.play("walkLeft");
						this.character.body.velocity.x = (this.playerVelocity);
					}else if(cursorX >= game.width/2 && this.movingDelta <= 0){
						//move Right
						this.character.animations.play("walkRight");
						this.character.body.velocity.x = (this.playerVelocity)*-1;
					}
				}
			}else{
				this.character.body.velocity.x = 0;
				this.character.frame = 181;
			}
		}
		
		if(this.exitingStore == true){
			this.character.animations.play("walkDown");
			this.character.body.velocity.y = this.playerVelocity*-1;
			//console.log(Math.round(this.character.y)+" >= "+this.mainY);
			if(Math.round(this.character.y) >= this.mainY){
				this.character.y = this.mainY;
				this.character.body.velocity.y = 0;
				this.exitingStore = false;
				this.storeIsOpen = false;
			}
		}

		if (this.character.body.velocity.x == 0 && this.character.body.velocity.y == 0) {
			this.character.animations.stop();
		}
		
		game.physics.arcade.collide(this.character, this.layerBlocked);


		game.physics.arcade.overlap(this.character, this.items, function(character, item){
			console.log("this");
			if ((item.name == "entrance" || item.name == "exit") && characterIsMoving == false) {
				loadUpState("map");
			}
		});
	},
	
	render: function(){
		game.debug.text(game.time.fps, 2, 14, "#000000");
	},
	
	openStore: function(storeID){
		console.log("open store: "+storeID);
		var canvas = $("canvas");
		this.storeIsOpen = true;
		
		var background = game.add.graphics(0, 0);
		background.beginFill(0x000000);
		background.drawRect(0, 0, canvas.width(), canvas.height());
		background.endFill();
		background.fixedToCamera = true;
		
		var storeCloseButton = this.game.add.button(canvas.width()/2-(48), canvas.height()/2, 'level1btn', function(){
			this.movingToStore = false;
			this.closeStore();
		}, this, 2, 2, 2);
		
		var storeText = game.add.text(15, 50, storeID+' Store.\nClose by clicking the button.', {
			fontSize: '21px',
			fill: '#DDD'
		});
		storeText.fixedToCamera = true;
		
		storeCloseButton.fixedToCamera = true;
		
		this.openStoreGroup = game.add.group();
		this.openStoreGroup.add(background);
		this.openStoreGroup.add(storeCloseButton);
		this.openStoreGroup.add(storeText);
	},
	
	closeStore: function(){
		this.openStoreGroup.destroy();
		this.exitingStore = true;
	},
		
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
	}
};



/*
thisRef.targetX = entranceSprite.x;
thisRef.targetY = entranceSprite.y;
thisRef.movingDelta = thisRef.character.x - thisRef.targetX;
*/

var characterMovingX = false;
var characterMovingY = false;
var characterMovingXY = false;
var characterIsMoving = false;

var characterMoveDeltaX = 0;
var characterMoveDeltaXLast = 99999;

var characterMoveDeltaY = 0;
var characterMoveDeltaYLast = 9999;

var characterStartX = 0;
var characterEndX = 0;

var characterStartY = 0;
var characterEndY = 0;

var moveKey = null;
var movePassData = {};

function setCharacterMoveTargetX(character, endX, aMoveKey=null, passData){
	if(characterIsMoving == false){
		characterStartX = character.x;
		characterEndX = endX;
		characterMoveDeltaX = character.x - characterEndX;
		characterMovingX = true;
		characterIsMoving = true;
		movePassData = passData;
		moveKey = aMoveKey;
	}
}
function setCharacterMoveTargetY(character, endY, aMoveKey=null, passData){
	if(characterIsMoving == false){
		characterStartY = character.y;
		characterEndY = endY;
		characterMoveDeltaY = character.y - characterEndY;
		characterMovingY = true;
		characterIsMoving = true;
		movePassData = passData;
		moveKey = aMoveKey;
	}
}
function setCharacterMoveTargetXY(character, endX, endY, aMoveKey=null, passData){
	if(characterIsMoving == false){
		characterStartX = character.x;
		characterEndX = endX;
		characterMoveDeltaX = character.x - characterEndX;
		characterStartY = character.y;
		characterEndY = endY;
		characterMoveDeltaY = character.y - characterEndY;
		characterMovingXY = true;
		characterIsMoving = true;
		moveKey = aMoveKey;
		movePassData = passData;
	}
}
function moveCharacter(character, playerVelocity, finishCallback=function(){}){
	if(characterMovingX == true){
		if(moveCharacterX(character, playerVelocity)){
			//move has been completed
			console.log("done");
			finishCallback(moveKey, movePassData);
			characterMovingX = false;
			characterIsMoving = false;
			moveKey = null;
		}
	}else if(characterMovingY == true){
		if(moveCharacterY(character, playerVelocity)){
			//move has been completed
			console.log("done");
			finishCallback(moveKey, movePassData);
			characterMovingY = false;
			characterIsMoving = false;
			moveKey = null;
		}
	}else if(characterMovingXY == true){
		if(moveCharacterX(character, playerVelocity)){
			//move has been completed
			if(moveCharacterY(character, playerVelocity)){
				//move has been completed
				console.log("done");
				finishCallback(moveKey, movePassData);
				characterMovingXY = false;
				characterIsMoving = false;
				moveKey = null;
			}
		}
	}
}

function moveCharacterX(character, playerVelocity){
	if (characterMoveDeltaX < 0) {
		character.body.velocity.x = (playerVelocity)*-1;
		character.animations.play("walkRight");
	} else if (characterMoveDeltaX > 0) {
		character.body.velocity.x = (playerVelocity)*1;
		character.animations.play("walkLeft");
	}
	//The delta should always be going down. If it's going up, the player has gone too far.
	var thisMovingDelta = Math.abs(Math.round(character.x - characterEndX));
	//console.log(thisMovingDelta+" > "+characterMoveDeltaXLast)
	if (thisMovingDelta > characterMoveDeltaXLast || thisMovingDelta == 0) {
		//resets
		character.body.velocity.x = 0;
		characterMoveDeltaX = 0;
		characterMoveDeltaXLast = 9999;
		//set character
		character.body.x = Math.round(character.body.x / 32) * 32;
		characterEndX = character.body.x;
		return true;
	}else{
		characterMoveDeltaXLast = thisMovingDelta;	
	}
	return false;
}
function moveCharacterY(character, playerVelocity){
	if (characterMoveDeltaY < 0) {
		character.body.velocity.y = (playerVelocity)*-1;
		character.animations.play("walkDown");
	} else if (characterMoveDeltaY > 0) {
		character.body.velocity.y = (playerVelocity)*1;
		character.animations.play("walkUp");
	}
	//The delta should always be going down. If it's going up, the player has gone too far.
	var thisMovingDelta = Math.abs(Math.round(character.y - characterEndY));
	console.log(thisMovingDelta+" > "+characterMoveDeltaYLast)
	if (thisMovingDelta > characterMoveDeltaYLast || thisMovingDelta == 0) {
		//resets
		character.body.velocity.y = 0;
		characterMoveDeltaY = 0;
		characterMoveDeltaYLast = 9999;
		//set character
		character.body.y = Math.round(character.body.y / 32) * 32;
		characterEndY = character.body.y;
		return true;
	}else{
		characterMoveDeltaYLast = thisMovingDelta;	
	}
	return false;
}

//character.body.velocity.y = playerVelocity;
/*
if(this.targetY == this.character.y){
	this.movingToStore = false;
	console.log("STOP");
	this.openStore();
}
*/