import Phaser from 'phaser';
import Snake from './Snake';
import { Util } from "../utils";

export default class extends Snake {
  constructor (game, spriteKey, x, y) {
    super(game, x, y, spriteKey);
    this.trend = 1;
  }

  update() {
    this.head.body.setZeroRotation();

    //ensure that the bot keeps rotating in one direction for a
    //substantial amount of time before switching directions
    if (Util.randomInt(1,20) == 1) {
        this.trend *= -1;
    }
    this.head.body.rotateRight(this.trend * this.rotationSpeed);
    super.update();
  }

}
