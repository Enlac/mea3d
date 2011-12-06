// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Frustum = function(apex, direction, upVector, fovHorizontal, fovVertical) {
  this.apex = apex;
  this.direction = direction;
  this.upVector = upVector;
  this.fovHorizontal = fovHorizontal;
  this.fovVertical = fovVertical;
}
