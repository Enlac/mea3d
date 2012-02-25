// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
 * @constructor
 */
mea3D.Camera = function(eyePos, eyeDir, upVector, fovHorizontal, fovVertical) {
  
  this.lookAtPos = null;
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
    return "mea3D.Camera:{eyePos:" + this.eyePos.toString() + ", eyeDir:" + this.eyeDir.toString() + "}";
  },
  
  reset:function() {
  
    this.eyePos   = new mea3D.Vector3(0,0,0);  // camera position
    this.eyeDir   = new mea3D.Vector3(0,0,1);  // camera direction      
    this.upVector = new mea3D.Vector3(0,1,0);  // camera up vector      
    this.update();
  },
  
  update:function() {
    this.lookAtPos       = this.eyePos.add(this.eyeDir.norm());
    this.leftVector      = this.upVector.cross(this.eyeDir).norm();
    this.viewTransform   = mea3D.Math.getCameraMatrix4( this.eyePos, this.lookAtPos, this.upVector );
  },
  
  /** Points the camera at a given point using given up direction vector. This method calculates eye 
   *  position and direction from given parameters. Consider using setEyePos and setEyeDir 
   *  instead for better performance.
   *
   * @param {mea3D.Vector3} lookAtPos  The point to look at
   * @param {mea3D.Vector3} upVector   Up vector of the camera
   */
  lookAt:function(lookAtPos, upVector) {
    // Normal form of camera state is (eyeDir, eyePos, upVector). Calculate
    // these values from given params and update:
    this.eyeDir = lookAtPos.subt(this.eyePos);
    this.upVector = this.leftVector.cross(this.eyeDir).norm();
    this.update();
  },
  
  /** Moves the camera in eye direction. A positive delta value will move the camera
   *  forward. A nnegative delta will move it backward.
   *
   * @param {number} delta Amount of movement
   */
  moveForwardBackward:function(delta) {
    if (delta==0) return;
    this.eyePos = this.eyePos.add(this.eyeDir.norm().scale(delta));
  },

  /** Moves the camera in sideways, keeping the eye direction same. This is basically
   *  the strafe movement. A positive delta value will move the camera to the right.
   *  A negative delta will move it to the left.
   *
   * @param {number} delta Amount of movement
   */
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
  setEyePos:function(pos) {
    this.eyePos = new mea3D.Vector3(pos.x, pos.y, pos.z);
  }, 
  getEyePos:function() {
    return this.eyePos;
  },
  moveTo:function(pos) { // Same as setEyePos
    this.eyePos = new mea3D.Vector3(pos.x, pos.y, pos.z);
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
  
  getViewTransform:function() {
    return this.viewTransform;
  },
  
  getLeftVector:function() {
    return this.leftVector;
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
    this.lookAtPos = this.eyePos.add(this.eyeDir);
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
    this.lookAtPos = this.eyePos.add(this.eyeDir);
  }
};
