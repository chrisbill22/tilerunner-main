var mapState = {
	create: function(){
		this.game.add.image(0, 0, "mapBackground");
		this.game.add.button(20, 20, 'level1btn', loadLevel1, this, 1, 1, 1);
		this.game.add.button(20, 60, 'level1btn', loadTown1, this, 0, 0, 0);
		this.game.add.button(20, 100, 'level1btn', loadLevel2, this, 1, 1, 1);
		this.game.add.button(20, 140, 'level1btn', loadLevel3, this, 1, 1, 1);
		this.game.add.button(20, 180, 'level1btn', loadLevel4, this, 1, 1, 1);
		
		this.tutorial1 = game.add.text(34, 25, 'Tutorial', {
			fontSize: '18px',
			fill: '#000'
		});
		this.tutorial1.fixedToCamera = true;
		
		this.level1 = game.add.text(32, 105, 'Option 1', {
			fontSize: '18px',
			fill: '#000'
		});
		this.level1.fixedToCamera = true;
		
		this.level2 = game.add.text(32, 145, 'Option 2', {
			fontSize: '18px',
			fill: '#000'
		});
		this.level2.fixedToCamera = true;
		
		this.level3 = game.add.text(32, 185, 'AI Test', {
			fontSize: '18px',
			fill: '#000'
		});
		this.level3.fixedToCamera = true;
		
		function loadLevel1(){
			loadUpState("level1");
		}
		function loadLevel2(){
			loadUpState("level2");
		}
		function loadLevel3(){
			loadUpState("level3");
		}
		function loadLevel4(){
			loadUpState("level4");
		}
		function loadTown1(){
			loadUpState("town1");
		}
		
		this.game.camera.flash("0x000000");
	},
	update: function(){

	},
	render: function(){
			
	}
};