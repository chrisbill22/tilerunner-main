//the name of the state after it's loaded
var currentState = null;
//the ID of the state to load passed into this state. This loads the state's specific data.
var stateIntent = null;
//the name of the state used to load the state itself.
var stateName = null;

var loadState = {
	preload:function(){
		//load up the user's data and adjust starting point. Load starting town
		
		var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    	var loadingText = game.add.text(0, 0, "Loading...", style);
		loadingText.setTextBounds(0, 100, window.innerWidth, 100);
		
		//Dynamic Loading
		if(stateIntent == null){
			stateIntent = "map"
			//stateIntent = "town1"
		}
		preloadSets.forEach(function(item, index){
			if(item.id == stateIntent){
				stateName = item.state;
				if(item.tilemaps){
					item.tilemaps.forEach(function(tilemap){
						game.load.tilemap(tilemap.name, tilemap.url, null, Phaser.Tilemap.TILED_JSON);
					});
				}
				if(item.spritesheets){
					item.spritesheets.forEach(function(spritesheet){
						var tileWidth = 32;
						var tileHeight = 32;
						if(spritesheet.tileWidth){
							tileWidth = spritesheet.tileWidth
						}
						if(spritesheet.tileHeight){
							tileHeight = spritesheet.tileHeight
						}
						game.load.spritesheet(spritesheet.name, spritesheet.url, tileWidth, tileHeight);
					});
				}
				if(item.images){
					item.images.forEach(function(image){
						game.load.image(image.name, image.url);
					});
				}
			}
		});
		
	},
	
	create:function(){
		console.log("starting "+stateName+", "+stateIntent);
		this.game.camera.onFadeComplete.add(function(){
			game.state.start(stateName);
			currentState = stateIntent;
		});
		this.game.camera.fade();
	}
}

function loadUpState(stateID){
	stateIntent = stateID;
	startEnemies = false;
	levelState.characterStarted = false;
	this.game.camera.onFadeComplete.add(function(){
		game.state.start('load');
	});
	this.game.camera.fade();
}

function restartState(){
	this.game.camera.onFadeComplete.add(function(){
		game.state.restart(true);
	});
	this.game.camera.fade();
}