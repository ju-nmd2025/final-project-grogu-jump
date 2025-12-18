/* Parts of this game were developed with guidance from ChatGPT, 
used as a learning and support tool.
https://chatgpt.com/share/69432188-1bf4-8001-b18d-d86f43c11c75 */

import Player from "./player.js";
import Platform from "./platform.js";

let player, groundY;
let groguImg, planetImg, successImg, sadGroguImg, failBackgroundImg;
let platforms = [], snowflakes = [];
let score = 50;
let gameState = "start";
let hoverOffset = 0;

// preload assets
function preload() {
  groguImg = loadImage("assets/grogu.png");
  planetImg = loadImage("assets/planet.png");
  sadGroguImg = loadImage("assets/sad-grogu.png");
  successImg = loadImage("assets/success-grogu.png");
  failBackgroundImg = loadImage("assets/fail-bg.png")
}

// setup canvas and initial objects
function setup() {
  createCanvas(900, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont("Georgia");

  groundY = height - 100;
  player = new Player(width / 2 - 25, groundY - 50);
  initPlatforms();
}

// initialize platforms
function initPlatforms() {
  platforms = [];
  for (let i = 0; i < 10; i++) {
    let x = random(width - 100);
    let y = height - 180 - i * 80;

    let type;
    let r = random(1);
    if (r < 0.6) type = "static"; // 60% static
    else if (r < 0.85) type ="moving"; // 85% moveable
    else type = "breakable"; // 15% breakable

    platforms.push(new Platform(x, y, type));
  }
}

// --- draw gradient function ---
function drawVerticalGradient(topColor, bottomColor) {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// --- draw falling snow ---
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

// --- main draw loop ---
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
  rect(0, height - 100, width, 100);  // ground

  image(groguImg, width / 2, height - 140, 100, 100); // Grogu

  // start screen text
  stroke(10);
  fill(0, 100, 0);
  textSize(100);
  text("Grogu Jump", width / 2, 150); // game title
  textSize(25);
  text("help little lost Grogu get back Home to his planet", width / 2, 250); // game description
  text("use LEFT / RIGHT arrows to move", width / 2, 500); // controls

  // pulsating start text
  let pulse = 1 + 0.05 * sin(frameCount * 0.05);
  push();
  translate(width / 2, 600);
  scale(pulse);
  textSize(50);
  text("press SPACE to start", 0, 0);
  pop();
}

// ========== GAME SCREEN ==========
function drawGameScreen() {
  drawVerticalGradient(color(180, 220, 255), color(120, 200, 255));
  drawSnow();

  // update & draw platforms
  for (let plat of platforms) plat.update();
  fill(255); rect(0, groundY, width, 100); // ground
  for (let plat of platforms) plat.draw();

  // --- update & draw player ---
  let result = player.update(platforms, groundY);
  groundY = result.groundY;
  if (result.scored) score = max(0, score - 1);
  player.draw(groguImg);

  // --- score display ---
  stroke(0); fill(0,100,0); textSize(30); textAlign(LEFT, TOP);
  text("Miles Left: " + score, 40, 40);

  // game over & success
  if (player.y > height) gameState = "gameover";
  if (score <= 0) gameState = "success";

  // recycle platforms
  for (let plat of platforms) {
    if (plat.y > height) {
      plat.y = -plat.height;
      plat.x = random(width - plat.width);
      plat.broken = false;
      plat.scored = false;
    }
  }
}

// ========== GAME OVER SCREEN ==========
function drawGameOverScreen() {
  image(failBackgroundImg, width / 2, height / 2, width, height);
  image(sadGroguImg, width / 2, height - 50, 200, 200);

  fill(255); textAlign(CENTER, TOP);
  textSize(80); text("OH NO...", width/2, height/2 - 300);
  textSize(30); text("You failed to get little Grogu home! :(", width/2, height/2 - 180);
  
  // pulsating retry text
  let pulse = 1 + 0.05 * sin(frameCount * 0.05);
  push();
  translate(width / 2, 600);
  scale(pulse);
  textSize(50);
  text("press R to retry", 0, 0);
  pop();
}

// ========== GAME SUCCESS SCREEN ==========
function drawGameSuccessScreen() {
  image(planetImg, width / 2, height / 2, width, height);

  hoverOffset += 0.025;
  let hoverX = sin(hoverOffset) * 20;
  let hoverY = sin(hoverOffset * 0.8) * 8;
  image(successImg, width/2 + hoverX, height/2 + hoverY, 250, 250);

  noStroke(); fill(0,100,0);
  textSize(100); textAlign(CENTER, TOP);
  text("CONGRATS!", width/2, height/2 - 400);

  textSize(30); fill(0);
  text("little Grogu made it home!", width/2, height/2 - 280);

  // pulsating replay text
  let pulse = 1 + 0.05 * sin(frameCount * 0.05);
  push();
  translate(width/2, height - 200);
  scale(pulse);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("press R to play again", 0, 0);
  pop();
}

// ========== INPUT HANDLING ==========
function keyPressed() {
  if (key === " " && gameState === "start") {
    gameState = "play";
    player.vy = -12; // initial jump
  }

  if ((key === "r" || key === "R") && (gameState === "gameover" || gameState === "success")) {
    resetGame();
  }
}

// reset game state
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