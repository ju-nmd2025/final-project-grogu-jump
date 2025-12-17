import Player from "./player.js";
import Platform from "./platform.js";

let player;
let groundY;
let groguImg;
let platforms = [];
let snowflakes = [];
let gameOver = false;
let gameStarted = false;

// preload assets
function preload() {
  // load Grogu image
  groguImg = loadImage("assets/grogu.png");
}

// setup canvas and initial game objects
function setup() {
  createCanvas(600, 800);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  groundY = height - 100;

  // initialize player at the top of the ground
  player = new Player(width / 2 - 25, height - 140);

  // create platforms + array
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

// main draw loop
function draw() {
  if (gameOver) {
    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      let c = lerpColor(color(220), color(255), inter);
      stroke(c);
      line(0, y, width, y);
    }

    // game over + retry text
    stroke(0);
    strokeWeight(3);
    fill(255, 0, 0);
    textSize(100);
    text("OH NO...", width / 2, height / 2 - 200);
    textSize(30);
    text("you failed to get little Grogu home! :(", width / 2, height / 2 - 50);
    textSize(30);
    text("Press R to retry", width / 2, height / 2 + 100);

    noLoop();
    return;
  }

  // draw gradient sky background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(173, 216, 230), inter); // dark blue to light blue
    stroke(c);
    line(0, y, width, y);
  }

  // generate and draw falling snowflakes
  if (random(1) < 0.1 && snowflakes.length < 200) {
    snowflakes.push({ x: random(width), y: 0, size: random(2,6), speed: random(1,3) });
  }
  for (let flake of snowflakes) {
    fill(255);
    noStroke();
    ellipse(flake.x, flake.y, flake.size);
    flake.y += flake.speed;

    // reset snowflake if it falls below canvas
    if (flake.y > height) {
      flake.y = 0;
      flake.x = random(width);
    }
  }

  // start screen before the game begins
  if (!gameStarted) {
    fill(255);
    noStroke();
    rect(0, height - 100, width, 100); // draw ground

    image(groguImg, width / 2, height - 140, 100, 100); // draw Grogu on ground

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

    return; // skip the game loop
  }

  // draw ground and platforms
  fill(255);
  noStroke();
  rect(0, groundY, width, 100);

  // draw platforms
  for (let plat of platforms) {
    plat.update();
    plat.draw();
  }

  // update and draw player
  groundY = player.update(platforms, groundY);
  player.draw(groguImg);

  if (player.y > height) {
    gameOver = true;
  }

  // reuse platforms when scrolling up
  for (let plat of platforms) {
    if (plat.y > height) {
      plat.y = -plat.height; // move upwards above screen
      plat.x = random(width - plat.width); // randomize x

      if (plat.type === "breakable") {
        plat.height = 20;
        plat.broken = false;
      }
    }
  }
}

// handle key input
function keyPressed() {
  if (key === " " && !gameStarted) {
    gameStarted = true;
    player.vy = -12; // first jump
  }

  if (gameOver && (key === "r" || key === "R")) {
    resetGame();
  }
}

function resetGame() {
  gameOver = false;
  gameStarted = true;
  groundY = height - 100;

  // draw player again and start jumping
  player = new Player(width / 2 - 25, height - 140);
  player.vy = -12;

  // create new platforms
  platforms = [];
  for (let i = 0; i < 10; i++) {
    let x = random(width - 100);
    let y = height - 180 - i * 80;

    let type;
    let r = random(1);
    if (r < 0.6) type = "static";
    else if (r < 0.85) type = "moving";
    else type = "breakable";

    platforms.push(new Platform(x, y, type));
  }

  snowflakes = [];
  loop();
}

// bind p5 callbacks
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
