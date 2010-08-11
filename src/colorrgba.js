// Author: Mustafa Acer

/**
* @constructor
*/
function ColorRGBA(red, green, blue, alpha) {
  this.r = red;
  this.g = green;
  this.b = blue;
  
  this.a = (typeof alpha=="undefined") ? 1.0 : alpha;
}

// Static method
ColorRGBA.createFromValues = function(array) {
  return new ColorRGBA(array[0], array[1], array[2], array[3]);
};

ColorRGBA.prototype = {

  // TODO: Make the color values integer. Float may not be good.
  toString:function() {
    return "rgb(" + 
      Math.floor(255*this.r) + "," + 
      Math.floor(255*this.g) + "," + 
      Math.floor(255*this.b) + ")";
  },
  
  equals:function(c) {  
    // TODO: Should we use triple equal signs?
    return this.r==c.r && this.g==c.g && this.b==c.b; // ignore alpha
  },
  
  copy:function() {
    return new ColorRGBA(this.r, this.g, this.b, this.a);
  },
  
  scale:function(scaleR, scaleG, scaleB){
    return new ColorRGBA(
      this.r*scaleR,
      this.g*scaleG,
      this.b*scaleB
      );
  },
  
  addColor:function(color) {
    return new ColorRGBA(
      this.r + color.r,
      this.g + color.g,
      this.b + color.b,
      this.a + color.a);
  },
  
  add:function(r,g,b,a) {
    return new ColorRGBA(
      this.r + r,
      this.g + g,
      this.b + b,
      this.a + a);
  },
  
  divide:function(denominator) {
    if (denominator==0) return null;
    return new ColorRGBA(
      this.r/denominator,
      this.g/denominator,
      this.b/denominator,
      this.a/denominator);
  }
};

// Export Vector3 object to make closure compiler happy:
if (!window["ColorRGBA"]) window["ColorRGBA"] = ColorRGBA;
//if (!mea3D["Vector3"]) mea3D["Vector3"] = mea3D.Color;
