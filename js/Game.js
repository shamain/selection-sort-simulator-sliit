//developed by shamain

//game object which holds the game canvas data and framwork implementation.
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.CANVAS, 'game', {preload: preload, create: create});


var arr; // array of values from the user input
var group = new Array(); // array of group this holds the simulation elements
var index = new Array(); // array of indexes, this is for visual representation of indexes
var text = new Array(); // array of visual text to display on top of simulating elements
var swapped; // flag for check is an element is swapped
var bucket; // the visual representation of temp variable which holds the minimum value index of a particular round. 
//variables which holds game sound
var wrongSound;
var swipeSound
var completeSound;
var order;

// this funtion will called by the user input and sets the passing array with the selection if its a acending or decenting 
function setValues(ar, or) {
    order = or;// acending or decending
    arr = ar;//array

}

// this is the funtion which loads the assets prior to the simulator initialization. this includes both sound and image data.
function preload() {
    game.load.image('ball', 'images/ball.png');
    game.load.image('ball_s', 'images/ball_s.png');
    game.load.image('ball_n', 'images/ball_n.png');
    game.load.image('temp', 'images/temp.png');
    game.load.image('ball_c', 'images/ball_c.png');
    game.load.audio('swipe', 'images/sw.mp3');
    game.load.audio('complete', 'images/complete.mp3');
    game.load.audio('up', 'images/up.mp3');
    game.load.audio('wrongup', 'images/wrongup.mp3');

}

// this funtion is called once by the framwork and it initialize the all declared variables.
function create() {

    game.scale.startFullScreen();// sets the size of the simulator to full screen.
    this.game.stage.backgroundColor = '#1bbef4';// sets the background color of the simulator.

    //initialize the sound variables with relavent sound assets.
    upSound = game.add.audio('up');
    wrongSound = game.add.audio('wrongup');
    swipeSound = game.add.audio('swipe');
    completeSound = game.add.audio('complete');

    //generate font style for future use.
    var style = {font: "25px Calibri", fill: "#ffffff", align: "center"};

    //calculates the starting center point to draw the simulating elements
    x = ($(window).width() - (arr.length * 80)) / 2;
    //console.log(x);

    //this loops draws the visual elements to the canvas
    for (var i = 0; i < arr.length; i++) {
        //initialize the group and index array and add the sprite elements to each element
        //sets the location of each group
        //add text to each
        group[i] = game.add.group();
        index[i] = game.add.group();
        group[i].x = x;
        group[i].y = game.world.centerY;
        index[i].x = x;
        index[i].y = game.world.centerY + 100;
        group[i].create(0, 0, "ball");
        game.add.text(25, 25, arr[i], style, group[i]);
        game.add.text(25, 25, '' + i, style, index[i]);
        x += 80;
    }

    //adds the visual temp variable to screen and sets its size
    bucket = game.add.group();
    bucket.x = 30;
    bucket.y = 30;
    bucket.create(0, 0, "temp"); //will only ever create and add sprites.
    // style of temp visual element text
    game.add.text(45, 35, '' + 0, style, bucket);
    var style = {font: "20px Calibri", fill: "#ffffff", align: "left"};
    game.add.text(0, 100, 'Current minimum\nvalue index', style, bucket);

    //this align the simulator elements to horizontal center
    game.scale.pageAlignHorizontally = true;
    //this sets the scale mood of the simulator such that if the browser is minimized all the game elements will be minimized.
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    //some responsive stuff, enabling this simulation possible via mobile :).
    game.scale.setShowAll();
    game.scale.refresh();
    game.scale.enterPortrait.add(portraitmood, this);
    game.scale.enterLandscape.add(landscapemood, this);
    //call the sort funtion by passing the array of values.
    selectionSort(arr);
	game.stage.disableVisibilityChange = true;

}

/*
 * These are responsive related funtions which called by the phaser game engine a runtime.
 * 
 */

function portraitmood() {
    location.reload();


}

function landscapemood() {
    location.reload();
}

