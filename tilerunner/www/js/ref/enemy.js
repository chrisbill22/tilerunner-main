var enemies;
var startEnemies = false;
var enemyLogging = false;

function enemyLog(text){
	if(enemyLogging == true){
		console.log(text);
	}
}

//----------------
// CREATE
//----------------
function enemy_create(map, tilesetOffset, groundTileOffset) {
	enemies = game.add.group();
	//add all the enemies from the tiled map
	map.objects.objectsLayer.forEach(function (object) {
		if (object.type == "enemyStart") {
			enemyLog(object);
			enemyLog(groundTileOffset)
			var enemy = enemies.create(object.x, object.y - 32, 'groundTile', object.gid-groundTileOffset);
            enemyLog(object.gid);
            enemyLog(groundTileOffset);
			//pull in all of Tiled's custom properties
			var customProps = object.properties;
			//set enemy health from tiled
			enemy.health = customProps.health;
			enemy.maxHealth = customProps.health;
			enemy.data = {
				aiActivated: false,
				activeMove: false,
				canBeAttacked: true,
				lastVelocity: {x:0, y:0},
				attackPower: customProps.attack,
				loopPaused: false,
				speed:200,
				wakeupDistance: customProps.wakeupDistance,
				wakeupBottom: false
			}
			
			if(customProps.speedAdjust){
				enemy.data.speed += customProps.speedAdjust;
			}
			if(customProps.wakeupBottom){
				enemy.data.wakeupBottom = true;
			}
			
			enemy.data.speed*= -1;
			
			var healthBarBG = game.add.graphics(0, 0);
			healthBarBG.beginFill(0x222222);
			healthBarBG.drawRect(0, 36, 32, 6);
			healthBarBG.visible = false;
			var healthBar = game.add.graphics(0, 0);
			healthBar.beginFill(0xDDDDDD);
			healthBar.drawRect(1, 37, 30, 4);
			healthBar.visible = false;
			
			enemy.addChild(healthBarBG);
			enemy.addChild(healthBar);
			
			
		}
	});

	//enable physics on all enemies
	game.physics.arcade.enable(enemies);
	
	//enemyStarted - flag once the ai has been activated (prevents false starting block)
	//aiActivated - flag to start chasing the player
	/*enemies.setAll("data", {
		aiActivated: false,
		activeMove: false,
		lastVelocity: {x:0, y:0},
		deltaFromCharacterActivate: 64,
		attackPower: 25,
		loopPaused: false
	});*/
}

