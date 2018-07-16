//stores the map object for the level
var map;

//holds the main level data
var groundLayer;

//holds the top layer or the things over the player
var topLayer;

//holds all the items for the level
var items;

var DIRT = 5;
var WATER = 7;
var FOREST = 2;
var MOUNTAIN = 11;
var GROUND = 4;

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
	game.input.onTap.add(selectTile, this);

}

//a very useful debug function that allows you to click on any tile and view its info
function selectTile() {
	var canvas = $("canvas");
	//console.log(game.input.activePointer.clientY+" > "+(canvas.height()-50));
	if(game.input.activePointer.clientY < canvas.height()-50){
		//get x and y of the cursor
		var x = groundLayer.getTileX(game.input.activePointer.worldX);
		var y = groundLayer.getTileY(game.input.activePointer.worldY);

		//get the tile the cursor is over
		var tempSelectedTile = map.getTile(x, y, groundLayer);
		var tileAbove = map.getTile(x-1, y, groundLayer);
		var tileBelow = map.getTile(x+1, y, groundLayer);
		var tileLeft = map.getTile(x, y-1, groundLayer);
		var tileRight = map.getTile(x, y+1, groundLayer);
		var tileLeftAbove = map.getTile(x-1, y-1, groundLayer);
		var tileRightAbove = map.getTile(x+1, y-1, groundLayer);
		var tileRightBelow = map.getTile(x+1, y+1, groundLayer);
		var tileLeftBelow = map.getTile(x-1, y+1, groundLayer);
		

		//valid tile
		if(tempSelectedTile){
			//console.log("Tile Data");
			//console.log(tempSelectedTile);
			console.log(tempSelectedTile.index);
			//console.log(selectedTile);
			//if a tile has been selected
			if(selectedTile){
				//if selection is valid
				if(tempSelectedTile.index != selectedTile && (tileAbove.index == GROUND || tileAbove.index == selectedTile || tileAbove.index == selectedTile+1) && (tileBelow.index == GROUND || tileBelow.index == selectedTile || tileBelow.index == selectedTile+1) && (tileLeft.index == GROUND || tileLeft.index == selectedTile || tileLeft.index == selectedTile+1) && (tileRight.index == GROUND || tileRight.index == selectedTile || tileRight.index == selectedTile+1) && (tileLeftAbove.index == GROUND || tileLeftAbove.index == selectedTile || tileLeftAbove.index == selectedTile+1) && (tileRightAbove.index == GROUND || tileRightAbove.index == selectedTile || tileRightAbove.index == selectedTile+1) && (tileRightBelow.index == GROUND || tileRightBelow.index == selectedTile || tileRightBelow.index == selectedTile+1) && (tileLeftBelow.index == GROUND || tileLeftBelow.index == selectedTile || tileLeftBelow.index == selectedTile+1)){	
						buildTile();
				}else{
					console.log("NOT A VALID TILE");
				}
				
				var stop = false;
				checkNextTile(x,y,0,0);
				
				function checkNextTile(x, y, baseX, baseY){
					if(stop == false){
						var direction = Array({x:0+baseX, y:0+baseY}, {x:-1+baseX, y:0+baseY}, {x:1+baseX, y:0+baseY}, {x:0+baseX, y:1+baseY}, {x:0+baseX, y:-1+baseY}, {x:-1+baseX, y:-1+baseY}, {x:1+baseX, y:-1+baseY}, {x:1+baseX, y:1+baseY}, {x:-1+baseX, y:1+baseY});
						//first four directions in the array are direct north, south, east and west
						for(var directionCount=0; directionCount != direction.length; directionCount++){
							//get the tile in the direction we want
							//console.log("checking direction x:"+direction[directionCount].x+" and y:"+direction[directionCount].y);
							var directionTile = map.getTile(x+direction[directionCount].x, y+direction[directionCount].y, groundLayer);
							if(directionTile.index == selectedTile){
								//console.log("direction is valid");
								//console.log("------");
								//one level in is still it. Check around.
								var validCount = 0;
								for(var aroundCount=0; aroundCount != direction.length; aroundCount++){
									//console.log("checking around direction x:"+direction[aroundCount].x+" and y:"+direction[aroundCount].y);
									var aroundTile = map.getTile(x+direction[directionCount].x+direction[aroundCount].x, y+direction[directionCount].y+direction[aroundCount].y);
									if(aroundTile.index != selectedTile && aroundTile.index != selectedTile+1){
										//doesn't match. Exit.
										//console.log("not valid. stop.");
										//stop = true;
										//aroundCount = direction.length-2;
									}else{
										//console.log("is valid..");
										validCount++;
									}
									
									if(validCount == direction.length){
										//we've been through all the tiles and they match!
										//console.log("OH SHIT");
										map.removeTile(x+direction[directionCount].x, y+direction[directionCount].y);
										map.putTile(selectedTile+1, x+direction[directionCount].x, y+direction[directionCount].y);
									}
								}
							}
						}
					}
				}
				

				function buildTile(){
					map.removeTile(x, y);
					map.putTile(selectedTile, x, y);
				}
			}
		}

		//check if a valid tile
		if (tempSelectedTile != undefined) {
			//set tile
			//move cursor
			this.marker.x = x * this.map.tileWidth;
			this.marker.y = y * this.map.tileHeight;
		}
	}
}

