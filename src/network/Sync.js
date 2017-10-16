import * as firebase from 'firebase';
import PlayerSnake from '../sprites/PlayerSnake';

export default class {

  constructor(game) {
    this.game = game;
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCsF7dbV7irNDJwzn0mmbnL3PzGP4YKU4Q",
      authDomain: "slither-clone.firebaseapp.com",
      databaseURL: "https://slither-clone.firebaseio.com",
      projectId: "slither-clone",
      storageBucket: "slither-clone.appspot.com",
      messagingSenderId: "92915174017"
    };
    firebase.initializeApp(config);
    firebase.auth().signInAnonymously();
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser.uid);
        this.uid = firebaseUser.uid;
        this.loadData(this.uid);
      }
    });

    
  }

  initSnakes(uid, x, y){
    // create player
    var snake = new PlayerSnake(this.game, 'circle', x, y, uid);
    this.game.playerSnake = snake;
    if(uid == this.uid){
      this.game.camera.follow(this.game.playerSnake.head);
    }
    
    //initialize snake groups and collision
    // snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
    // snake.head.body.collides([this.foodCollisionGroup]);
    //callback for when a snake is destroyed
    // snake.addDestroyedCallback(this.snakeDestroyed, this);
  
 }

  loadData(playerId){
    try{
      var rootRef = firebase.database().ref(`snake`);
      rootRef.on('value', (snapshot) => {
        var pos = snapshot.val();

        snapshot.forEach((childSnapshot) =>{
          // console.log(childSnapshot.key, childSnapshot.val());
          var uid = childSnapshot.key;
          var pos = childSnapshot.val();
          var snake = this.game.snakes[uid];
          if(!snake){
            this.initSnakes(uid, pos.snakeX, pos.snakeY);
          }
          else {
            snake.mouseX = pos.mouseX;
            snake.mouseY = pos.mouseY;
          }
        });
        
        // no uid snake, then create new snake
        if(!this.game.snakes[playerId]){
          this.initSnakes(playerId, 0, 0);
        }

        // console.log(snapshot.val());
        // this.game.playerSnake.mouseX = pos.mouseX;
        // this.game.playerSnake.mouseY = pos.mouseY;
      });
    } catch(ex){
      console.log(ex);
    } 
  }

  updatePos(mouseX, mouseY, snakeX, snakeY){
    var posData = {
      mouseX: mouseX, 
      mouseY: mouseY,
      snakeX: snakeX,
      snakeY: snakeY
    };
    if(this.uid){
      var key = `snake/${this.uid}`;
      // console.log(key);
    }
    firebase.database().ref(key).update(posData);
    
  }
}