//----------------
// UPDATE
//----------------
function enemy_update(character, map, blockedLayer, marker) {
	if(startEnemies){
		//Loop through each enemy that is alive
		enemies.forEachAlive(function (enemy) {

			//if an attack has happened on the enemy. This overrides all other things
			if(enemy.data.loopPaused == false){
				//If the main character is ahead of the enemy the correct amount, activate the enemy's tacking
				if(enemy.data.aiActivated == false){
					//checks if player is wakeupDisatnace away in all directions except backwards.
					if(enemy.data.wakeupBottom == false){
						if ((enemy.body.y - character.body.y) > enemy.data.wakeupDistance && Math.abs(enemy.body.x - character.body.x) <= enemy.data.wakeupDistance) {
                            enemy.data.aiActivated = true;
							enemy.body.velocity.y = enemy.data.speed;
						}
                    //wakeup check for all directions
					}else if(Math.abs(enemy.body.y - character.body.y) <= enemy.data.wakeupDistance+32 && Math.abs(enemy.body.x - character.body.x) <= enemy.data.wakeupDistance){
						enemy.data.aiActivated = true;
						enemy.body.velocity.y = enemy.data.speed;
					}
				}

				//if tracking is enabled
				if (enemy.data.aiActivated == true) {

					//calculate left to right distance from the player
					var deltaEnemyCharacter = Math.round(character.body.x - enemy.body.x);
					enemyLog("-----");
					enemyLog(deltaEnemyCharacter);
					//Used to move the enemy to try and unblock itself
					if(enemy.data.activeMove == true){
						//need to account for the next square tile. This has a margin of error of 0.10 depending on if moving left or right.
						//this checks every 32 pixles if a top tile is open.
						/*enemyLog(enemy.body.velocity.x+" < "+0);
						enemyLog((enemy.body.x / 32) % 1+" < "+0.05);
						enemyLog(enemy.body.velocity.x+" > "+0);
						enemyLog((enemy.body.x / 32) % 1+" > "+0.95);*/
						if((enemy.body.velocity.x < 0 && (enemy.body.x / 32) % 1 < 0.1) || (enemy.body.velocity.x > 0 && (enemy.body.x / 32) % 1 > 0.9)){
							enemyLog("square set")
							var squareX = Math.round(enemy.x / 32) * 32;
							var squareY = Math.round(enemy.y / 32) * 32;
							
							
							//var topTile = map.getTileWorldXY(squareX, squareY-32, 32, 32, blockedLayer);
							//marker.x = squareX;
							//marker.y = squareY-32;
							
							//top is open and can be passed
							if(isTopOpen(enemy, map, blockedLayer, marker)){
								enemyLog("TOP TILE IS OPEN");
								//top tile is free
								
								//stop moving left or right and move up
								enemy.body.velocity.x = 0;
								enemy.body.velocity.y = enemy.data.speed;
								//set the enemy square
								enemy.body.x = Math.round(enemy.body.x / 32) * 32
								//reset flags
								enemy.data.activeMove = true;
							}
						}else{
							//do a check to make sure we aren't stuck
							if(enemy.data.lastVelocity.y == 0 && enemy.data.lastVelocity.x == 0){
								//oops we're stuck
								enemyLog("oops we're stuck. Try ublocking again");
								unblockEnemy(enemy, character, map, blockedLayer, marker);
							}
						}
					}

					//if the enemy is not moving to try unblock itself
					if(enemy.data.activeMove == false){
						/*if(enemy.data.lastVelocity.x != enemy.body.velocity.x && enemy.data.lastVelocity.y != enemy.body.velocity.y){
							//the x and y velocity have changed
							//this should be diagnal movement has stopped
							console.log("diag");
						}else */
						if(enemy.data.lastVelocity.x != enemy.body.velocity.x){
							//the x velocity has changed
							//this means that either a left or right movement has been completed
							//or a left to right movement is stuck
							enemyLog("------------------------------------");
							enemyLog("left to right change");
							if(enemy.data.lastVelocity.x > 0){
								//was moving right
								enemyLog("was moving right");
								if(enemy.body.velocity.y == 0){
									//can't move up and can't move right
									enemyLog("and is no longer moving up");
									unblockEnemy(enemy, character, map, blockedLayer, marker);
								}
							}else if(enemy.data.lastVelocity.x < 0){
								//was moving left
								enemyLog("was moving right");
								if(enemy.body.velocity.y == 0){
									//can't move up and can't move right
									enemyLog("and is no longer moving up");
									unblockEnemy(enemy, character, map, blockedLayer, marker);
								}
							}else{
								//was not moving and now is
							}
						}else if(enemy.data.lastVelocity.y != enemy.body.velocity.y){
							//the y velocity has changed
							//this means that the forward movement has stopped
							enemyLog("------------------------------------");
							enemyLog("up and down change");
							if(enemy.data.lastVelocity.y < 0){
								//was moving up
								//something must be in front of me. Check to make sure
								enemyLog("was moving up");
								if(!isTopOpen(enemy, map, blockedLayer, marker)){
									enemyLog("something is above me");
									unblockEnemy(enemy, character, map, blockedLayer, marker);
								}else{
									enemyLog("nothing is above me. Restore normal behavior.");
									enemy.data.activeMove = true;
									//enemy.body.velocity.y = enemy.data.speed;
								}

							}else if(enemy.data.lastVelocity.y > 0){
								//was just attacked (only time will move backwards)
								//console.log("just attacked");
								enemyLog("was moving up");
							}else{
								//was not moving and now is
							}
						}else{
							//nothing has changed
						}
					}



					//the basic level of enemy tracking
					if (enemy.data.activeMove == false) {
						if (deltaEnemyCharacter > 0 && deltaEnemyCharacter != 1) {
							//move right
							enemyLog("move right");
							enemy.body.velocity.x = (enemy.data.speed+50)*-1;
						} else if (deltaEnemyCharacter < 0 && deltaEnemyCharacter != -1) {
							//move left
							enemyLog("move left");
							enemy.body.velocity.x = (enemy.data.speed+50);
						} else {
							//stay center
							enemy.body.velocity.x = 0;
							if ((enemy.body.x / 32) % 1 != 0){
								enemy.body.x = Math.round(enemy.body.x / 32) * 32;
							}
						}


					} 

					//log the current velocity so we can check if it changes next time
					enemy.data.lastVelocity.y = enemy.body.velocity.y;
					enemy.data.lastVelocity.x = enemy.body.velocity.x;
					enemy.data.enemyStarted = true;
				}
			}
		});
	}
	
	//Don't allow 2 enemies on the same tile
	//collision physics
	game.physics.arcade.collide(enemies, enemies);
}



