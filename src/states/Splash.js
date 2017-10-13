import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png');

    this.load.image('circle', 'assets/images/circle.png');
    this.load.image('blue-circle', 'assets/images/blue-circle.png');
    this.load.image('eye-white', 'assets/images/eye-white.png');
    this.load.image('eye-black', 'assets/images/eye-black.png');
    this.load.image('food', 'assets/images/food.png');
    this.load.image('background', 'assets/images/tile.png');

    this.load.audio('eat', 'assets/audio/eat.mp3');
  }

  create () {
    this.state.start('Game')
  }
}
