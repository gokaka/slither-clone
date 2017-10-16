/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';
import Snake from '../sprites/Snake';
import PlayerSnake from '../sprites/PlayerSnake';
import BotSnake from '../sprites/BotSnake';
import Food from '../sprites/Food';
import {Util} from '../utils';
import config from '../config';
import Sync from '../network/Sync';

export default class extends Phaser.State {
  init () {
    this.game.desiredFps = 30;
    this.game.sound.mute = config.muteSound;
    this.sync = new Sync();
  }
  preload () {
    // this.sync.loadData();
  }

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
    this.foodGroup = this.game.add.group();
    this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();
    
    //add food randomly
    for (var i = 0 ; i < 100 ; i++) {
        this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
    }

    this.game.snakes = [];

    // create player
    var snake = new PlayerSnake(this.game, 'circle', 0, 0);
    this.game.camera.follow(snake.head);


    //create bots
    // new BotSnake(this.game, 'blue-circle', -200, 0);
    // new BotSnake(this.game, 'blue-circle', 200, 0);


    //initialize snake groups and collision
    for (var i = 0 ; i < this.game.snakes.length ; i++) {
      var snake = this.game.snakes[i];
      snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
      snake.head.body.collides([this.foodCollisionGroup]);
      //callback for when a snake is destroyed
      snake.addDestroyedCallback(this.snakeDestroyed, this);
    }

  }

  initFood(x, y) {
    var f = new Food(this.game, x, y);
    f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
    this.foodGroup.add(f.sprite);
    f.sprite.body.collides([this.snakeHeadCollisionGroup]);
    return f;
  }

  snakeDestroyed(snake) {
    //place food where snake was destroyed
    for (var i = 0 ; i < snake.headPath.length ;
    i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
      this.initFood(
        snake.headPath[i].x + Util.randomInt(-10,10),
        snake.headPath[i].y + Util.randomInt(-10,10)
      );
    }
  }

  update () {
    // update game components
    for(var i=this.game.snakes.length-1; i>=0; i--){
      this.game.snakes[i].update();
    }

    for (var i = this.foodGroup.children.length - 1 ; i >= 0 ; i--) {
      var f = this.foodGroup.children[i];
      f.food.update();
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
      this.game.debug.inputInfo(32, 32);
    }
  }
}
