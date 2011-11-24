// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

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
