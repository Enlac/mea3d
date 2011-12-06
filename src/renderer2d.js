// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Renderer2D = function(canvasElement) {
  if (!canvasElement) {
    return;
  }
  this.canvas = canvasElement;
  this.width = parseInt(this.canvas.width);
  this.height = parseInt(this.canvas.height);
  this.pixelSize = 1;
  this.context = this.canvas.getContext("2d");
  this.imageData = this.context.createImageData(
    this.width*this.pixelSize,
    this.height*this.pixelSize
  ); // Rendered image data to be filled
}

mea3D.Renderer2D.prototype = {

  /*setPixel:function(x,y,color) {
    for (var dy=0; dy<this.pixelSize; dy++) {
      for (var dx=0; dx<this.pixelSize; dx++) {
        var offset = 4*((this.pixelSize*this.width*(this.pixelSize*y+dy)+(this.pixelSize*x)+dx));
        this.imageData.data[offset]   = Math.floor(color.r * 255);
        this.imageData.data[offset+1] = Math.floor(color.g * 255);
        this.imageData.data[offset+2] = Math.floor(color.b * 255);
        this.imageData.data[offset+3] = Math.floor(color.a * 255);
      }
    }
  },*/
  setPixel:function(x,y,color) {
    var offset = ((this.width*y)+x) << 2; //*4
    this.imageData.data[offset]   = color.r;
    this.imageData.data[offset+1] = color.g;
    this.imageData.data[offset+2] = color.b;
    this.imageData.data[offset+3] = 255;
  },
  beginPath:function() {  
  },
  closePath:function() {
  },
  moveTo:function() {  
  },
  lineTo:function() {  
  },
  fill:function() {  
  },
  stroke:function() {  
  },
  fillText:function() {  
  },
  fillRect:function(x,y,w,h) {
    var color = new mea3D.ColorRGBA(255,255,0);
    var x0 = x;
    var x1 = x+w;
    var y0 = y;
    var y1 = y+h;
    for (var py=y0; py<y1; ++py) {
      for (var px=y0; px<y1; ++px) {
        this.setPixel(px,py,color);
      }
    }
  },
  arc:function() {
  },
  draw:function() {
    this.context.putImageData(this.imageData,0,0);
    this.setPixel(100,100, new mea3D.ColorRGBA(255,0,0));
  }
};
