//The text object holding the gold label
var goldText;

//The background footer image
var footerBackground;

//The help progress object
var healthProgress;

//A single heath item
var health1;

function hud_create(game, map, character){
    var canvas = $("canvas");
    
    var blockRecharging = false;
    
    //big button input
    leftButton = game.add.button(0, 0, 'protoblocks', function(){}, this, 0, 0, 0);
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

    rightButton = game.add.button(canvas.width()/2, 0, 'protoblocks', function(){}, this, 0, 0, 0);

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

    footerBackground = game.add.image(0, canvas.height() - 64, 'footerBackground');
    footerBackground.fixedToCamera = true;

    healthProgress = game.add.group();
    healthProgress.fixedToCamera = true;
    health1 = game.add.sprite(24, 32, 'groundTile', 155);
    if(currentState == "demo64"){
        health1.scale.setTo(0.5);
    }
    healthProgress.add(health1);
    if(character.maxHealth > 4){
        var shieldsToAdd = Math.ceil(character.maxHealth/4)-1;
        for(var i=0; i!=shieldsToAdd; i++){
            //add health sprite
            //0 = 151
            var healthDiff = character.health-((i+1)*4);
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
            healthProgress.add(tempHealth);
        }
    }
    healthProgress.setAllChildren("y", canvas.height() - 32 - 16);

    goldText = game.add.text(canvas.width() - 30, canvas.height() - 50, '0', {
        fontSize: '32px',
        fill: '#DDD'
    });
    goldText.fixedToCamera = true;
    
    var blockbutton = game.add.button(240, canvas.height() - 44, 'protoblocks', resolvePit, this, 29, 29, 29);
    if(currentState == "demo64"){
        blockbutton.scale.setTo(0.5);
    }
    blockbutton.fixedToCamera = true;
    
    function resolvePit(){
        console.log("resolve pit");
        if(blockRecharging == false){
            //get the tile above
            console.log(character);
            console.log(map);
            var topTile = map.getTileAbove(0, Math.round(character.x/map.tileWidth), Math.round(character.y/map.tileHeight));

            console.log(topTile);
            if(pitIds.includes(topTile.index-tilesetOffset)){
                //there's a pit infront of me remove the block and replace it with the ground tile
                map.removeTile(topTile.x,topTile.y);
                map.putTile(tilesetOffset, topTile.x,topTile.y);
                //get the player moving again
                movePlayer("up");
                //freeze out the recharge button
                var thisRef = this;
                blockbutton.alpha = 0.3;
                setTimeout(function(){
                    blockRecharging = false;
                    blockbutton.alpha = 1;
                }, 1000);
            }
        }
    }
}