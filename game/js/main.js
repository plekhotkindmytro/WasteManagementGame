window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create , update: update, render: render });
    function preload () {
        game.load.image('logo', 'game/images/phaser.png');
  		game.load.image('bucket', 'game/images/bucket.png');
        game.load.image('bottle', 'game/images/bottle.png');
    }

  	var bucket;
	var bottle;
	var cursors;

	function create() {
	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    game.stage.backgroundColor = '#2d2d2d';

	    bottle = game.add.group();

	    bottle.createMultiple(250, 'bottle', 0, false);

	    bucket = game.add.sprite(300, 450, 'bucket');

	    game.physics.arcade.gravity.y = 400;

	    //  Enable physics on everything added to the world so far (the true parameter makes it recurse down into children)
	    game.physics.arcade.enable(game.world, true);

	    bucket.body.allowGravity = 0;
	    bucket.body.immovable = true;

	    cursors = game.input.keyboard.createCursorKeys();

	    game.time.events.loop(150, fire, this);

	    game.add.text(16, 16, 'Left / Right to move', { font: '18px Arial', fill: '#ffffff' });

	}

	function fire() {

	    var ball = bottle.getFirstExists(false);

	    if (ball)
	    {
	        ball.frame = game.rnd.integerInRange(0,6);
	        ball.exists = true;
	        ball.reset(game.world.randomX, 0);

	        ball.body.bounce.y = 0.8;
	    }

	}

	function reflect(a, ball) {

	    if (ball.y > (bucket.y + 5))
	    {
	        return true;
	    }
	    else
	    {
	        ball.body.velocity.x = bucket.body.velocity.x;
	        ball.body.velocity.y *= -(ball.body.bounce.y);

	        return false;
	    }

	}

	function update() {

	    game.physics.arcade.collide(bucket, bottle, null, reflect, this);

	    bucket.body.velocity.x = 0;

	    if (cursors.left.isDown)
	    {
	        bucket.body.velocity.x = -200;
	    }
	    else if (cursors.right.isDown)
	    {
	        bucket.body.velocity.x = 200;
	    }

	    bottle.forEachAlive(checkBounds, this);

	}

	function checkBounds(ball) {

	    if (ball.y > 600)
	    {
	        ball.kill();
	    }

	}

	function render() {

	}
};