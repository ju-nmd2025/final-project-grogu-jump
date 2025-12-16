class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 10;
  }

  show() {
    fill(100, 200, 100); // green color
    rect(this.x, this.y, this.w, this.h); // draw platform
  }
}
