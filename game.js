import Player from "./player.js";
import Platform from "./platform.js";

let player;
let groundY;
let groguImg;
let planetImg;
let successImg;
let platforms = [];
let snowflakes = [];
let score = 50;
let gameState = "start";
let hoverOffset = 0;

// preload assets
function preload() {
  groguImg = loadImage("assets/grogu.png");
  planetImg = loadImage("assets/planet.png");
  successImg = loadImage("assets/success-grogu.png");
}

// setup canvas and initial game objects
function setup() {
  createCanvas(900, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Georgia");

  groundY = height - 100;
  player = new Player(width / 2 - 25, groundY - 50);

  initPlatforms();
}

function initPlatforms() {
  platforms = [];
  for (let i = 0; i < 10; i++) {
    let x = random(width - 100);
    let y = height - 180 - i * 80; // platforms spaced upward

    let type;
    let r = random(1);
    if (r < 0.6) type = "static"; // 60% static
    else if (r < 0.85) type ="moving"; // 85% moveable
    else type = "breakable"; // 15% breakable

    platforms.push(new Platform(x, y, type));
  }
}

// --- gradient function ---
function drawVerticalGradient(topColor, bottomColor) {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawSnow() {
  if (random(1) < 0.1 && snowflakes.length < 200) {
    snowflakes.push({ x: random(width), y: 0, size: random(2,6), speed: random(1,3) });
  }
  for (let flake of snowflakes) {
    fill(255);
    noStroke();
    ellipse(flake.x, flake.y, flake.size);
    flake.y += flake.speed;
    
    if (flake.y > height) {
      flake.y = 0;
      flake.x = random(width);
    }
  }
}

function draw() {
  switch(gameState) {
    case "start":
      drawStartScreen();
      break;
    case "play":
      drawGameScreen();
      break;
    case "gameover":
      drawGameOverScreen();
      break;
    case "success":
      drawGameSuccessScreen();
      break;
  }
}

// ========== START SCREEN ==========
function drawStartScreen() {
  drawVerticalGradient(color(180, 220, 255), color(120, 200, 255));
  drawSnow();
  
  fill(255);
  noStroke();
  rect(0, height - 100, width, 100);

  image(groguImg, width / 2, height - 140, 100, 100);

  fill(0, 100, 0);
  textSize(50);
  text("Grogu Jump", width / 2, 150); // game title
  textSize(25);
  text("Help little Grogu get back Home to his planet", width / 2, 220); // game description
  text("Use LEFT / RIGHT arrows to move", width / 2, 350); // controls

   // pulsating start text
  let pulse = 1 + 0.05 * sin(frameCount * 0.1);
  push();
  translate(width / 2, 400);
  scale(pulse);
  textSize(25);
  text("Press SPACE to start", 0, 0);
  pop();
}

// ========== GAME SCREEN ==========
function drawGameScreen() {
  drawVerticalGradient(color(180, 220, 255), color(120, 200, 255));
  drawSnow();

  // --- update platforms ---
  for (let plat of platforms) {
    plat.update();
  }
  
  // --- draw ground ---
  fill(255);
  noStroke();
  rect(0, groundY, width, 100);

  // --- draw platforms ---
  for (let plat of platforms) {
    plat.draw();
  }

  // --- update & draw player ---
  let result = player.update(platforms, groundY);
  groundY = result.groundY;
  if (result.scored) score = max(0, score - 1);
  player.draw(groguImg);

  // --- score ---
  fill(0, 100, 0);
  textSize(30);
  textAlign(LEFT, TOP);
  text("Miles Left: " + score, 20, 20);

  // game over & success
  if (player.y > height) gameState = "gameover";
  if (score <= 0) gameState = "success";

  // recycle platforms
  for (let plat of platforms) {
    if (plat.y > height) {
      plat.y = -plat.height;
      plat.x = random(width - plat.width);
      plat.broken = false;
      plat.scored = false; // återställ flagga för ny poäng
    }
  }
}


// ========== GAME OVER SCREEN ==========
function drawGameOverScreen() {
  drawVerticalGradient(color(220), color(120));

  // --- text ---
  fill(0);
  textAlign(CENTER, TOP);
  textSize(80);
  text("OH NO...", width/2, height/2 - 150);

  fill(0);
  textSize(30);
  text("You failed to get little Grogu home! :(", width/2, height/2);
  text("Press R to retry", width/2, height/2 + 60);
}

// ========== GAME SUCCESS SCREEN ==========
function drawGameSuccessScreen() {

  image(planetImg, width / 2, height / 2, width, height);

  hoverOffset += 0.025;

  let hoverX = sin(hoverOffset) * 20;
  let hoverY = sin(hoverOffset * 0.8) * 8;

  image(
    successImg,
    width / 2 + hoverX,
    height / 2 + hoverY,
    250,
    250
  );


  fill(0, 150, 0);
  textSize(80);
  textAlign(CENTER, TOP);
  text("CONGRATS!", width / 2, height / 2 - 400);

  fill(0);
  textSize(30);
  text("Little Grogu made it home!", width / 2, height / 2 - 300);
  text("Press R to play again", width / 2, height / 2 + 300);
}

// ========== INPUT HANDLING ==========
function keyPressed() {
  if (key === " " && gameState === "start") {
    gameState = "play";
    player.vy = -12; // first jump
  }

  if ((key === "r" || key === "R") && (gameState === "gameover" || gameState === "success")) {
    resetGame();
  }
}

function resetGame() {
  gameState = "play";
  groundY = height - 100;
  score = 50;
  initPlatforms();
  player = new Player(width / 2 - 25, height - 50);
  player.vy = -12;
  snowflakes = [];
}

// bind p5 callbacks
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
