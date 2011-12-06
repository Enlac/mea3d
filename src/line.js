// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Line3 = function(v1, v2) {
  this.v1 = v1;
  this.v2 = v2;
}

mea3D.Line3.prototype = {
  toString:function() {
    return this.v1.toString() + "," + this.v2.toString();
  },
  length:function() {
    var dX = this.v1.x-this.v2.x;
    var dY = this.v1.y-this.v2.y;
    var dZ = this.v1.z-this.v2.z;
    return Math.sqrt(dX*dX + dY*dY + dZ*dZ);
  },
  direction:function() {
    return this.v2.subt(this.v1).norm();
  }
};
