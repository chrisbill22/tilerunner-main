var mapState = {
	create: function(){
		this.game.add.image(0, 0, "mapBackground");
		
		
		//tutorial
		this.game.add.button(20, 20, 'level1btn', tutorial, this, 1, 1, 1);
		function tutorial(){
			loadUpState("tutorial");
		}
		this.tutorialBtn = game.add.text(34, 25, 'Tutorial', {
			fontSize: '18px',
			fill: '#000'
		});
		this.tutorialBtn.fixedToCamera = true;
		
		
		//town
		this.game.add.button(20, 60, 'level1btn', loadTown1, this, 0, 0, 0);
		function loadTown1(){
			loadUpState("town1");
		}
		
		
		//Demo1
		this.game.add.button(20, 100, 'level1btn', demo, this, 1, 1, 1);
		function demo(){
			loadUpState("demo");
		}
		this.demoBtn = game.add.text(32, 105, 'Demo', {
			fontSize: '18px',
			fill: '#000'
		});
		this.demoBtn.fixedToCamera = true;
        
        
        //Demo1-64
		this.game.add.button(20, 220, 'level1btn', demo64, this, 1, 1, 1);
		function demo64(){
			loadUpState("demo64");
		}
		this.demo64Btn = game.add.text(32, 225, 'Demo64', {
			fontSize: '18px',
			fill: '#000'
		});
		this.demo64Btn.fixedToCamera = true;
		
		
		//Level 1
		this.game.add.button(20, 140, 'level1btn', level1, this, 1, 1, 1);
		function level1(){
			loadUpState("level1");
		}
		this.level1Btn = game.add.text(32, 145, 'Level 1', {
			fontSize: '18px',
			fill: '#000'
		});
		this.level1Btn.fixedToCamera = true;
		
		
		//AI Test
		this.game.add.button(20, 180, 'level1btn', ai, this, 1, 1, 1);
		function ai(){
			loadUpState("ai");
		}
		this.aiBtn = game.add.text(32, 185, 'AI Test', {
			fontSize: '18px',
			fill: '#000'
		});
		this.aiBtn.fixedToCamera = true;
		

		
		
		
		this.game.camera.flash("0x000000");
	},
	update: function(){

	},
	render: function(){
			
	}
};