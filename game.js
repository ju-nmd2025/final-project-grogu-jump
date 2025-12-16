let groguImg;
let snowflakes = [];

function preload() {
  // Load Grogu image
  groguImg = loadImage("assets/start-screen-grogu.png");
}

function setup() {
  createCanvas(600, 800);
  imageMode(CENTER); // Draw images from the center
  textAlign(CENTER, CENTER); // Center text horizontally and vertically
}

function draw() {
  // Draw background first
  drawBackground();

  // Draw snowy ground
  fill(255);
  noStroke();
  let groundHeight = 100;
  rect(0, height - groundHeight, width, groundHeight);

  // Add small snow mounds
  for (let i = 0; i < width; i += 50) {
    ellipse(i + 25, height - groundHeight + 10, 60, 20);
  }

  // Create new snowflake randomly
  if (random(1) < 0.1) { // 10% chance per frame
    snowflakes.push({x: random(width), y: 0, size: random(2, 6), speed: random(1, 3)});
  }

  // Draw and move snowflakes
  for (let flake of snowflakes) {
    fill(255);
    noStroke();
    ellipse(flake.x, flake.y, flake.size);
    flake.y += flake.speed; // Fall down

    // Reset if off screen
    if (flake.y > height) {
      flake.y = 0;
      flake.x = random(width);
    }
  }

  // Draw Grogu
  image(groguImg, width / 2, height - groundHeight - 40, 100, 100);

  // Draw game title
  textSize(50);
  fill(0, 100, 0);
  text("Grogu Jump", width / 2, 150);

  // Draw game description
  textSize(20);
  fill(0, 100, 0);
  text("Help little Grogu get back to his Home planet!", width / 2, 200);

  // Draw start button text with pulse effect
  let pulse = 1 + 0.05 * sin(frameCount * 0.1);
  textSize(25);
  fill(0, 100, 0);
  push();
  translate(width / 2, 400);
  scale(pulse); 
  text("Press Space to Start", 0, 0);
  pop();
}

function drawBackground() {
  // Vertical gradient background
  noStroke(); // Important to prevent stroke affecting other shapes
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(255, 255, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
}
