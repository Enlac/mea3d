// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Emre Acer

 
/** @enum {number}
 */
mea3D.RenderModes = {
  RENDER_NONE:0,
  RENDER_POINTS:1,
  RENDER_WIREFRAMES:2,
  RENDER_FACES:3
};

/** @constructor 
*/
mea3D.RenderStats = function() {
  this.verticesRendered = 0;
  this.polygonsRendered = 0;
  this.framesRendered = 0;
}

/** @interface 
  * Interface for the renderer context. Should not be used directly.
  */
mea3D.RendererContextInterface = function(canvas, viewport, options, renderStats) {};
mea3D.RendererContextInterface.prototype = {
  init:function(){},
  
  
  drawLine2D:function(x1, y1, x2, y2, color, lineWidth){},
  drawPoint2D:function(x, y, color){},
  drawPolygon2D:function(v1, v2, v3, v4, color, img){},
  drawRect2D:function(x, y, w, h, color){},
  
  
  drawLine:function(v1, v2, color, lineWidth) {},
  drawPoint:function(point, color){},
  
  renderText2D:function(text, position, fontSize, color){},
  renderText:function(text, position, fontSize, color){},
  renderCircle2D:function(position, radius, color){},
  renderPolygon:function(v1, v2, v3, v4, color, texture){},
  
  beginDraw:function(){},
  drawScene:function(scene){},
  endDraw:function(){},
  
  beginRender:function(clear){},
  render:function(){},
  endRender:function(){},
  clear:function(){},
  
  setProjectionMatrix:function(matrixProjection){},
  setTransformMatrix:function(matrixTransform){}
};


/**
* @constructor
*/
mea3D.Renderer = function(container, options) {

  if (!container) {
    return false;
  }
  this.container = container;
  
  var defaultOptions = { 
    width:          800,                              // viewport height
    height:         600,                              // viewport width
    backfaceCulling:true,                             // backface culling
    clearColor:     new mea3D.ColorRGBA(0,0,0),       // color with which we clean the screen
    renderMode:     mea3D.RenderModes.RENDER_FACES,   // render mode
    enableMouseNavigation:true,                       // should enable mouse navigation?
    cameraPosition:  new mea3D.Vector3(0,0,0),        // initial camera position
    cameraDirection: new mea3D.Vector3(0,0,1),        // initial camera direction
    cameraUpVector:  new mea3D.Vector3(0,1,0),        // initial camera up vector
    
    fovHorizontal:   Math.PI/3,                       // horizontal field of view
    aspectRatio:     this.width/this.height,          // viewport aspect ratio
    fovVertical:     Math.PI/(this.aspectRatio)       // vertical field of view
  };
  // Get the options
  this.options = mea3D.getOptions(options, defaultOptions);
  this.options.aspectRatio = (this.options.width/this.options.height);  
  // Calculate vertical fov using aspect ratio if it's not given
  if (!this.options.fovVertical) {
    this.options.fovVertical = this.options.fovHorizontal/this.options.aspectRatio;
  }
  // Create the viewport
  this.viewport = new mea3D.ViewPort(
    0, 0, // left and top coords
    this.options.width,
    this.options.height, 
    0.1, 100000 // near and far planes
  );  
  // Create the camera
  this.camera = new mea3D.Camera(
    this.options.cameraPosition.copy(),
    this.options.cameraDirection.norm(),    
    this.options.cameraUpVector,
    this.options.fovHorizontal,       // horizontal field of view
    this.options.fovVertical          // vertical field of view
  );
  // Set container width and heights  
  this.container.style.width  = this.viewport.width  + "px";
  this.container.style.height = this.viewport.height + "px";  
  
  this.renderStats = new mea3D.RenderStats();
  this.initialized = false;
  this.init();    
  this.reset();
};

