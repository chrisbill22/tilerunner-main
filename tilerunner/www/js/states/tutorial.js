var tutorial = {

    marker: null,
    specailCutsceneID: null,
    enemySpecial1Paused: false,

    preload: function () {},

    create: function () {
        var canvas = $("canvas");
        var thisRef = this;

        //creates the level and the player character
        runnerLevel_create();

        //debug helper
        if (enemyLogging == true) {
            this.levelDebugger();
        }


        enemy_create();

        //--------------------
        //LEVEL CREATE
        //--------------------
        this.ftuxRectangle_left = game.add.graphics();
        this.ftuxRectangle_left.lineStyle(4, 0xffffff, 1);
        this.ftuxRectangle_left.drawRect(2, 2, canvas.width() / 2, canvas.height() - 4 - 64);
        this.ftuxRectangle_left.fixedToCamera = true;
        this.ftuxRectangle_left.alpha = 0;

        this.ftuxRectangle_right = game.add.graphics();
        this.ftuxRectangle_right.lineStyle(4, 0xffffff, 1);
        this.ftuxRectangle_right.drawRect((canvas.width() / 2) - 2, 2, canvas.width() / 2, canvas.height() - 4 - 64);
        this.ftuxRectangle_right.fixedToCamera = true;
        this.ftuxRectangle_right.alpha = 0;

        this.ftux = game.add.text((canvas.width() / 2) - 70, (canvas.height() / 2) - 50, 'Tap to Start', {
            fontSize: '28px',
            fill: '#FFF'
        });
        this.ftux.setShadow(0, 2, 'rgba(0,0,0,1)', 4);
        this.ftux.fixedToCamera = true;

        game.camera.flash("0x000000");

        //this.topLayer = map.createLayer('top');

        console.log("end create");
    },

    update: function () {

        runnerLevel_update();
        player_update();
        enemy_update(character, map, layer, this.marker);

        //--------------------
        //LEVEL UPDATE
        //--------------------
        var thisRef = this;
        game.physics.arcade.overlap(character, items, function (character, item) {
            item.kill();
            console.log(item);

            checkStandardItems(item);

            if (item.name == "ftux1") {
                thisRef.ftux.setText("Tap the left side of the screen");
                var canvas = $("canvas");
                thisRef.ftux.setTextBounds(-90, -200);
                //thisRef.ftux.setTextBounds(80)
                thisRef.ftux.wordWrap = true;
                thisRef.ftux.wordWrapWidth = (canvas.width() / 2) - map.tileWidth;
                game.add.tween(thisRef.ftuxRectangle_left).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
            } else if (item.name == "ftux2") {
                thisRef.ftux.setText("Tap the right side of the screen");
                var canvas = $("canvas");
                //thisRef.ftux.setTextBounds(-80, -200);
                thisRef.ftux.setTextBounds(95, -200);
                game.add.tween(thisRef.ftuxRectangle_right).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
            } else if (item.name == "ftux3") {
                thisRef.ftux.setText("Tap either side of the screen");
                var canvas = $("canvas");
                thisRef.ftux.setTextBounds(0, 0);
                game.add.tween(thisRef.ftuxRectangle_right).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftuxRectangle_left).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(thisRef.ftux).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true);
            }
        });


        if (leftButtonDown == true || rightButtonDown == true) {
            if (this.ftux.text == "Tap the left side of the screen") {
                game.add.tween(this.ftuxRectangle_left).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(this.ftux).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
            } else if (this.ftux.text == "Tap the right side of the screen") {
                game.add.tween(this.ftuxRectangle_right).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(this.ftux).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
            } else if (this.ftux.text == "Tap either side of the screen") {
                game.add.tween(this.ftuxRectangle_right).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(this.ftuxRectangle_left).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
                game.add.tween(this.ftux).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
            }

            if (characterStarted == false) {
                game.add.tween(this.ftux).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true);
            }
        }

    },

    render: function () {
        game.debug.text(game.time.fps, 2, 14, "#000000");
    },




    showCutscene: function () {

    },


    levelDebugger: function () {
        //Tile info debug marker
        this.marker = game.add.graphics();
        this.marker.lineStyle(2, 0x33ccff, 1);
        this.marker.drawRect(0, 0, map.tileWidth, map.tileHeight);

        //mouse input
        game.input.onTap.add(moveSelectedToCursor, this);

        //keyboard input
        var right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(function () {
            movePlayer("right")
        }, this);

        var left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(function () {
            movePlayer("left")
        }, this);

        var up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(function () {
            movePlayer("up")
        }, this);

        var down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(function () {
            movePlayer("down")
        }, this);
    }
};
