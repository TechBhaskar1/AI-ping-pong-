/*created by prashant shukla */

var paddle2 = 10,
  paddle1 = 10;

var paddle1X = 10,
  paddle1Height = 110;
var paddle2Y = 985,
  paddle2Height = 70;

var score1 = 0,
  score2 = 0;
var paddle1Y;

var playerscore = 0;
var audio1;
var pcscore = 0;

var score = "";
var game_Status = "";
//ball x and y and speedx speed y and radius
var ball = {
  x: 350 / 2,
  y: 980 / 2,
  r: 20,
  dx: 3,
  dy: 3
}

function preload() {
  paddle_touchSound = loadSound("ball_touch_paddel.wav");
  ball_missedSound = loadSound("missed.wav")
}

function setup() {
  var canvas = createCanvas(800, 950);
  canvas.parent('canvas');

  webcam = createCapture(VIDEO);
  webcam.size(780, 400);
  webcam.hide();


  poseNet = ml5.poseNet(webcam, modelLoaded);
  poseNet.on('pose', gotPoses);

}

function modelLoaded() {
  console.log("Model Loaded !!")
}

function gotPoses(results) {
  if (results.length > 0) {
    handx = results[0].pose.rightWrist.x;
    handy = results[0].pose.rightWrist.y;
    score = results[0].pose.rightWrist.confidence;
    console.log("HandY :" +handy);
  }
}

function draw() {

  strokeWeight(1);
  background("gray");

  //conputer paddle row
  fill("gray");
  stroke("gray");
  rect(780, 400, 20, 700);

  fill("gray");
  stroke("gray");
  rect(0, 400, 20, 700);

  //function midline call
  midline();

  //funtion drawScore call 
  drawScore();

  //Code for Webcam
  image(webcam, 0, 0, 800, 400);
  fill("white");
  strokeWeight(1);
  stroke("black");
  rect(0, 400, width, 7, );

  if (score > 0.2) {
    fill("red");
    stroke("red");
    circle(handx, handy, 10);
  }
  if (game_Status == "start") {
    //funtion paddleInCanvas call 
    paddleInCanvas();

    //left paddle
    fill("blue");
    stroke("blue");
    strokeWeight(0.5);
    
    rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100);


    //pc computer paddle
    fill("red");
    stroke("red");
    var paddle2y = ball.y - paddle2Height / 2;
    rect(785, paddle2y, paddle2, paddle2Height, 100);



    //function models call  
    models();

    //function move call which in very important
    move();

    
  } else {
    textSize(30);
    strokeWeight(5);
    stroke("green");
    paddle1Y = 500;
    fill("white");
    text("Press start button to start the game", 425, 800);

  }
}


//Start Game
function startGame() {
  game_Status = "start"
  document.getElementById("status").innerHTML = "Game is loaded"
}

//Restart game
function restartGame() {
  pcscore = 0;
  playerscore = 0;
  ball.x = width / 2 + 100,
    ball.y = 950 / 2 + 100;
  ball.dx = 3;
  ball.dy = 3;
  loop();
}

//function reset when ball does notcame in the contact of padde
function reset() {
  ball.x = width / 2 + 100,
    ball.y = 950 / 2 + 100;
  ball.dx = 3;
  ball.dy = 3;
  ball_missedSound.play();

}


//function midline draw a line in center
function midline() {
  for (i = 0; i < 480; i += 10) {
    var y = 400;
    fill("white");
    stroke(0);
    rect(width / 2, y, 10, 680);
  }
}


//function drawScore show scores
function drawScore() {
  textAlign(CENTER);
  textSize(144);
  strokeWeight(15);
  stroke("white");

  fill("blue");
  text("0 " + playerscore, 225, 600);
  fill("red");
  text("0 " + pcscore, 625, 600);
}


//very important function of this game
function move() {
  fill(50, 350, 0);
  stroke(255, 0, 0);
  strokeWeight(0.5);

  ellipse(ball.x, ball.y, ball.r, 20);

  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;
  if (ball.x + ball.r > width - ball.r / 2) {
    ball.dx = -ball.dx - 0.5;
    paddle_touchSound.play();
  }
  if (ball.x - 2.5 * ball.r / 2 < 0) {
    if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
      ball.dx = -ball.dx + 0.5;
      paddle_touchSound.play();
    } else {
      pcscore++;
      reset();
      navigator.vibrate(100);
    }

  }
  if (pcscore == 3) {
    fill("#FFA500");
    stroke(0)
    rect(0, 0, width, 950 - 1);
    fill("white");
    stroke("white");
    textSize(25)
    text("Game Over!☹☹", width / 2, 950 / 2);
    text("Press Restart Button to restart!", width / 2, 950 / 2 + 30)
    noLoop();
    pcscore = 0;
  }
  if (ball.y + ball.r > 950 || ball.y - ball.r < 400) {
    ball.dy = -ball.dy;
  }
}


//width height of canvas speed of ball 
function models() {
  textSize(18);
  fill(255);
  noStroke();
  text("Width:" + width, 135, 435);
  text("Speed:" + abs(ball.dx), 50, 435);
  text("Height:" + height, 235, 435)
}


//this function help to not go te paddle out of canvas
function paddleInCanvas() {
  if (handy > 200) {
    paddle1Y = paddle1Y + 4;
  }
  if (handy < 200) {
    paddle1Y = paddle1Y - 4;
  }
  if(paddle1Y < 400 ){
    paddle1Y = 400;
  }
  if(paddle1Y >950-paddle1Height ){
    paddle1Y = 950-paddle1Height;
  }
}