mea3D.Renderer.prototype = {
  
  init:function() {
  
    this.canvas = mea3D.Utils.getCanvasElement(this.container);
    
    if (!this.canvas) {
      this.canvas = mea3D.Utils.createCanvas(this.container, this.viewport.width, this.viewport.height);
    }
    
    this.context = new mea3D.Canvas2DRendererContext(
      this.canvas, this.viewport, this.options, this.renderStats);
    this.initialized = this.context.init();
    return this.initialized;
  },
  
  isInitialized:function() {
    return this.initialized;
  },
  
  reset:function() {
    if (!(this.isInitialized())) {
      return false;
    }
    // Transformations:
    this.worldTransform = new mea3D.Matrix4(); // identity
    this.updateProjectionMatrix();
    this.updateTransformMatrix(); 
  },
  
  /** Call this method to update the projection matrix. Projection matrix only 
   *  needs to be updated if any of the projection parameters (near plane, far plane, 
   *  field of view) have changed: 
   *  e.g. If you changed the zoom factor, you will need to call method.
   */
  updateProjectionMatrix:function() {
    this.projectionTransform = mea3D.Math.getProjectionMatrix4(
      this.viewport.zNear, 
      this.viewport.zFar, 
      this.camera.getFovHorizontal(), 
      this.camera.getFovVertical()
    );
  },
  
  updateTransformMatrix:function() {
  
    // Update camera matrix
    this.camera.update();
    
    // Update Direct3D-ish transform matrices
    this.matrixWorldView = mea3D.Math.mult4(
      this.worldTransform,
      this.camera.getViewTransform()
    );
    this.matrixTransform = mea3D.Math.mult4(
        this.matrixWorldView,
        this.projectionTransform        
    );

    // Update perspective projection matrix
    this.screenProjectionMatrix = mea3D.Math.getScreenProjectionMatrix4(
      0,0, 
      this.viewport.width, this.viewport.height, 
      this.viewport.zNear, this.viewport.zFar
    );

    this.context.setProjectionMatrix(this.screenProjectionMatrix);
    this.context.setTransformMatrix(this.matrixTransform);
  },
  
  drawRect2D:function(x, y, width, height, color) {
    this.context.drawRect2D(x, y, width, height, color);
  },
  
  drawLine2D:function(x1,y1, x2,y2, color, lineWidth) {
    this.context.drawLine2D(x1,y1, x2,y2, color, lineWidth);   
  },
  
  drawLine:function(v1, v2, color, lineWidth) {
    this.context.drawLine(v1, v2, color, lineWidth);
  },
  
  drawPoint2D:function(x, y, color) {
    this.context.drawPoint2D(x, y, color);
  },
  
  drawPoint:function(point, color) {
    this.context.drawPoint(point, color);
  },
  
  drawPolygon2D:function(v1,v2,v3,v4, color, img) {
    this.context.drawPolygon2D(v1,v2,v3,v4, color, img);
  },
  
  renderText2D:function(text, position, fontSize, color) {
    this.context.renderText2D(text, position, fontSize, color);
  },
  
  // Renders text in 3d
  renderText:function(text, position, fontSize, color) {
    this.context.renderText(text, position, fontSize, color);
  },
  
  // Draw a 2D circle at the given point and radius
  renderCircle2D:function(position, radius, color) {
    this.context.renderCircle2D(position, radius, color);
  },
  
  clear:function() {
    this.context.clear();
  },
  
  update:function(scene) {

    this.updateTransformMatrix();

    this.context.clear();
    this.context.beginDraw();
    this.context.drawScene(scene);
    this.context.endDraw();
    
    this.context.beginRender();
    this.context.render();
    this.context.endRender();
    
  },
  
  screenToViewportCoords:function(screenX, screenY) {
    // Calculate mouse positions
    var halfWidth = this.viewport.width/2;
    var halfHeight= this.viewport.height/2;
    var x = (screenX - halfWidth) /halfWidth;
    var y = (screenY - halfHeight)/halfHeight;
    return new mea3D.Vector2(x,y);
  },
  
  getCamera:function() {
    return this.camera;
  },
  getCanvas:function() {
    return this.canvas;
  }
};
