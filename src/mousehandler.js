// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.MouseHandler = function(app) {
  this.app = app;
};

mea3D.MouseHandler.prototype = {

  bindEvents:function() {
    var me = this;
    document.onmousemove = function(ev) {     
      if (me.app.paused) return;
      if (ev.pageX && ev.pageY) {        
        var x = ev.pageX - me.app.sceneOffsetX;
        var y = ev.pageY - me.app.sceneOffsetY;
        return me.onMouseMove(x, y);
      }
    };
  },
  
  // Input handling
  onMouseMove:function(screenX, screenY) {
  
    //if (!(this.app.options.enableMouseNavigation))
    //  return true;
    
    if (screenX==this.prevMouseX && screenY==this.prevMouseY) {
      return true;
    }

    if (!this.app.renderer) {
      return true;
    }
    
    var viewportCoords = this.app.renderer.screenToViewportCoords(screenX, screenY);
    var prevCoords = this.app.renderer.screenToViewportCoords(this.prevMouseX, this.prevMouseY);
    var deltaCoords = viewportCoords.subt(prevCoords);
    
    this.app.renderer.camera.moveByMouseDelta(deltaCoords.x, deltaCoords.y);
    this.app.renderer.updateTransformMatrix();    

    this.prevMouseX = screenX;
    this.prevMouseY = screenY;

    // Render the new page:
    this.app.renderer.update();

    // TEST: Mouse hit test:
    if (this.getMouseSelection) {
      this.getMouseSelection(screenX, screenY);
    }
    return false;
  }
};

