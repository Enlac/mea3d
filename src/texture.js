// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

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
    //Logging.log("loaded texture " + filePath);
  }
};
