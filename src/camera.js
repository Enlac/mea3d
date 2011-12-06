// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Camera = function(eyePos, eyeDir, upVector, fovHorizontal, fovVertical) {
  
  if (eyePos && eyeDir && upVector) {
    this.eyePos = eyePos;
    this.eyeDir = eyeDir.norm();
    this.upVector = upVector;
    this.fovHorizontal = fovHorizontal;
    this.fovVertical = fovVertical;
    this.update();
  } else {
    this.reset();
  }
}
  
mea3D.Camera.prototype = {

  toString:function() {
    return this.eyePos.toString() + "," + this.eyeDir.toString();
  },
  
  reset:function() {
  
    this.eyePos   = new mea3D.Vector3(0,0,0);  // camera position
    this.eyeDir   = new mea3D.Vector3(0,0,1);  // camera direction      
    this.upVector = new mea3D.Vector3(0,1,0);  // camera up vector      
    this.update();
  },
  
  update:function() {
    this.lookAt          = this.eyePos.add(this.eyeDir.norm());
    this.leftVector      = this.upVector.cross(this.eyeDir).norm();
    this.viewTransform   = mea3D.Math.getCameraMatrix4( this.eyePos, this.lookAt, this.upVector );
  },
  
  // negative delta will move backwards
  moveForwardBackward:function(delta) {
    if (delta==0) return;
    this.eyePos = this.eyePos.add(this.eyeDir.norm().scale(delta));
  },
  // negative delta will move left
  moveLeftRight:function(delta) {
    if (delta==0) return;
    var strafeVec = this.upVector.cross(this.eyeDir).norm();
    this.eyePos = this.eyePos.add(strafeVec.scale(delta));
  },
  rotateYaw:function(angle) {
    this.eyeDir = mea3D.Math.rotateVector3(this.eyeDir, 0, angle, 0);
  },
  rotatePitch:function(angle) {
    this.eyeDir = mea3D.Math.rotateVector3(this.eyeDir, 0, 0, angle);
  },

  moveUpDown:function(delta) {
    if (delta==0) return;
    this.eyePos = this.eyePos.add(this.upVector.scale(delta));
  },
  moveTo:function(pos) {
    this.eyePos = new mea3D.Vector3(pos.x, pos.y, pos.z);
  },
  getEyePos:function() {
    return this.eyePos;
  },
  
  getEyeDir:function() {
    return this.eyeDir;
  },
  setEyeDir:function(dir) {
    this.eyeDir = new mea3D.Vector3(dir.x, dir.y, dir.z).norm();
  },

  getFovHorizontal:function() {
    return this.fovHorizontal;
  },
  setFovHorizontal:function(fh) {
    this.fovHorizontal = fh;
  },
  
  getFovVertical:function() {
    return this.fovVertical;
  },
  setFovVertical:function(fv) {
    this.fovVertical = fv;
  },
  
  getUpVector:function() {
    return this.upVector;
  },
  setUpVector:function(vec) {
    this.upVector = new mea3D.Vector3(vec.x, vec.y, vec.z);
  },
  
  /*
  moveByMouse:function(x,y) {
  
    // Calculations are from http://viewport3d.com/trackball.htm
    //Logging.debug("Mouse x: " + x);
    //Logging.debug("Mouse y: " + y);
    var mouseCoordsVec = mea3D.Math.mouseCoordsToDirectionVector(x,y);    
    this.eyeDir = mouseCoordsVec; //=> this is resetting rotation by keyboard
    
    //mouseCoordsVec.y = -mouseCoordsVec.y;
    //this.eyeDir = this.eyeDir.add(mouseCoordsVec.norm()).norm; // => we may try this
    this.lookAt = this.eyePos.add(this.eyeDir);
    //this.upVector = mea3D.Math.rotateVector3(this.eyeDir, -Math.PI/2, 0, 0).norm(); 
  },
  */
  moveByMouseDelta:function(x,y) {
  
    // Calculations are from http://viewport3d.com/trackball.htm
    // Rotate by Y axis
    this.eyeDir = mea3D.Math.rotateVectorAroundAxis(this.eyeDir, this.upVector, x).norm();
    var leftVector = this.upVector.cross(this.eyeDir).norm();
    // Rotate by X axis
    this.eyeDir = mea3D.Math.rotateVectorAroundAxis(this.eyeDir, leftVector, y).norm();
   
    // Calculate new upvector
    //this.upVector = this.eyeDir.cross(leftVector).norm();
    this.lookAt = this.eyePos.add(this.eyeDir);
  }
};
