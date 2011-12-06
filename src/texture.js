// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Texture=function(filePath) {
  this.image = null;
  if (filePath) {
    this.loadFromFile(filePath);
  }
};

mea3D.Texture.prototype = {
  
  loadFromFile:function(filePath) {
    this.image = new Image();
    this.image.src = filePath;
    //mea3D.Logging.log("loaded texture " + filePath);
  }
};
