window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create , update: update, render: render });
    function preload () {
        game.load.image('logo', 'game/images/phaser.png');
  		game.load.image('bucket', 'game/images/bucket.png');
        game.load.image('bottle', 'game/images/bottle.png');
    }

  	var bucket;
	var garbageGroup;
	var cursors;

	function create() {
	    game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 0.8;
		game.physics.p2.gravity.y = 400;

	    game.stage.backgroundColor = '#66CCFF';

	    garbageGroup = game.add.group();

	    garbageGroup.createMultiple(50, 'bottle', 0, false);
	   game.physics.p2.enable(garbageGroup);

	    bucket = game.add.sprite(300, 450, 'bucket');
		game.physics.p2.enable(bucket);
		bucket.body.setZeroDamping();
		bucket.body.fixedRotation = true;
	    //game.physics.p2.gravity.y = 400;

	    //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
	  //  game.physics.p2.enable(game.world, true);
	   
		
	    bucket.body.allowGravity = 0;
	    // bucket.body.checkCollision.left = false;
	    // bucket.body.checkCollision.right = false;
		//bucket.body.setSize(94, 138, 0, 75);
		bucket.body.collideWorldBounds = true;
	    bucket.body.immovable = true;

	    cursors = game.input.keyboard.createCursorKeys();

	    game.time.events.loop(150, throwGarbage, this);

	    game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#ffffff' });

	}

	function throwGarbage() {

	    var garbage = garbageGroup.getFirstExists(false);
	 //   game.physics.p2.enable(garbage,false);
	    if (garbage)
	    {
	        garbage.frame = game.rnd.integerInRange(0,6);
	        garbage.exists = true;
	        garbage.reset(game.world.randomX, 0);
	     
	      //  garbage.body.bounce.y = 0.3;
	    }

	}

	function collisionHandler (bucket, garbage) {
    	if (garbage.x >= bucket.x && (garbage.x + garbage.width <= bucket.x + bucket.width)) {
    		garbage.kill();
        	return true;
	    } else  {
	    	garbage.body.velocity.x = bucket.body.velocity.x;
	  //      garbage.body.angularVelocity = 200;
	        return false;
	    }

	}

	function update() {

	  //  game.physics.arcade.collide(bucket, garbageGroup, null, catchGarbage, this);
	//    game.physics.arcade.collide(bucket, garbageGroup, collisionHandler, null, this);
	   // game.physics.arcade.collide(garbageGroup,garbageGroup);

	    bucket.body.velocity.x = 0;

	    if (cursors.left.isDown)
	    {
	        bucket.body.velocity.x = -200;
	    }
	    else if (cursors.right.isDown)
	    {
	        bucket.body.velocity.x = 200;
	    }

	    garbageGroup.forEachAlive(checkBounds, this);

	}

	function checkBounds(garbage) {

	    if (garbage.y > 600)
	    {
	        garbage.kill();
	    }

	}

	function render() {
		game.debug.body(bucket);
		garbageGroup.forEachAlive(function(garbage) {
			game.debug.body(garbage);
		}, this);
	    
	}
};