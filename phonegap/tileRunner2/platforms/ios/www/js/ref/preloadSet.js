var preloadSets = [{
	id:"tutorial",
	state:"level",
	level: 1,
	tilemaps: [{
		name:"map",
		url:"js/levels/level1.json"
	}],
	spritesheets: [{
		name:"protoblocks",
		url:"assets/protoblocks.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"demo",
	state:"level",
	level: 2,
	tilemaps: [{
		name:"map",
		url:"js/levels/level2.json"
	}],
	spritesheets: [{
		name:"protoblocks",
		url:"assets/protoblocks.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"demo64",
	state:"level",
	level: 2,
	tilemaps: [{
		name:"map",
		url:"js/levels/level2-64.json"
	}],
	spritesheets: [{
		name:"protoblocks",
		url:"assets/protoblocks64.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary64.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"level1",
	state:"level",
	level: 1,
	tilemaps: [{
		name:"map",
		url:"js/levels/introSequence.json"
	}],
	spritesheets: [{
		name:"protoblocks",
		url:"assets/protoblocks.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary.png"
	}],
	images: [{
		name:"footerBackground",
		url:"assets/footer.png"
	}]
},{
	id:"ai",
	state:"level",
	level: 4,
	tilemaps: [{
		name:"map",
		url:"js/levels/levelEnemy1.json"
	}],
	spritesheets: [{
		name:"protoblocks",
		url:"assets/protoblocks.png"
	},{
		name:"groundTile",
		url:"assets/batch-necessary.png"
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