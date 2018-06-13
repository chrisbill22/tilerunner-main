//----------------
//	REQUIRES
//----------------
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongo = require('mongodb').MongoClient;

//----------------
//	VARIABLES
//----------------
var players = Array();
var firstSpawnPoint = {tileSet:0, tileX:0, tileY:0};

//----------------
//	PAGE GETS
//----------------
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/admin', function (req, res) {
	res.sendFile(__dirname + '/admin.html');
});

app.get('/map/:id', function (req, res) {
	res.sendFile(__dirname + '/maps/' + req.params.id + "/map.js");
});

app.get('/js/:script', function (req, res) {
	res.sendFile(__dirname + '/js/' + req.params.script);
});
app.get('/js/external/:script', function (req, res) {
	res.sendFile(__dirname + '/js/external/' + req.params.script);
});
app.get('/js/levels/:script', function (req, res) {
	res.sendFile(__dirname + '/js/levels/' + req.params.script);
});
app.get('/js/ref/:script', function (req, res) {
	res.sendFile(__dirname + '/js/ref/' + req.params.script);
});
app.get('/js/states/:script', function (req, res) {
	res.sendFile(__dirname + '/js/states/' + req.params.script);
});

app.get('/map/:id/:image', function (req, res) {
	res.sendFile(__dirname + '/maps/' + req.params.id + "/" + req.params.image);
});

app.get('/assets/:file', function (req, res) {
	res.sendFile(__dirname + '/assets/' + req.params.file);
});


//Phaser Tutorial
app.get('/phaser_tut/:file', function (req, res) {
	res.sendFile(__dirname + '/phaser_tut/' + req.params.file );
});
app.get('/phaser_tut/js/:file', function (req, res) {
	res.sendFile(__dirname + '/phaser_tut/js/' + req.params.file );
});
app.get('/phaser_tut/assets/:file', function (req, res) {
	res.sendFile(__dirname + '/phaser_tut/assets/' + req.params.file );
});


//----------------------
//	SOCKET EXECUTION
//----------------------
io.on('connection', function (socket) {
	//console.log("A user connected");
	
	//Registration
	socket.emit('registered', getOrCreatePlayerID(socket));
	
	socket.on('registrationComplete', function (playerId) {
		socket.broadcast.emit('newPlayer', getPlayerById(playerId));
	});
	
	//Player Position
	socket.on('getPlayerPosition', function (playerId) {
		socket.emit('playerPositionReturn', getPlayerById(playerId));
	});
	
	socket.on('playerMoved', function (tileSet, tileX, tileY, playerId) {
		updatePlayerMovement(tileSet, tileX, tileY, playerId);
		io.emit('playerMoved', tileSet, tileX, tileY, playerId);
	});
});

//----------------------
//	SOCKET FUNCTIONS
//----------------------
function getOrCreatePlayerID(socket){
	for(var i = 0; i < players.length; i++) {
		if(players[i].id == socket.id){
			return item.id;
		}
	}
	
	players.push(mergeJSON({id: socket.id}, firstSpawnPoint));
	return socket.id;

}

//----------------------
//	HELPER FUNCTIONS
//----------------------
function mergeJSON(json1, json2){
	var result = {};
	for(var key in json1) result[key] = json1[key];
	for(var key in json2) result[key] = json2[key];
	return result;
}

function getPlayerById(playerID){
	for(var i = 0; i < players.length; i++) {
		if(players[i].id == playerID){
			return players[i];
		}
	}
}

function updatePlayerMovement(tileSet, tileX, tileY, playerId){
	for(var i = 0; i < players.length; i++) {
		if(players[i].id == playerID){
			player[i].tileSet = tileSet;
			player[i].tileX = tileX;
			player[i].tileY = tileY;
			return true;
		}
	}
	return false;
}



//----------------------
//	PORT START
//----------------------
app.set('port', (process.env.PORT || 3000));

server.listen({
  host: 'localhost',
  port: app.get('port')
}, function () {
	console.log('Tile game example running on port ', app.get('port'));
});
