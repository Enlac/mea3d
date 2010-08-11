// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.Scene = function() {
  this.models = [];
  this.modelsHash = {};
  this.skyBox = null; // Skybox is the model which will always be drawn first
  
  this.lights = [];
  this.ambientColor = new ColorRGBA(0, 0, 0);
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
      //Logging.log(">>>>>> BoundingShape" + i + " tested, distance: " + distanceSquared);
      
      if (distanceSquared<boundingShape.radiusSquared) {
        // We hit an object.
        //Logging.log(">>>>>> HITTEST: Hit an object!");
        if (nearestBoundingShapeDistanceSquared==-1 ||
            distanceSquared<nearestBoundingShapeDistanceSquared) {
          nearestBoundingShapeDistanceSquared = distanceSquared;
          nearestBoundingShape = boundingShape;
          //Logging.log(">>>>>> Minimum distance :" + nearestBoundingShapeDistanceSquared);
        }
      }
    }
    return nearestBoundingShape;
  }
};
