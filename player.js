export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.speed = 8;
    this.width = 50;
    this.height = 50;
    this.gravity = 0.6;
    this.allowJump = false;
  }

  update(platforms, groundY) {
    this.vy += this.gravity;
    this.y += this.vy;
    
    let landed = false;
    let scored = false;

    // collision with plattforms
    for (let plat of platforms) {
      if (this.vy >= 0 && plat.isPlayerOn(this.x, this.y, this.width, this.height)) {
        landed = true;
        this.y = plat.y - this.height;
        this.vy = 0;
        this.onPlatform = true;

       if (!plat.scored) {
          scored = true;
          plat.scored = true;
       }

       if (plat.type === "breakable" && !plat.broken) {
          plat.broken = true;
        }
        break;
      }
    }

   // collision with ground
  if (!landed && this.y >= groundY - this.height) {
        landed = true;
        this.y = groundY - this.height;
        this.vy = 0;
    }

  // automatic jump
  if (landed) {
    this.vy = -16;
  }

  // scrolling
    let scrollLimit = height / 2;
    if (this.y < scrollLimit) {
      let diff = scrollLimit - this.y;
      this.y = scrollLimit;
      for (let plat of platforms) {
        plat.y += diff;
      }
      groundY += diff; // ground moves up with scroll
    }
    
    // horizontal movement
    this.move();

    // return updated groundY
    return { groundY, scored };
}

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (this.x > width) this.x = -this.width;
    if (this.x + this.width < 0) this.x = width;
  }

  draw(img) {
    image(img, this.x + this.width / 2, this.y + this.height / 2, 100, 100);
  }
}
