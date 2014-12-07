window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create , update: update, render: render });
    function preload () {
        game.load.image('logo', 'game/images/phaser.png');
  		game.load.image('bucket_danger', 'game/images/bucket_danger.png');
  		game.load.image('bucket_plastics', 'game/images/bucket_plastics.png');
  		game.load.image('bucket_glass', 'game/images/bucket_glass.png');
  		game.load.atlas('bucket_paper', 'game/images/bucket_paper_sprite.png', 'game/images/bucket_paper_sprite.json');
        game.load.image('bottle', 'game/images/bottle.png');
        game.load.image('paper', 'game/images/paper.png');
    }

  	var bucket;
	var garbageGroup;
	var cursors;
	var score = 0;
	var scoreText;
	var BucketType = {
		PAPER: 'paper',
		GLASS: 'bottle',
		PLASTICS: 'plastics',
		DANGER: 'danger'
	};

	var BucketKeys = {
		paper: null,
		glass: null,
		plastics: null,
		danger: null
	};

	var waveIndex = 0;
	var waveMatrix = [
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	function create() {

	    game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.setImpactEvents(true);
		game.physics.p2.defaultRestitution = 1.0;
		game.physics.p2.gravity.y = 200;
		 //  Turn on impact events for the world, without this we get no collision callbacks
	    game.physics.p2.setImpactEvents(true);

	  //  game.physics.p2.restitution = 0.1;

	    //  Create our collision groups. One for the player, one for the pandas
	    var bucketCollisionGroup = game.physics.p2.createCollisionGroup();
	    var garbageCollisionGroup = game.physics.p2.createCollisionGroup();

	    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
	    //  (which we do) - what this does is adjust the bounds to use its own collision group.
	//    game.physics.p2.updateBoundsCollisionGroup();

	    game.stage.backgroundColor = '#66CCFF';

	    garbageGroup = game.add.group();
	    garbageGroup.enableBody = true;
    	garbageGroup.physicsBodyType = Phaser.Physics.P2JS;

		garbageGroup.createMultiple(50, 'paper', 0, false);
	    garbageGroup.createMultiple(50, 'bottle', 0, false);

	   	game.physics.p2.enable(garbageGroup, false);
	   	for (var i = garbageGroup.length - 1; i >= 0; i--) {
	   		//garbageGroup.getAt(i).body.collideWorldBounds = true;
	   		garbageGroup.getAt(i).body.setCollisionGroup(garbageCollisionGroup);
	   		//garbageGroup.getAt(i).body.setZeroDamping();
			//garbageGroup.getAt(i).body.fixedRotation = true;
        	garbageGroup.getAt(i).body.collides([bucketCollisionGroup]);
       
	   	};
	   	

	    bucket = game.add.sprite(300, 600, 'bucket_paper');

		game.physics.p2.enable(bucket);
		bucket.body.setZeroDamping();
		bucket.body.fixedRotation = true;
		bucket.body.data.gravityScale = 0;
    
	    bucket.body.setCollisionGroup(bucketCollisionGroup);

   		bucket.body.collides(garbageCollisionGroup, collisionHandler, this);
   		bucket.type = BucketType.PAPER;

	    cursors = game.input.keyboard.createCursorKeys();
	     
	    BucketKeys.paper  = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    	BucketKeys.paper.onDown.add(setPaperBucket, this);
    	BucketKeys.glass  = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    	BucketKeys.glass.onDown.add(setGlassBucket, this);
    	BucketKeys.plastics  = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    	BucketKeys.plastics.onDown.add(setPlasticsBucket, this);
    	BucketKeys.danger  = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    	BucketKeys.danger.onDown.add(setDangerBucket, this);

	    game.time.events.loop(300, throwGarbage, this);

	   scoreText = game.add.text(16, 16, 'Score: ' + score, { font: '18px Arial', fill: '#ffffff' });

	}

	function setPaperBucket () {
    	bucket.type = BucketType.PAPER;
    	bucket.loadTexture('bucket_paper', 0);
	}

	function setGlassBucket () {
    	bucket.type = BucketType.GLASS;
    	bucket.loadTexture('bucket_glass', 0);
	}

	function setPlasticsBucket () {
    	bucket.type = BucketType.PLASTICS;
    	bucket.loadTexture('bucket_plastics', 0);
	}

	function setDangerBucket () {
    	bucket.type = BucketType.DANGER;
    	bucket.loadTexture('bucket_danger', 0);
	}

	function throwGarbage() {

		var wave = waveMatrix[waveIndex];
		for (var i = 0; i < wave.length; i++) {
			var garbage;
			var property;

			if(wave[i] == 0) {
				continue;
			} else if(wave[i] == 1) {
				property = 'paper'
			} else if(wave[i] == 2) {
				property = 'bottle'
			}

			while(!garbage || 
				garbage.exists ||
				garbage.key != property) {
					garbage = garbageGroup.next();
			}
			    
			garbage.frame = game.rnd.integerInRange(0,6);
			garbage.exists = true;
			delete garbage.collided;
			        //garbage.reset(game.world.randomX, 0);
			garbage.reset(800/wave.length*i, 0);
			
		};
		if(waveIndex < waveMatrix.length-1) {
			waveIndex++;	
		} else {
			waveIndex = 0;
		}
	    

	}

	function collisionHandler (bucket, garbage) {
    	if (garbage.x + garbage.sprite.width/2 >= bucket.x && (garbage.x + garbage.sprite.width*3/2 <= bucket.x + bucket.sprite.width)) {
    		garbage.sprite.kill();
			if(!garbage.sprite.collided) {
    			garbage.sprite.collided = true;
    			if(bucket.sprite.type == garbage.sprite.key) {
    				score++;
    				bucket.sprite.frame = 1;

    			} else {
    				score--;	

    				bucket.sprite.frame = 0;
    			}
    			
    			scoreText.setText("Score is score it: " + score);
			}
        	return true;
	    } else {
	    	return false;
	    }

	}

	function update() {

	  	// game.physics.arcade.collide(bucket, garbageGroup, null, catchGarbage, this);
		// game.physics.arcade.collide(bucket, garbageGroup, collisionHandler, null, this);
	    // game.physics.arcade.collide(garbageGroup,garbageGroup);

    	bucket.body.setZeroVelocity();
    	bucket.body.y = 532;

	    if (cursors.left.isDown && bucket.body.x>0)
	    {
	        bucket.body.moveLeft(200);          
	    }
	    else if (cursors.right.isDown && bucket.body.x<800)
	    {
	        bucket.body.moveRight(200);
           
	    }

	    garbageGroup.forEachAlive(checkBounds, this);
	}

	function checkBounds(garbage) {
	    if (garbage.y > 600) {
	        garbage.kill();
	        delete garbage.collided;
	    }
	}

	function render() {
		game.debug.body(bucket);
	}
};