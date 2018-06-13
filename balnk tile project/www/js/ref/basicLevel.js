//stores the map object for the level
var map;

//holds the main level data
var groundLayer;

//holds the top layer or the things over the player
var topLayer;

//holds all the items for the level
var items;

function basicLevel_create() {
    var canvas = $("canvas");

    //load the map from the preload
    map = this.game.add.tilemap('map');

    //apply the tileset image which will be parsed out and loaded into the timemap
    map.addTilesetImage('exampleTileset', 'exampleTileset');

	//if you add more than one tileset image, you need to define offsets
    //Calculates the tile offset for the tilesets so that we can grab the correct frame
    /*for (var i = 0; i != map.tilesets.length; i++) {
        if (map.tilesets[i].name.indexOf("batch-necessary") != -1) {
            groundTileOffset = map.tilesets[i].firstgid;
        } else if (map.tilesets[i].name.indexOf("protoblocks") != -1 || map.tilesets[i].name.indexOf("level1") != -1) {
            tilesetOffset = map.tilesets[i].firstgid;
        }
    }*/

    //add all the standard layers we have in our Tiled file.
    //These must match Tiled layers
    groundLayer = map.createLayer('ground');
    topLayer = map.createLayer('top');
    
    //set the blocked areas
	//this can cause performance issues
    map.setCollisionBetween(frame(420), frame(899));

	
	//render the world
    groundLayer.resizeWorld();

    //creates the player character
	
    //create items from objects layer

    //used to track FPS rate
    game.time.advancedTiming = true;
}


function basicLevel_update() {
 
}





//frame is used to set a frame releative to what you see in Tiled. The number between Phaser and Tiled isn't always the same.
function frame(frameNumber, tilesetIndex = null) {
    if (tilesetIndex != null) {
        return frameNumber + map.tilesets[tilesetIndex].firstgid;
    }
    return frameNumber
}

//used to ebnable the function below. Put in the create function
function enableGroundTileDebugger(){
	//Tile info debug marker
	this.marker = game.add.graphics();
	this.marker.lineStyle(2, 0x33ccff, 1);
	this.marker.drawRect(0, 0, map.tileWidth, map.tileHeight);

	//mouse input
	game.input.onTap.add(moveGroundSelectedToCursor, this);

}

//a very useful debug function that allows you to click on any tile and view its info
function moveGroundSelectedToCursor() {
    //get x and y of the cursor
    var x = groundLayer.getTileX(game.input.activePointer.worldX);
    var y = groundLayer.getTileY(game.input.activePointer.worldY);

    //get the tile the cursor is over
    tempSelectedTile = map.getTile(x, y, groundLayer);

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

