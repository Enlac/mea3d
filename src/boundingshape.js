// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.BoundingShapeType = {
  NONE: 0,
  BOX: 1,
  SPHERE: 2
};
/**
* @constructor
*/
mea3D.BoundingShape = function(params) {
  if (params) {
    this.params = params;
    this.type = params.type;
    this.ownerMesh = params.ownerMesh;  // Which 3d mesh does this belong to?
    
    // relative position of the bounding shape to the model.
    this.position = params.position;
    this.finalPosition = params.finalPosition;
    
    if (this.type==mea3D.BoundingShapeType.SPHERE) {
      this.radius = params.radius;
      this.radiusSquared = this.radius*this.radius;
    }
  }
};

mea3D.BoundingShape.prototype = {
  toString:function() {
    if (this.type==mea3D.BoundingShapeType.SPHERE) {
      return this.position.toString() + " - r:" + this.radius;
    }
    return this.position.toString();
  },
  
  copy:function() {
    var newShape = new mea3D.BoundingShape(this.params);
    return newShape;
  }
};

