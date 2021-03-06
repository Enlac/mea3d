// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Vector2 = function(x,y) {
  this.x = x? x:0;
  this.y = y? y:0;
}
mea3D.Vector2.prototype = {
  toString:function() {
    return "(" + this.x.toFixed(3) + "," + this.y.toFixed(3) + ")";
  },
  scale:function(d) {
    return new mea3D.Vector2(this.x*d, this.y*d);
  },
  add:function(v) {
    return new mea3D.Vector2(this.x + v.x, this.y + v.y);
  },
  subt:function(v) {
    return new mea3D.Vector2(this.x - v.x, this.y - v.y);
  },
  dot:function(v) {
    return this.x*v.x + this.y*v.y;
  },
  mag:function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
};

// 3D Vectors
/**
* @constructor
* @param {number=} x
* @param {number=} y
* @param {number=} z
* @param {number=} w
*/
mea3D.Vector3 = function(x,y,z, w) {
  this.x = (x) ? x:0;
  this.y = (y) ? y:0;
  this.z = (z) ? z:0;
  this.w = (w) ? w:1.0; // homogenous coordinates
  
}

mea3D.Vector3.prototype = {
  toString:function() {
    return "(" + this.x.toFixed(3) + "," + 
    this.y.toFixed(3) + "," + 
    this.z.toFixed(3) + ",w:" + 
    this.w.toFixed(3) + ")";
  },
  equals:function(vec3) {
    var threshold = 0.0001;
    if (Math.abs(this.x-vec3.x)>threshold || 
        Math.abs(this.y-vec3.y)>threshold ||
        Math.abs(this.z-vec3.z)>threshold ||
        Math.abs(this.w-vec3.w)>threshold)
        return false;
    return true;
  },
  copy:function() {
    return new mea3D.Vector3(this.x, this.y, this.z, this.w);
  },
  
  scale:function(s) {
    return new mea3D.Vector3(this.x*s, this.y*s, this.z*s);
  },
  scale3:function(sx,sy,sz) {
    return new mea3D.Vector3(this.x*sx, this.y*sy, this.z*sz);
  },
  add:function(v) {
    return new mea3D.Vector3(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z);
  },
  subt:function(v) {
    return new mea3D.Vector3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z);
  },
  mag:function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  },
  // Square of magnitude. 
  mag2:function() {
    return this.x*this.x + this.y*this.y + this.z*this.z;
  },
  norm:function() {
    var thisMag = this.mag();
    return this.scale(1/thisMag);
  },
  dot:function(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
  },
  cross:function(v) {
    return new mea3D.Vector3(
                        this.y*v.z - this.z*v.y,
                        this.z*v.x - this.x*v.z,
                        this.x*v.y - this.y*v.x);
  },
  set:function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
};