//SUPPORT FUNCTIONS
function isLeftOpen(enemy, map, blockedLayer, marker){
	var leftTile = map.getTileWorldXY(enemy.x - 32, enemy.y, 32, 32, blockedLayer);
	enemyLog("leftTile");
	//debug
	if(enemy.x - 32 > 0){
		marker.x = map.getTileWorldXY(enemy.x - 32, enemy.y).worldX;
		marker.y =  map.getTileWorldXY(enemy.x - 32, enemy.y).worldY;
	}
	
	if(!leftTile || leftTile.collideDown == false){
		return true;
	}else{
		return false;
	}
}
function isLeftTopOpen(enemy, map, blockedLayer, marker){
	var leftTile = map.getTileWorldXY(enemy.x - 32, enemy.y - 32, 32, 32, blockedLayer);
	enemyLog("leftTOPTile");
	//debug
	if(enemy.x - 32 > 0){
		marker.x = map.getTileWorldXY(enemy.x - 32, enemy.y - 32).worldX;
		marker.y =  map.getTileWorldXY(enemy.x - 32, enemy.y - 32).worldY;
	}
	
	if(!leftTile || leftTile.collideDown == false){
		return true;
	}else{
		return false;
	}
}
function isRightOpen(enemy, map, blockedLayer, marker){
	var rightTile = map.getTileWorldXY(enemy.x + 32, enemy.y, 32, 32, blockedLayer);
	enemyLog("rightTile");
	//debug
	marker.x = map.getTileWorldXY(enemy.x + 32, enemy.y).worldX;
	marker.y =  map.getTileWorldXY(enemy.x + 32, enemy.y).worldY;
	
	if(!rightTile || rightTile.collideDown == false){
		return true;
	}else{
		return false;
	}
}
function isRightTopOpen(enemy, map, blockedLayer, marker){
	var rightTile = map.getTileWorldXY(enemy.x + 32, enemy.y - 32, 32, 32, blockedLayer);
	enemyLog("rightTOPTile");
	//debug
	marker.x = map.getTileWorldXY(enemy.x + 32, enemy.y -32).worldX;
	marker.y =  map.getTileWorldXY(enemy.x + 32, enemy.y-32).worldY;
	
	if(!rightTile || rightTile.collideDown == false){
		return true;
	}else{
		return false;
	}
}
function isTopOpen(enemy, map, blockedLayer, marker){
	//using +31 right now but there's probabaly a more complicated ceil function to write
	var squareX = Math.round(enemy.x / 32) * 32;
	var squareY = Math.round(enemy.y / 32) * 32;
	var topTile = map.getTileWorldXY(squareX, squareY - 32, 32, 32, blockedLayer);
	//debug
	enemyLog("topTile");
	marker.x = map.getTileWorldXY(enemy.x + 31, enemy.y -32).worldX;
	marker.y =  map.getTileWorldXY(enemy.x + 32, enemy.y-32).worldY;
	
	//collide false means a sprite can pass through
	if(!topTile || topTile.collideDown == false){
		return true;
	}else{
		return false;
	}
}

