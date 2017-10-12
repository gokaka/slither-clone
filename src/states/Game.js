/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';
import Snake from '../sprites/Snake';
import PlayerSnake from '../sprites/PlayerSnake';
import BotSnake from '../sprites/BotSnake';

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    var width = this.game.width;
    var height = this.game.height;

    this.game.world.setBounds(-width, -height, width*2, height*2);
    this.game.stage.backgroundColor = '#444';

    // add background
    var background = this.game.add.tileSprite(-width, -height, 
      this.game.world.width, this.game.world.height, 'background');

    // init physics & groups
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.game.snakes = [];

    // create player
    var snake = new PlayerSnake(this.game, 'circle', 0, 0);
    this.game.camera.follow(snake.head);


    //create bots
    new BotSnake(this.game, 'blue-circle', -200, 0);
    new BotSnake(this.game, 'blue-circle', 200, 0);

    // this.mushroom = new Mushroom({
    //   game: this.game,
    //   x: this.world.centerX,
    //   y: this.world.centerY,
    //   asset: 'mushroom'
    // })

    // this.game.add.existing(this.mushroom)

  }

  update () {
    // update game components
    for(var i=this.game.snakes.length-1; i>=0; i--){
      this.game.snakes[i].update();
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
