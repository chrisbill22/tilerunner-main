//tracks if a cut scene is active or not
var runningCutscene = false;

//stores the y point where the character will transfer back to the map
var endingY = null;

//stores the map object for the level
var map;

//holds the main level data
var layer;

//holds all the items for the level
var items;

//the frames of the pits used for pit detection in hud
var pitIds = Array(423,424,425);

function runnerLevel_create() {
    var canvas = $("canvas");

    //load the map from the preload
    map = this.game.add.tilemap('map');
    if (currentState == "demo64") {
        map.setTileSize(64, 64);
    }
    //this.game.stage.backgroundColor = "#4488AA";

    //apply the tileset image which will be parsed out and loaded into the timemap
    if (currentState == "demo64") {
        console.log("64 set");
        groundtile = map.addTilesetImage('batch-necessary64', 'groundTile', 64, 64);
        map.addTilesetImage('protoblocks64', 'protoblocks', 64, 64);
    } else {
        map.addTilesetImage('batch-necessary', 'groundTile');
        map.addTilesetImage('protoblocks', 'protoblocks');
    }

    //Calculates the tile offset for the tilesets so that we can grab the correct frame
    for (var i = 0; i != map.tilesets.length; i++) {
        if (map.tilesets[i].name.indexOf("batch-necessary") != -1) {
            groundTileOffset = map.tilesets[i].firstgid;
        } else if (map.tilesets[i].name.indexOf("protoblocks") != -1) {
            tilesetOffset = map.tilesets[i].firstgid;
        }
    }

    //add all the standard layers we have in our Tiled file.
    //These must match Tiled layers
    layer = map.createLayer('foreground');
    
    //set the blocked areas
    map.setCollisionBetween(frame(330), frame(500));

    layer.resizeWorld();


    //creates the player character
    character = player_create(map);


    //create items and pits
    items = game.add.group();
    items.enableBody = true;
    var objectNames = Array();
    var thisRef = this;
    map.objects.objectsLayer.forEach(function (object) {
        if (object.type == "item" && objectNames.indexOf(object.name) == -1) {
            console.log("item, " + object.name);
            objectNames.push(object.name);
            var tileID = 541;
            if (object.gid != undefined) {
                tileID = (object.gid - 1)
            }
            map.createFromObjects("objectsLayer", object.name, "groundTile", tileID, true, false, thisRef.items, Phaser.Sprite, false);
        } else if (object.type == "playerStart") {
            character.x = object.x;
            character.y = object.y - map.tileHeight;
        } else if (object.type == "gameEnd") {
            //sets where the player will transition to the map
            endingY = object.y + object.height;
        }
    });


    //sets up the HUD
    hud_create(game, map, character);

    //used to track FPS rate
    game.time.advancedTiming = true;

    //reset all the enemies every time a level is started
    startEnemies = false;

    //set this so during restart it picks it up
    console.log("RESET");
    characterStarted = false;
}


function runnerLevel_update() {

    
}


function frame(frameNumber, groundTile = false) {
    if (groundTile) {
        return frameNumber + groundTileOffset
    }
    return frameNumber + tilesetOffset
}

function moveSelectedToCursor() {
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
}

function checkStandardItems(item){
    if (item.name == "gold") {
        gold += 1;
        goldText.text = gold;
    } else if (item.name == "potion") {
        character.heal(25);
        updateHealthImage();
    }
}