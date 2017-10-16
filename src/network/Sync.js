import * as firebase from 'firebase'

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

  loadData(uid){
    try{
      var rootRef = firebase.database().ref(`snake/${uid}`);
      rootRef.on('value', (snapshot) => {
        var pos = snapshot.val();
        console.log(snapshot.val());
        this.game.playerSnake.worldX = pos.x;
        this.game.playerSnake.worldY = pos.y;
      });
    } catch(ex){
      console.log(ex);
    } 
  }

  updatePos(x, y){
    var posData = {
      x: x, 
      y: y
    };
    if(this.uid){
      var key = `snake/${this.uid}`;
      // console.log(key);
    }
    firebase.database().ref(key).update(posData);
    
  }
}