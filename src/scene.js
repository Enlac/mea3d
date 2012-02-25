// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Scene = function() {
  this.models = [];
  this.modelsHash = {};
  this.skyBox = null; // Skybox is the model which will always be drawn first
  
  this.lights = [];
  this.ambientColor = new mea3D.ColorRGBA(0, 0, 0);
  this.boundingShapes = [];
}

mea3D.Scene.prototype = {

  addModel:function(model) {
    if (model) {
      this.modelsHash[model.name] = model;
      this.models.push(model);
    }
  },
  getModelByName:function(name) {
    return this.modelsHash[name];
  },
  
  addLight:function(light) {
    if (light) {
      this.lights.push(light);
    }
  },
  
  addBoundingShape:function(shape) {
    this.boundingShapes.push(shape);
  },
  
  getLights:function() {
    return this.lights;
  },
  
  hitTestBoundingShape:function(lineOrigin, lineDirection) {
    var nearestBoundingShapeDistanceSquared = -1;
    var nearestBoundingShape = null;
    var boundingShape;
    for (var i=0; i<this.boundingShapes.length; ++i) {
      boundingShape = this.boundingShapes[i];
      var distanceSquared = mea3D.Math.distanceSquaredPointToLine(
        boundingShape.finalPosition,
        lineOrigin,
        lineDirection
      );
      
      if (distanceSquared<boundingShape.radiusSquared) {
        // We hit an object.
        if (nearestBoundingShapeDistanceSquared==-1 ||
            distanceSquared<nearestBoundingShapeDistanceSquared) {
          nearestBoundingShapeDistanceSquared = distanceSquared;
          nearestBoundingShape = boundingShape;
        }
      }
    }
    return nearestBoundingShape;
  },
  
  // Make mesh emitColor yellow:
  highlightMesh:function(mesh, enableHighlight) {
    if (mesh && mesh.material) {
      mesh.material.enableEmitColor = enableHighlight;
    }
  },
  
  // TODO: Refactor
  hitTestBoundingShapes:function(viewport, camera, x,y) {
      
    // Direction of the ray from eye position to given pixel's 3D position
    var pixelDirectionVector = mea3D.Math.Util.getPixelDirectionVector(
      viewport.width, viewport.height, 
      x,y,
      camera.getFovHorizontal(), camera.getFovVertical(),  // TODO: Include fov in calculations.
      camera.getEyeDir(), camera.getUpVector(), camera.getLeftVector()
    ).norm();
    
    var lineOrigin = camera.getEyePos();
    var lineDirection = pixelDirectionVector;
    var lineEnd = lineOrigin.add(lineDirection.scale(1,1,1));
    // We can draw mouse line using renderer.drawLine(lineOrigin, lineEnd);
    
    var nearestBoundingShape = this.hitTestBoundingShape(lineOrigin, lineDirection);
    return nearestBoundingShape;
  },
  
  // Previously selected shape within this scene:
  prevSelectedShape: null,
  
  /** Returns the bounding shape which is under the given mouse coordinates.
   *
   * @param viewport Viewport used for hit test
   * @param camera Camera used for hit test
   * @param {number} mouseX X coordinate of the mouse position
   * @param {number} mouseY Y coordinate of the mouse position
   */
  getMouseSelection:function(viewport, camera, mouseX, mouseY) {
    var boundingShape = this.hitTestBoundingShapes(viewport, camera, mouseX, mouseY);
    if (this.prevSelectedShape != boundingShape) {
      if (this.prevSelectedShape) {
        // If a previous shape was selected, de-highlight it: 
        this.highlightMesh(this.prevSelectedShape.ownerMesh, false); 
      }
      // Mouseout callback for previously selected mesh
      if (this.prevSelectedShape && this.prevSelectedShape.onMouseOut) {
        this.prevSelectedShape.onMouseOut(this.prevSelectedShape);
      }
      if (boundingShape) {
        // Highlight newly selected mesh
        this.highlightMesh(boundingShape.ownerMesh, true);
        // Mouseover callback for newly selected mesh
        if (boundingShape.onMouseOver) {
          boundingShape.onMouseOver(boundingShape);
        }
      }
      this.prevSelectedShape = boundingShape;
    }
    return boundingShape;
  }
};