//moves the enmey left
function enemyMoveLeft(enemy){
	enemyLog("moveing left");
	enemy.body.velocity.x = (enemy.data.speed+50);
	enemyLog(enemy.body.velocity.x);
	enemy.data.activeMove = true;
}

//moves the enmey right
function enemyMoveRight(enemy){
	enemyLog("moveing right");
	enemy.body.velocity.x = (enemy.data.speed+50)*-1;
	enemy.data.activeMove = true;
}

//logic funtion which moves the enemy out of a blocked situation
function unblockEnemy(enemy, character, map, blockedLayer, marker){
	enemyLog("unblocking enemy");
	//is something to the left? Doesn't have to be square
	var left = isLeftOpen(enemy, map, blockedLayer, marker);
	var leftTop = isLeftTopOpen(enemy, map, blockedLayer, marker);
	var right = isRightOpen(enemy, map, blockedLayer, marker);
	var rightTop = isRightTopOpen(enemy, map, blockedLayer, marker);
	var top = isTopOpen(enemy, map, blockedLayer, marker);
	
	if(left && leftTop && right && rightTop){
		//every path is open but what's right infront of me. So check where the player is
		//calculate left to right distance from the player
		enemyLog("move direction of player");
		var deltaEnemyCharacter = Math.round(character.body.x - enemy.body.x);
		if (deltaEnemyCharacter > 0 && deltaEnemyCharacter != 1) {
			//move right
			enemyMoveRight(enemy);
		} else if (deltaEnemyCharacter < 0 && deltaEnemyCharacter != -1) {
			//move left
			enemyMoveLeft(enemy);
		}else{
			//if the player is centered with me, just move a random direction
			if(Math.round(Math.random()) == 1){
				enemyMoveLeft(enemy);
			}else{
				enemyMoveRight(enemy);
			}
		}
	}else if(left && leftTop){
		//left is open but right is not
		//move left
		enemyLog("left is open but right is not");
		enemyMoveLeft(enemy);
	}else if(right && rightTop){
		//right is open but right is not
		//move right
		enemyLog("right is open but right is not");
		enemyMoveRight(enemy);
	}else if(left && right){
		//both sides are open but the tops of them are not
		enemyLog("both sides are open but the tops of them are not");
		//Advanced TODO: Loop around to figure out an open path
		//for now, just randomly go a direction
		if(Math.round(Math.random()) == 1){
			enemyMoveLeft(enemy);
		}else{
			enemyMoveRight(enemy);
		}
	}else if(left){
		//only the left is open
		//move left
		enemyLog("only the left is open");
		enemyMoveLeft(enemy);
	}else if(right){
		//only the right is open
		//move right
		enemyLog("only the right is open");
		enemyMoveRight(enemy);
	}else{
		enemyLog("nothing open???");
	}
}

//function called when an enemy has been attacked
function enemyAttacked(enemy, duration, damage, character){
	if(enemy.data.canBeAttacked == true){
		character.damage(enemy.data.attackPower);
		enemy.damage(damage);

		enemy.children[1].width = (enemy.health/enemy.maxHealth)*30;
		enemy.children[1].visible = true;
		enemy.children[0].visible = true;

		enemy.body.velocity.y = 400;
		enemy.data.lastVelocity.y = 400;
		enemy.data.loopPaused = true;
		enemy.data.canBeAttacked = false;
		
		setTimeout(function(){
			enemy.data.canBeAttacked = true;
			enemy.data.loopPaused = false;
			enemy.body.velocity.y = enemy.data.speed;
		}, duration)
	}
}
function enableEnemies(){
	startEnemies = true;
}
function debugEnemyByID(id){
	var enemy = enemies.children[id];
	enemy.data.aiActivated = true;
	enemy.body.velocity.y = enemy.data.speed;
	this.game.camera.follow(enemy);
	enableEnemies();
}