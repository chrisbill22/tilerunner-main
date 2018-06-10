//This file is used to control gras tiles to show a sprite going through them

//USED TO SHOW GRAS CHANGING
function grass_create(){
    map.setTileIndexCallback(Array(frame(3, 2),frame(4, 2),frame(5, 2),frame(33, 2),frame(34, 2),frame(35, 2),frame(63, 2),frame(64, 2),frame(65, 2)),function(sprite,tile){
        var leftTile = map.getTile(tile.x-1, tile.y);
        var rightTile = map.getTile(tile.x+1, tile.y);
        var left2Tile = map.getTile(tile.x-2, tile.y);
        var right2Tile = map.getTile(tile.x+2, tile.y);

        map.removeTile(tile.x, tile.y);

        if(leftTile.index == frame(68, 2) && (left2Tile.index == frame(69, 2) || left2Tile.index == frame(155, 2))){
            //left and second left have been updated
            map.putTile(frame(68, 2), tile.x, tile.y); 
            //left tile
            map.removeTile(tile.x-1, tile.y);
            map.putTile(frame(155, 2), tile.x-1, tile.y);
        }else if(rightTile.index == frame(69, 2) && (right2Tile.index == frame(68, 2) || right2Tile.index == frame(155, 2))){
            //left and second left have been updated
            map.putTile(frame(69, 2), tile.x, tile.y); 
            //left tile
            map.removeTile(tile.x-1, tile.y);
            map.putTile(frame(155, 2), tile.x-1, tile.y);
        }else if(leftTile.index == frame(123, 2)){
            //left tile has been updated
            map.putTile(frame(68, 2), tile.x, tile.y); 
            //left tile
            map.removeTile(tile.x-1, tile.y);
            map.putTile(frame(69, 2), tile.x-1, tile.y);
        }else if(rightTile.index == frame(123, 2)){
            //right tile has been updated
            map.putTile(frame(69, 2), tile.x, tile.y); 
            //right tile
            map.removeTile(tile.x+1, tile.y);
            map.putTile(frame(68, 2), tile.x+1, tile.y); 
        }else{
            //all the tiles left and right are the default
            map.putTile(frame(123, 2), tile.x, tile.y);    
        }

    }, game)
}