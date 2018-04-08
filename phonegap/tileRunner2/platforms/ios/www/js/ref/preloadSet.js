var preloadSets = [{
	id:"level1",
	state:"level",
	level: 1,
	tilemaps: [{
		name:"map",
		url:"js/levels/level1.json"
	}],
	spritesheets: [{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	},{
		name:"townSet",
		url:"assets/townSet.png"
	},{
		name:"blockbuttons",
		url:"assets/blocksdepth.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"level2",
	state:"level",
	level: 2,
	tilemaps: [{
		name:"map",
		url:"js/levels/level2.json"
	}],
	spritesheets: [{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	},{
		name:"blockbuttons",
		url:"assets/blocksdepth.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"level3",
	state:"level",
	level: 3,
	tilemaps: [{
		name:"map",
		url:"js/levels/level3.json"
	}],
	spritesheets: [{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	},{
		name:"blockbuttons",
		url:"assets/blocksdepth.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"level4",
	state:"level",
	level: 4,
	tilemaps: [{
		name:"map",
		url:"js/levels/levelEnemy1.json"
	}],
	spritesheets: [{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	},{
		name:"blockbuttons",
		url:"assets/blocksdepth.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},
{
	id:"map",
	state:"map",
	level: 1,
	spritesheets: [{
		name:"level1btn",
		url:"assets/level1 button.png",
		tileWidth:96,
		tileHeight:32
	}],
	images: [{
		name:"mapBackground",
		url:"assets/map.jpg"
	}]
},
{
	id:"town1",
	state:"town",
	level: 1,
	tilemaps: [{
		name:"map",
		url:"js/levels/town1.json"
	}],
	spritesheets: [{
		name:"townSet",
		url:"assets/townSet.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	},{
		name:"blockbuttons",
		url:"assets/blocksdepth.png"
	},{
		name:"level1btn",
		url:"assets/level1 button.png",
		tileWidth:96,
		tileHeight:32
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
}];