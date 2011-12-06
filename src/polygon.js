// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.RenderableType = {
  POLYGON: 1,
  SURFACE: 2,
  TEXT: 3
};

/**
* @constructor
*/
mea3D.Polygon = function(
  type,
  vertex1, vertex2, vertex3, vertex4, 
  transformedVertices,
  projectedVertices,
  material
  ) {

  this.type = type;
  
  // 3D Coordinates
  this.v1 = vertex1;
  this.v2 = vertex2;
  this.v3 = vertex3;
  this.v4 = vertex4;  // can be null for triangles
  
  this.vertexCount = (this.v4) ? 4:3;
  
  // World transformed vertices for this polygon
  if (transformedVertices) {
    this.transformedVertices = transformedVertices;
  } else {
    this.transformedVertices = {};
    this.transformedVertices.v1 = new mea3D.Vector3(0,0,0);
    this.transformedVertices.v2 = new mea3D.Vector3(0,0,0);
    this.transformedVertices.v3 = new mea3D.Vector3(0,0,0);
    this.transformedVertices.v4 = new mea3D.Vector3(0,0,0);
  }
  
  // 2D projected vertices for this polygon
  if (projectedVertices) {
    this.projectedVertices = projectedVertices;
  } else {
    this.projectedVertices = {};
    this.projectedVertices.v1 = new mea3D.Vector3(0,0,0);
    this.projectedVertices.v2 = new mea3D.Vector3(0,0,0);
    this.projectedVertices.v3 = new mea3D.Vector3(0,0,0);
    this.projectedVertices.v4 = new mea3D.Vector3(0,0,0);
  }
  this.material = material; // the original material
  
  this.calculateNormalsAndCenters();
  this.calculateEdges();
}

mea3D.Polygon.prototype = {

  toString:function() {
    if (this.v4) {
      return "(v1:" + this.v1.pos + ", v2:" + this.v2.pos + 
             ", v3:" + this.v3.pos + ", v4:" + this.v4.pos +")";
    }
    return "(v1:" + this.v1.pos + ", v2:" + this.v2.pos + ", v3:" + this.v3.pos + ")";
  },
   
  //calculateNormals:function() {
  calculateNormalsAndCenters:function() {
   
    //this.normal = mea3D.Math.getFaceNormal(this.v1.pos, this.v2.pos, this.v3.pos);  
    this.center = mea3D.Math.getFaceCenter( // Center is calculated using 3D points
      this.v1.pos,
      this.v2.pos,
      this.v3.pos,
      this.v4 ? this.v4.pos : null
    );
    this.normal = mea3D.Math.getFaceNormal( // Normal is calculated using 3D points
      this.v1.pos,
      this.v2.pos,
      this.v3.pos,
      this.v4 ? this.v4.pos : null
    );
    /*this.v1.normal = this.normal;
    this.v2.normal = this.normal;
    this.v3.normal = this.normal;
    */
    this.transformedCenter = mea3D.Math.getFaceCenter( // Transformed center calculated from 3D points projected into 2D
      this.transformedVertices.v1,
      this.transformedVertices.v2,
      this.transformedVertices.v3,
      this.transformedVertices.v4
    );
    this.transformedNormal = mea3D.Math.getFaceNormal( // Transformed normal calculated from 3D points projected into 2D
      this.transformedVertices.v1,
      this.transformedVertices.v2,
      this.transformedVertices.v3,
      this.transformedVertices.v4
    );
  },
  
  calculateEdges:function() {
    // All of these are used in raytracing, so we are precalculating here:
    this.edge1 = this.v2.pos.subt(this.v1.pos);
    this.edge2 = this.v3.pos.subt(this.v1.pos);
    this.dot_edge12 = this.edge1.dot(this.edge2);
    this.dot_edge11 = this.edge1.dot(this.edge1);
    this.dot_edge22 = this.edge2.dot(this.edge2);
    
    this.minusCenterDotNormal = -this.center.dot(this.normal);  
    this.insidePolygonFormulaDenominator = (this.dot_edge12*this.dot_edge12)-(this.dot_edge11*this.dot_edge22);
  }
};
