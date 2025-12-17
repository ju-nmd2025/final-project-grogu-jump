export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.speed = 5;
    this.width = 50;
    this.height = 50;
  }

  update(platforms, groundY) {
    this.vy += 0.4; // gravity
    this.y += this.vy;

    let landed = false;
    // let groundY = height - 140; // top of ground

    // collision with plattforms
    for (let plat of platforms) {
      if (
        this.vy >= 0 &&
        this.y + this.height >= plat.y &&
        this.y + this.height <= plat.y + 5 &&
        this.x + this.width > plat.x &&
        this.x < plat.x + plat.width
      ) {
        landed = true;
        this.y = plat.y - this.height; // place player on platform
      }
    }

    // collision with ground
    if (this.y >= groundY) {
      landed = true;
      this.y = groundY;
    }

    // automatic jump when landed
    if (landed && this.vy >= 0) {
      this.vy = -13;
    }

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
    return groundY;
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
