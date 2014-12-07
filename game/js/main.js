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
	    game.physics.p2.setImpactEvents(true);
		game.physics.p2.defaultRestitution = 0.8;
		game.physics.p2.gravity.y = 200;
		 //  Turn on impact events for the world, without this we get no collision callbacks
	    game.physics.p2.setImpactEvents(true);

	  //  game.physics.p2.restitution = 0.1;

	    //  Create our collision groups. One for the player, one for the pandas
	    var bucketCollisionGroup = game.physics.p2.createCollisionGroup();
	    var garbageCollisionGroup = game.physics.p2.createCollisionGroup();

	    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
	    //  (which we do) - what this does is adjust the bounds to use its own collision group.
	    game.physics.p2.updateBoundsCollisionGroup();

	    game.stage.backgroundColor = '#66CCFF';

	    garbageGroup = game.add.group();
	    garbageGroup.enableBody = true;
    	garbageGroup.physicsBodyType = Phaser.Physics.P2JS;

	    garbageGroup.createMultiple(50, 'bottle', 0, false);
	   	game.physics.p2.enable(garbageGroup, false);
	   	for (var i = garbageGroup.length - 1; i >= 0; i--) {
	   		//garbageGroup.getAt(i).body.collideWorldBounds = true;
	   		garbageGroup.getAt(i).body.setCollisionGroup(garbageCollisionGroup);
	   		//garbageGroup.getAt(i).body.setZeroDamping();
			//garbageGroup.getAt(i).body.fixedRotation = true;
        	garbageGroup.getAt(i).body.collides([bucketCollisionGroup]);
       
	   	};
	   	



	    bucket = game.add.sprite(300, 600, 'bucket');
		game.physics.p2.enable(bucket);
		bucket.body.setZeroDamping();
		bucket.body.fixedRotation = true;
		bucket.body.data.gravityScale = 0;
    
	    bucket.body.setCollisionGroup(bucketCollisionGroup);

   		bucket.body.collides(garbageCollisionGroup, collisionHandler, this);
		
	   

	    cursors = game.input.keyboard.createCursorKeys();

	    game.time.events.loop(150, throwGarbage, this);

	    game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#ffffff' });

	    
		
	}

	function throwGarbage() {

	    var garbage = garbageGroup.getFirstExists(false);
	 
	    if (garbage)
	    {
	        garbage.frame = game.rnd.integerInRange(0,6);
	        garbage.exists = true;
	        garbage.reset(game.world.randomX, 0);
	    }

	}

	function collisionHandler (bucket, garbage) {
    	if (garbage.x >= bucket.x && (garbage.x + garbage.sprite.width <= bucket.x + bucket.sprite.width)) {
    		garbage.sprite.kill();
        	return true;
	    } else {
	    	return false;
	    }

	}

	function update() {

	  //  game.physics.arcade.collide(bucket, garbageGroup, null, catchGarbage, this);
	//    game.physics.arcade.collide(bucket, garbageGroup, collisionHandler, null, this);
	   // game.physics.arcade.collide(garbageGroup,garbageGroup);

	    
    	bucket.body.setZeroVelocity();


	    if (cursors.left.isDown)
	    {
	        bucket.body.moveLeft(200);
	    }
	    else if (cursors.right.isDown)
	    {
	        bucket.body.moveRight(200);
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
		
	    
	}
};