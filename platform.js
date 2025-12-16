export default class Platform {
  constructor(x, y, w = 100, h = 20) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  // draw platform on canvas
  draw() {
    fill(140, 70, 20);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 5);
    fill(255);
    ellipse(this.x + this.width / 2, this.y, this.width * 0.9, 10);
  }

  // check collision with player
  checkCollision(character) {
    // check if character is falling onto the platform
    if (
      character.y + character.height >= this.y &&
      character.y + character.height <= this.y + 5 &&
      character.x + character.width > this.x &&
      character.x < this.x + this.width
    ) {
      return true; // landed on platform
    }
    return false;
  }
}
