//The text object holding the gold label
var scoreText;

//The help progress object
var healthProgress;

//A single heath item
var health1;

var footerButtons = Array();
var selectedTile = null;

function hud_create(){
    var canvas = $("canvas");
	
	var buttonSize = 32;
	var buttonPadding = 5;
	
	footer = game.add.group();
	/*footer.width = canvas.width();
	footer.height = 50;
	footer.x = 0;
	footer.y = canvas.height() - 50;*/
	
	footer.fixedToCamera = true;
	
	footerBackground = game.add.graphics(0, 0);
	footerBackground.beginFill(0xDDDDDD, 1);
    footerBackground.drawRect(0, canvas.height()-(buttonSize+buttonPadding*2), canvas.width(), (buttonSize+buttonPadding*2));
	
	lightGreenButton = game.add.button(buttonPadding, canvas.height()-(buttonSize+buttonPadding), 'exampleTileset', doButton, this, 1, 1, 1);
	lightGreenButton.data.tileType = "grass";
	lightGreenButton.inputEnabled = true;
	
	var brownButton = game.add.button(buttonPadding*2+buttonSize*1, canvas.height()-(buttonSize+buttonPadding), 'exampleTileset', doButton, this, 4, 4, 4);
	brownButton.data.tileType = "dirt";
	brownButton.inputEnabled = true;
	
	var lightBlueButton = game.add.button(buttonPadding*3+buttonSize*2, canvas.height()-(buttonSize+buttonPadding), 'exampleTileset', doButton, this, 6, 6, 6);
	lightBlueButton.data.tileType = "water";
	lightBlueButton.inputEnabled = true;
	
	var greyButton = game.add.button(buttonPadding*4+buttonSize*3, canvas.height()-(buttonSize+buttonPadding), 'exampleTileset', doButton, this, 10, 10, 10);
	greyButton.data.tileType = "mountain";
	greyButton.inputEnabled = true;
	
	var selectBorder = game.add.graphics();
	selectBorder.lineStyle(2, 0x000000, 1);
	selectBorder.drawRect(0, 0, buttonSize, buttonSize);
	
	function doButton(sprite){
		console.log("doing");
		selectBorder.x = sprite.x;
		selectBorder.y = sprite.y;
		console.log(sprite.data.tileType);
		console.log(sprite);
		selectedTile = sprite._onDownFrame;
		switch (sprite.data.tileType){
			case "grass":
				break;
			case "dirt":
				break;
			case "water":
				break;
			case "mountain":
				break;
		}
	}
	
	footer.add(footerBackground);
	footer.add(lightGreenButton);
	footer.add(brownButton);
	footer.add(lightBlueButton);
	footer.add(greyButton);
	
	
	//HUD tips
	//blockbutton.fixedToCamera = true;
	//use the canvas to make it responsive
	//create text instead of having it on an image game.add.text
	//add a background image game.add.image
	
}