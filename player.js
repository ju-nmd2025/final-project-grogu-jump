class Player {
  constructor() {
    this.x = 200;
    this.y = 500;
    this.size = 30;
  }

  update() {
    // placeholder for movement
  }

  show() {
    fill(0); // black color
    ellipse(this.x, this.y, this.size); // draw player
  }
}