//sort funtion begin. here i did not used any loops or algorithm code, instead we tried to simulate the actual code with setInterval funtion wich let me to draw the animation
//to tackle the boundries which i had with loops, i used conditions.
function selectionSort(sortMe)
{
    var holder = 0, i = 1; // globle variable holding the total runtime and counter variable i
    var counter = 1;

    var flag = true;
    var tmp = holder;
    //set the interval. this funtion will called again and again by the dealy of specified amount of time.

    var interval = setInterval(function() {
        //check if the sort has come to its end
        if (holder == sortMe.length - 1) {
            //if yes show the complete status and put the last man down.play some ta daaa
            game.add.tween(group[sortMe.length - 1]).to({y: '+100'}, 400, Phaser.Easing.Bounce.Out).start();
            group[sortMe.length - 1].getAt(0).loadTexture('ball_c');
            completeSound.play();

            var style = {font: "65px Calibri", fill: "#ffffff", align: "center"};
            var text = game.add.text(game.world.centerX, 70, "Sort Complete", style);

            text.anchor.set(0.5);

            //console.log('end loop');
            clearInterval(interval); // clear the interval

        } else {
            //if its not the end of the sort we check if this the end of one round.
            if (i == sortMe.length) {

                //if yes
                var distance = (tmp - holder) * 80; // calculate the distance to move the balls 
                // console.log(holder + '  ' + tmp + ' ' + distance);

                //check if no elements to swap found
                if (parseFloat(holder) == parseFloat(tmp)) {
                    //if true just put that guy down.
                    game.add.tween(group[holder]).to({y: '+100'}, 400, Phaser.Easing.Bounce.Out).start();

                } else {
                    //if not just swap those elements this is a chained animation in phaser and its bit long.
                    game.add.tween(group[holder]).to({x: '+' + distance}, 400, Phaser.Easing.Bounce.Out)
                            .to({y: '+100'}, 400, Phaser.Easing.Bounce.Out)
                            .start();
                    swipeSound.play();//play some sound
                    var teween = game.add.tween(group[tmp]).to({y: '+100'}, 400, Phaser.Easing.Bounce.Out)
                            .to({x: '-' + distance}, 400, Phaser.Easing.Bounce.Out)
                            .to({y: '-100'}, 400, Phaser.Easing.Bounce.Out)
                            .start();
                }
                //change the sorted elements texture
                group[tmp].getAt(0).loadTexture('ball_c');
                //As we have visually change the positions of the elements we also have to change the values of existing arrays
                //this case i have to do in both group and value array.
                var temp = group[tmp];
                group[tmp] = group[holder];
                group[holder] = temp;
                var tempArr = arr[tmp];
                arr[tmp] = arr[holder];
                arr[holder] = tempArr;

                //increase the next starting point
                holder++;
                //increase the counter varibale to start next round
                i = ++counter;
                //flag to keep track of staring point
                flag = true;
                //this sets the temp variables value as the starting point of each new iteration
                tmp = holder;
                //this timeout funtion avoids this senario once the swap animation done it gives a resting time before starting next iteration
                //so the two animation will not overlap
                setTimeout(function() {
                    var tween = game.add.tween(group[holder]).to({y: '-100'}, 400, Phaser.Easing.Bounce.Out).start();
                    //for each new iteration set the texture back to default
                    for (var xx = holder + 1; xx < group.length; xx++) {
                        group[xx].getAt(0).loadTexture('ball');
                    }
                    upSound.play();

                }, 1500);
            }
            //this flag for indentify the first run
            if (flag) {
                if (holder == 0) {
                    var tween = game.add.tween(group[holder]).to({y: '-100'}, 400, Phaser.Easing.Bounce.Out)
                            .start();
                    upSound.play();
                }
                flag = false;
            } else {
                //if this is not the first run then check what is the type of order that user needs to simulate.
                if (order == 'acending') {
                    //if acending compare the values
                    if (parseFloat(arr[i]) < parseFloat(arr[tmp])) {
                        //add some yoyo pop effect to element
                        game.add.tween(bucket.scale).to({x: 1.2, y: 1.2}, 400, Phaser.Easing.Back.InOut, true, 0, false).yoyo(true);
                        //save the index of smallest value to visual temp bucket
                        bucket.getAt(1).text = i + '';
                        group[tmp].getAt(0).loadTexture('ball');
                        tmp = i;//also in the temp varible
                        //sets current smallest elements texture
                        group[i].getAt(0).loadTexture('ball_s');
                        //this animation put up and down the elements
                        game.add.tween(group[i]).to({y: '-150'}, 400, Phaser.Easing.Bounce.Out)
                                .to({y: '+150'}, 400, Phaser.Easing.Bounce.Out)
                                .start();
                        upSound.play();//add sound to each pop

                    } else {
                        //if the comparison not success then color that element in red and play a different sound and add animation
                        group[i].getAt(0).loadTexture('ball_n');
                        wrongSound.play();
                        var tween = game.add.tween(group[i]).to({y: '-150'}, 400, Phaser.Easing.Bounce.Out).to({y: '+150'}, 400, Phaser.Easing.Bounce.Out).start();
                    }

                } else {
                    //this is the same as above part some code repetition due to change of comparisons.
                    if (parseFloat(arr[i]) > parseFloat(arr[tmp])) {
                        game.add.tween(bucket.scale).to({x: 1.2, y: 1.2}, 400, Phaser.Easing.Back.InOut, true, 0, false).yoyo(true);
                        bucket.getAt(1).text = i + '';
                        group[tmp].getAt(0).loadTexture('ball');
                        tmp = i;

                        group[i].getAt(0).loadTexture('ball_s');

                        game.add.tween(group[i]).to({y: '-150'}, 400, Phaser.Easing.Bounce.Out)
                                .to({y: '+150'}, 400, Phaser.Easing.Bounce.Out)
                                .start();
                        upSound.play();

                    } else {
                        group[i].getAt(0).loadTexture('ball_n');


                        wrongSound.play();

                        var tween = game.add.tween(group[i]).to({y: '-150'}, 400, Phaser.Easing.Bounce.Out)
                                .to({y: '+150'}, 400, Phaser.Easing.Bounce.Out)
                                .start();
                    }
                }
                i++;
            }
        }
    }, 2500);//end of interval
}