export default class {
  constructor(game, sections, scale) {
    this.game = game;
    this.sections = sections;
    this.scale = scale;
    this.shadowGroup = this.game.add.group();
    this.shadows = [];
    this.isLightingUp = false;

    this.lightStep = 0;
    this.maxLightStep = 3;

    this.lightUpdateCount = 0;
    this.updateLights = 3;

    //various tints that the shadow could have
    //since the image is white
    this.darkTint = 0xaaaaaa;
    this.lightTintBright = 0xaa3333;
    this.lightTintDim = 0xdd3333;
  }

  add(x, y){
    var shadow = this.game.add.sprite(x, y, 'shadow');
    shadow.scale.setTo(this.scale);
    shadow.anchor.set(0.5);
    this.shadowGroup.add(shadow);
    this.shadows.push(shadow);
  }

  update () {
    var lastPos = null;
    for(var i=0; i<this.sections.length; i++){
      var shadow = this.shadows[i];
      var pos = {
        x: this.sections[i].body.x,
        y: this.sections[i].body.y
      };

      // hide shadow if the prev shadow is in the same pos
      if(lastPos && pos.x == lastPos.x && pos.y == lastPos.y){
        shadow.alpha = 0;
        shadow.naturalAlpha = 0;
      }
      else {
        shadow.alpha = 1;
        shadow.naturalAlpha = 1;
      }

      // place each shadow below snake section
      shadow.position.x = pos.x;
      shadow.position.y = pos.y;
      lastPos = pos;
    }

    // light up shadow with bright tints
    if(this.isLightingUp) {
      this.lightUpdateCount ++;
      if(this.lightUpdateCount >= this.updateLights){
        this.lightUp();
      }
    }
    // make shadow dark
    else {
      for(var i=0; i<this.shadows.length; i++){
        var shadow = this.shadows[i];
        shadow.tint = this.darkTint;
      }
    }
    
  }

  lightUp () {
    this.lightUpdateCount = 0;
    for(var i=0; i<this.shadows.length; i++){
      var shadow = this.shadows[i];
      if(shadow.naturalAlpha > 0){
        // create an alternating effect so shadow is not uniform
        if((i-this.lightStep) % this.maxLightStep === 0) {
          shadow.tint = this.lightTintBright;
        }
        else {
          shadow.tint = this.lightTintDim;
        }
      }
    }

    // use a counter to decide how to alternate shadow tints
    this.lightStep ++;
    if(this.lightStep == this.maxLightStep) {
      this.lightStep = 0;
    }
  }

  setScale(scale){
    this.scale = scale;
    for(var i=0; i<this.shadows.length; i++) {
      this.shadows[i].scale.setTo(scale);
    }
  }

  destroy () {
    for(var i= this.shadows.length-1; i>=0; i--) {
      this.shadows[i].destroy();
    }
  }

}