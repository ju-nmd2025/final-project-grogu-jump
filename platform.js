export default class Platform {
  constructor(x, y, type = "static") {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 20;
    this.type = type; // "static", "moving", "breakable"
    this.vx = type === "moving" ? random(1, 2) : 0; // speed for moving platforms
    this.broken = false;
  }

  update() {
    // moving platforms
   if (this.type === "moving") {
     this.x += this.vx;
     if (this.x <= 0 || this.x + this.width >= 600) this.vx *= -1;
}

// if breakable platform has been stepped on
  if (this.type === "breakable" && this.broken) {
    if (this.height > 0) {
      this.height -= 1;
      this.y += 1;
    } else {
      this.height = 0;
      return;
    }
  }
}

  // draw platform on canvas
  draw() {
    if (this.height <= 0) return;

    // colors depending on platform type
    if (this.type === "static") fill(35, 140, 35);
    else if (this.type === "moving") fill(140, 70, 20);
    else if (this.type === "breakable") fill(170, 170, 170);
    
    noStroke();
    rect(this.x, this.y, this.width, this.height, 5);

    // snow on top of platforms
    if (this.type !== "breakable" || !this.broken) {
    fill(255);
    ellipse(
      this.x + this.width / 2, 
      this.y, 
      this.width * random(0.85, 0.95), 
      random(8, 12)
    );
  }
}

  // check if player lands on platform
  isPlayerOn(playerX, playerY, playerW, playerH) {
    if (this.height <= 0) return false; // ignore broken platform
    return (
      playerX + playerW > this.x &&
      playerX < this.x + this.width &&
      playerY + playerH >= this.y &&
      playerY + playerH <= this.y + this.height + 10
    );
  }

  // check collision with player (optional, kan tas bort om du använder isPlayerOn)
  checkCollision(character) {
    if (
      character.y + character.height >= this.y &&
      character.y + character.height <= this.y + 5 &&
      character.x + character.width > this.x &&
      character.x < this.x + this.width
    ) {
      return true;
    }
    return false;
  }
}
