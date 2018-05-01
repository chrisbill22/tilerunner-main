//stores the character data
var character = null;

//determines if the character has started the run
var characterStarted = false;

//stores the starting velocity of the player for the level
var playerVelocity = -200;

//stores the starting Y position of the player when tracking lane movement
var charStartingY = 0;

//determines if the player is in the process of moving lanes or not
var movingLanes = false;

//the calculated difference between the starting position and ending
var movingDelta = 0;

//object storing the current position of the player
var currentLane = {x:0, y:0};

//The gold amount 
var gold = 0;

function player_create(map) {
    //add the character
    character = game.add.sprite(0, 0, 'groundTile', 181);
    //character = game.add.tileSprite(0, 0, 64, 64, 'groundTile', 181+groundTileOffset);
    character.width = map.tileWidth;
    character.height = map.tileHeight;

    characterStarted = false;
    
    character.animations.add('walkUp', [189, 190, 191], 30, true);
    character.animations.add('walkDown', [180, 181, 182], 30, true);
    character.animations.add('walkLeft', [183, 184, 185], 30, true);
    character.animations.add('walkRight', [186, 187, 188], 30, true);
    character.animations.add('walkUpRight', [195, 196, 197], 30, true);
    character.animations.add('walkUpLeft', [198, 199, 200], 30, true);

    character.health = 4;
    character.maxHealth = 4;
    character.data.weapon = 0;

    character.events.onKilled.add(function () {
        //restartState();
        loadUpState("map");
    });

    game.physics.arcade.enable(character);

    game.camera.follow(character);
    game.camera.targetOffset.y = -64 * 2;

    character.body.velocity.x = 0;
    character.body.velocity.y = 0;

    //return the character
    return character;
}

function player_update(){
    if (leftButtonDown == true) {
        movePlayer("left");
        console.log("left");
    }
    if (rightButtonDown == true) {
        movePlayer("right");
        console.log("right");
    }

    if (character.y <= endingY) {
        loadUpState("map");
    }

    if (characterStarted == false && (charStartingY - character.y) > 8) {
        characterStarted = true;
        enableEnemies();
    }
    
    if (movingLanes == true) {
        if (movingDelta > 0) {
            //was 100 less
            character.body.velocity.x = (playerVelocity + 50) * -1;
        } else if (movingDelta < 0) {
            character.body.velocity.x = (playerVelocity + 50) * 1;
        }
        if (Math.abs(Math.round(character.body.x - currentLane.x)) >= Math.abs(movingDelta)) {
            //find the top tile
            var topTile = map.getTileAbove(0, Math.round(character.x / map.tileWidth), Math.round(character.y / map.tileHeight));
            //If top tile is a ground tile and not a blocked tile
            if (topTile.index < tilesetOffset+180) {
                character.body.velocity.x = 0;
                character.body.x = Math.round(character.body.x / map.tileWidth) * map.tileWidth;
                currentLane.x = character.body.x;
                movingDelta = 0;
                movingLanes = false;
                character.body.velocity.y = playerVelocity;
                character.animations.play("walkUp");
            } else {
                currentLane.x = character.body.x;
                //there's a tile infront
                if (movingDelta > 0) {
                    movePlayer("right");
                } else if ((movingDelta < 0)) {
                    movePlayer("left");
                }
            }
        }
    }

    if (character.body.velocity.x == 0 && character.body.velocity.y == 0) {
        character.animations.stop();
    }
    
    game.physics.arcade.collide(character, layer);
    
    game.physics.arcade.collide(character, this.pits, function(character, pit){
        //character.body.velocity.y = 0;
        //thisRef.getTopItem(character);
    });

    game.physics.arcade.collide(enemies, character, function (character, enemy) {
        //face forward
        character.frame = 181;

        var knockbackDuration = 200;
        var damageFromPlayer = allWeapons[character.data.weapon].power;

        enemyAttacked(enemy, knockbackDuration, damageFromPlayer, character);

        updateHealthImage(); 
    });
}



function movePlayer(direction) {
    if (character.alive && runningCutscene == false) {
        if (characterStarted == true) {
            var left = character.left;
            var bottom = character.bottom;
            if (direction == "left") {
                if (movingDelta == 0) {
                    currentLane.x = character.body.x;
                }
                if (character.body.velocity.y == 0) {
                    character.animations.play("walkLeft");
                } else {
                    character.animations.play("walkUpLeft");
                }
                movingLanes = true;
                movingDelta = -map.tileWidth;

                
            }
            if (direction == "right") {
                if (movingDelta == 0) {
                    currentLane.x = character.body.x;
                }
                if (character.body.velocity.y == 0) {
                    character.animations.play("walkRight");
                } else {
                    character.animations.play("walkUpRight");
                }
                movingLanes = true;
                movingDelta = map.tileWidth;

            }
            if (direction == "up") {
                character.animations.play("walkUp");
                character.body.velocity.y = playerVelocity;
            }
            if (direction == "down") {
                character.animations.play("walkDown");
                character.body.velocity.y = playerVelocity * -1;
            }
        } else {
            character.body.velocity.y = playerVelocity;
            character.animations.play("walkUp");
            charStartingY = character.y;
        }
    }
}


function updateHealthImage() {
    var newFrame;
    if (character.health == 0) {
        newFrame = 151;
    } else if (character.health == 1) {
        newFrame = 152;
    } else if (character.health == 2) {
        newFrame = 153;
    } else if (character.health == 3) {
        newFrame = 154;
    } else {
        newFrame = 155;
    }

    this.healthProgress.children[0].frame = newFrame;
}

function getTopItem(character){
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
}
