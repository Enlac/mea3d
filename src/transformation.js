// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.Transformation = function(position, scaling, rotation) {
  this.position = position ? position : new mea3D.Vector3(0,0,0);
  this.rotation = rotation ? rotation : new mea3D.Vector3(0,0,0);
  this.scaling  = scaling  ? scaling  : new mea3D.Vector3(1,1,1);
  this.update();
}

mea3D.Transformation.prototype = {
  toString:function() {
    return  "position: " + this.position.toString() +
            "rotation: " + this.rotation.toString() +
            "scaling : " + this.scaling.toString();
  },
 
  copy:function() {
    var trans = new mea3D.Transformation(
      this.position.copy(),
      this.scaling.copy(),
      this.rotation.copy()
    );
    trans.update();
    return trans;
  },
  
  update:function() {   
    this.scaleMatrix = mea3D.Math.getScaleMatrix4(
      this.scaling.x, this.scaling.y, this.scaling.z
    );
    this.rotationMatrix = mea3D.Math.getRotationMatrix4(
      this.rotation.x, this.rotation.y, this.rotation.z
    );
    this.translationMatrix = mea3D.Math.getTranslationMatrix4(
      this.position.x, this.position.y, this.position.z
    );
    this.matrix = mea3D.Math.getTransformationMatrix4(
      this.scaling, this.rotation, this.position
    );
  },
  
  combine:function(childTransformation) {
    var trans = new mea3D.Transformation();
    trans.position = this.position.add(childTransformation.position);
    trans.rotation = this.rotation.copy(); //.add(childTransformation.rotation);
    // TODO: Add a "scale by vector" function to Vector3 class to encapsulate this:
    trans.scaling.x = this.scaling.x * childTransformation.scaling.x;
    trans.scaling.y = this.scaling.y * childTransformation.scaling.y;
    trans.scaling.z = this.scaling.z * childTransformation.scaling.z;
    trans.update();
    return trans;
  },
  
  moveTo:function(x,y,z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.update();
  },
  
  move:function(deltaX,deltaY,deltaZ) {
    this.position.x += deltaX;
    this.position.y += deltaY;
    this.position.z += deltaZ;
    this.update();
  },
  rotate:function(angleX, angleY, angleZ) {
    this.rotation.x += angleX;
    this.rotation.y += angleY;
    this.rotation.z += angleZ;
    this.update();
  },
  scale:function(s) {
    this.scaling.x = s;
    this.scaling.y = s;
    this.scaling.z = s;
    this.update();
  },
  scale3:function(sx, sy, sz) {
    this.scaling.x = sx;
    this.scaling.y = sy;
    this.scaling.z = sz;
    this.update();
  }
};

