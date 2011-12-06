// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

// Frames Per Second Calculator
/**
* @constructor
*/
mea3D.FPSCalculator = function() {
  
  this.currentTime = new Date();
  this.startTime = this.currentTime;
  this.lastFPSCalculationTime = 0;
  this.fps = 0;
  this.numFrames = 0;
}

mea3D.FPSCalculator.prototype = {

  update:function() {
    
    this.currentTime = new Date();
    this.numFrames++;
    
    // Upte the FPS every 100 ms.
    var elapsedTime = (this.currentTime-this.startTime)/1000.0; // seconds      
    if ((this.currentTime-this.lastFPSCalculationTime)>100) {        
      this.fps = (this.numFrames/elapsedTime);
      this.lastFPSCalculationTime = this.currentTime;
    }    
    // Re-calculate FPS every 2 seconds:
    if (elapsedTime>2) {
      this.numFrames = 0;
      this.startTime = this.currentTime;      
    }    
  }  
  /*getFPS:function() {
    return this.fps;
  }*/
};
