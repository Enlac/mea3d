// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.ViewPort=function(x,y,width,height,zNear, zFar) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.zNear = zNear;
  this.zFar = zFar;
};
