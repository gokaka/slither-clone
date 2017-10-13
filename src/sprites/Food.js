import Phaser from 'phaser';
import config from '../config';

export default class {

  constructor(game, x, y){
    this.game = game;
    this.debug = false;
    this.sprite = this.game.add.sprite(x, y, 'food');
    this.sprite.tint = 0xff0000;
    this.eatSound = this.game.add.audio('eat');

    this.game.physics.p2.enable(this.sprite, this.debug);
    this.sprite.body.clearShapes();
    this.sprite.body.addCircle(this.sprite.width * 0.5);

    // set callback for when sth hits the food
    this.sprite.body.onBeginContact.add(this.onBeginContact, this);

    this.sprite.food = this;
    this.head = null;
    this.constraint = null;
  }

  onBeginContact(phaserBody, p2Body) {
    if(phaserBody && phaserBody.sprite.name == "head" && this.constraint == null) {
      this.sprite.body.collides([]);

      // create constraint between food and snake head that
      // it collided with. The food is then brought to the center of
      // the head sprite
      this.constraint = this.game.physics.p2.createRevoluteConstraint(
        this.sprite.body, [0,0], phaserBody, [0,0]
      );
      this.head = phaserBody.sprite;
      this.head.snake.food.push(this);
    }
  }

  update () {
    //once the food reaches the center of the snake head, destroy it and
    //increment the size of the snake
    if (this.head && Math.round(this.head.body.x) == Math.round(this.sprite.body.x) &&
    Math.round(this.head.body.y) == Math.round(this.sprite.body.y)) {
        this.head.snake.incrementSize();
        this.destroy();
    }
  }

  destroy () {
    if (this.head) {
      this.game.physics.p2.removeConstraint(this.constraint);
      this.sprite.destroy();
      this.head.snake.food.splice(this.head.snake.food.indexOf(this), 1);
      this.head = null;

      this.eatSound.play();
    }
  }

}