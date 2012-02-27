// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.MeshType = {
  MESH_NONE:0,
  MESH_POLYGON:1,   // three or four edged polygons
  MESH_SURFACE:2,   // surface (e.g. sphere)
  MESH_TEXT:3       // 3d text
};

// Each of the face indices are an array of numbers which index the faces
/**
* @constructor
*/
mea3D.Mesh = function(parent, params) {

  this.parent = parent;
  if (!params) params = {};
  
  this.name     = params.name;
  this.material = params.meshMaterial;
  this.transformation = params.transformation ? params.transformation:new mea3D.Transformation();
  // Calculated transformation from parents:
  this.finalTransformation = new mea3D.Transformation();  // TODO: We only use the matrix of the final transformation. Make it fully used.
  this.numFaces = 0;
  this.numVertices = 0;
}

mea3D.Mesh.createFromTemplate = function(parent, name, meshTemplate, materials, transformation) {
    
  // Build up the material for the mesh
  var meshMaterial = null;
  if (meshTemplate.materialIndex && materials &&           // Check if there exists a material
     (meshTemplate.materialIndex-1)<materials.length) {        
    meshMaterial = materials[meshTemplate.materialIndex-1];
  }
  
  var mesh = new mea3D.Mesh(        
    parent, // parent of the mesh
    { meshMaterial:meshMaterial,
      transformation:transformation,
      name:name
    }
  );
  
  if (typeof meshTemplate.type == "undefined" ||
      meshTemplate.type==mea3D.MeshType.MESH_POLYGON ||
      meshTemplate.type=="polygon") {
    
    // Create the poly mesh from the mesh template
    mesh.buildPolyMesh(
      meshTemplate.vertices,
      meshTemplate.faceIndices,
      meshTemplate.faceMaterialIndices,
      materials
    );
    
  } else if (
      meshTemplate.type==mea3D.MeshType.MESH_SURFACE ||
      meshTemplate.type=="surface") {

    // Surface mesh (Only Sphere for now)
    mesh.buildSurfaceMesh(
      meshTemplate.radius
    );
    
  } else if (
      meshTemplate.type==mea3D.MeshType.MESH_TEXT ||
      meshTemplate.type=="text") {
    // Text mesh
    mesh.buildTextMesh(
      meshTemplate.text
    );
  }
  return mesh;
};
  
mea3D.Mesh.prototype = {
  
  buildPolyMesh:function(vertices, faceIndices, faceMaterialIndices, materials) {
    this.type = mea3D.MeshType.MESH_POLYGON;
    this.initPolyMesh(vertices, faceIndices, faceMaterialIndices, materials);
  },
  
  buildSurfaceMesh:function(radius) {
    this.type = mea3D.MeshType.MESH_SURFACE;
    this.radius = radius;
  },
  
  buildTextMesh:function(text) {
    this.type = mea3D.MeshType.MESH_TEXT;
    this.text = text;
  },
  
  initPolyMesh:function(vertices, faceIndices, faceMaterialIndices, materials){
    
    if (!vertices || !faceIndices) return;
    
    // Build the vertices
    this.vertices = new Array(vertices.length/3);
    for (var i=0; i<vertices.length; i+=3) {
      this.vertices[i/3] = new mea3D.Vector3(vertices[i], vertices[i+1], vertices[i+2]);
    }
    this.numVertices = this.vertices.length;
        
    // Create empty vertices:
    this.worldTransformedVertices = new Array(this.numVertices);
    this.projectedVertices = new Array(this.numVertices);    
    for (var i=0; i<this.numVertices; i++) {
      this.projectedVertices[i] = new mea3D.Vector3(0,0,0);
      this.worldTransformedVertices[i] = new mea3D.Vector3(0,0,0);
    }
    // Transform the vertices
    this.worldTransformVertices();
    
    // Assign materials if there are any
    if (faceMaterialIndices) {
      this.faceMaterials = new Array(faceMaterialIndices.length);
      for (var i=0; i<faceMaterialIndices.length; i++) {
        this.faceMaterials[i] = materials[faceMaterialIndices[i]];
      }
    }
    
    // Finally, build up the faces (polygons):
    this.numFaces = 0;
    this.faceIndices = [];    
    this.polygons    = [];
    for (var i=0; i<faceIndices.length; ++i) {
      var vertexCount = faceIndices[i].length;
      // Only quads and triangles are supported:
      if (vertexCount!=3 && vertexCount!=4) {        
        continue;
      }
      var i1 = faceIndices[i][0]
      var i2 = faceIndices[i][1];
      var i3 = faceIndices[i][2];
      var vertex1 = new mea3D.Vertex(this.vertices[i1].x, this.vertices[i1].y, this.vertices[i1].z);
      var vertex2 = new mea3D.Vertex(this.vertices[i2].x, this.vertices[i2].y, this.vertices[i2].z);
      var vertex3 = new mea3D.Vertex(this.vertices[i3].x, this.vertices[i3].y, this.vertices[i3].z);
      
      var faceMaterial = null;
      if (faceMaterialIndices) {
        faceMaterial = this.faceMaterials[faceMaterialIndices[i]];      
      } else {
        // Inherit from the mesh
        faceMaterial = this.material;
     }
     if (!faceMaterial) {
       // if still null, assign the default material:
       faceMaterial = new mea3D.Material(0,null, new mea3D.ColorRGBA(0.6, 0.6, 0.6));
     }
        
      if (vertexCount==4) {
        // Quad
        var i4 = faceIndices[i][3];
        this.faceIndices.push([i1, i2, i3, i4]);
        var vertex4 = new mea3D.Vertex(this.vertices[i4].x, this.vertices[i4].y, this.vertices[i4].z);        
        
        this.polygons.push(
          new mea3D.Polygon(
            mea3D.RenderableType.POLYGON,
            vertex1, vertex2, vertex3, vertex4,
            { // Transformed vertices:
              v1:this.worldTransformedVertices[i1],
              v2:this.worldTransformedVertices[i2],
              v3:this.worldTransformedVertices[i3], 
              v4:this.worldTransformedVertices[i4]
            },
            { // Projected vertices:
              v1:this.projectedVertices[i1],
              v2:this.projectedVertices[i2],
              v3:this.projectedVertices[i3],
              v4:this.projectedVertices[i4]
            },
            faceMaterial
          )
        );
      
      } else {
      
        // Triangle
        this.faceIndices.push([i1, i2, i3]);
        this.polygons.push(
          new mea3D.Polygon(
            mea3D.RenderableType.POLYGON,
            vertex1, vertex2, vertex3, null,
            { // Transformed vertices:
              v1:this.worldTransformedVertices[i1],
              v2:this.worldTransformedVertices[i2],
              v3:this.worldTransformedVertices[i3], 
              v4:null
            },
            { // Projected vertices:
              v1:this.projectedVertices[i1],
              v2:this.projectedVertices[i2],
              v3:this.projectedVertices[i3],
              v4:null
            },
            faceMaterial
          )
        );
      } // else if (vertexCount>3)
    } // for 
    this.numFaces = this.faceIndices.length;       
    
    this.updateTransformation();
  },
  
  // Scales the vertices and sets the scaling value as 1.
  /*freezeScaling:function() {
    for (var i=0; i<this.numVertices; ++i) {
      this.vertices[i].x *= this.transformation.scaling.x;
      this.vertices[i].y *= this.transformation.scaling.y;
      this.vertices[i].z *= this.transformation.scaling.z;
    }
    this.transformation.scaling = new mea3D.Vector3(1,1,1);
    this.updateTransformation();
  },*/
  
  updateTransformation:function() {
    this.transformation.update();
    // TODO:Make this fully updated:
    this.finalTransformation.matrix = mea3D.Math.mult4(
      this.transformation.matrix, this.parent.transformation.matrix
    );
    this.finalTransformation.position = this.transformation.position.add(this.parent.transformation.position);
    
    // TODO: Combine rotations too:
    this.finalTransformation.scaling.x = this.transformation.scaling.x * this.parent.transformation.scaling.x;
    this.finalTransformation.scaling.y = this.transformation.scaling.y * this.parent.transformation.scaling.y;
    this.finalTransformation.scaling.z = this.transformation.scaling.z * this.parent.transformation.scaling.z;
    this.updateCentersAndNormals();
  },
  
  worldTransformVertices:function() {
    // Transform all vertices by the final transformation to avoid multiple 
    // transformations on vertices. This way, we won't have to world-transform 
    // the vertices everytime model transformation changes 
    // (i.e. mesh or model is moved, rotated etc)
    var transformed;
    for (var i=0; i<this.numVertices; ++i) {
      transformed = mea3D.Math.transformPoint(
        this.vertices[i], this.finalTransformation.matrix
      );
      // Do not directly assign this in order not to lose the references:
      this.worldTransformedVertices[i].x = transformed.x;
      this.worldTransformedVertices[i].y = transformed.y;
      this.worldTransformedVertices[i].z = transformed.z;
    }
  },
  
  updateCentersAndNormals:function() {
    
    this.worldTransformVertices();
    for (var i=0; i<this.numFaces; ++i) {
      var polygon = this.polygons[i];
      polygon.calculateNormalsAndCenters();
    }
  },
  
  projectVertices:function(matrix, viewportWidth, viewportHeight) {
    
    var halfViewportWidth = viewportWidth/2;
    var halfViewportHeight = viewportHeight/2;
    
    // Project all points and store them in this.projectedVertices
    var projected;
    for (var i=0; i<this.numVertices; i++) {
      
      projected = this.projectedVertices[i];
      mea3D.Math.transformPointInPlace(this.worldTransformedVertices[i], matrix, projected);
      
      // Perspective division:
      projected.x /= (projected.z);
      projected.y /= (projected.z);
      
      // Transform into viewport coords:
      var doubleProjectedW = 2.0*projected.w;
      projected.x =  ((projected.x * viewportWidth)  / doubleProjectedW) + halfViewportWidth;
      projected.y = -((projected.y * viewportHeight) / doubleProjectedW) + halfViewportHeight;
    }
  },
  
  
  calculateLighting:function(lights, ambientColor) {
    var polygon;
    for (var i=0; i<this.numFaces; ++i) {
      polygon = this.polygons[i];
      polygon.computedColor = mea3D.Math.Util.computeLighting(
        polygon.transformedCenter,
        polygon.transformedNormal,
        polygon.material,
        lights,
        ambientColor
      );
    }
  },
  
  
  
  calculateBoundingShapeParameters:function() {
  
    if (this.type==mea3D.MeshType.MESH_SURFACE ||
        this.type=="surface") {
      return {radius:this.radius, position:new mea3D.Vector3(0,0,0)};
    }
    
    if (typeof this.type=="undefined" ||
        this.type==mea3D.MeshType.MESH_POLYGON ||
        this.type=="polygon") {
    
      var radius, center;
      
      var scalingFactor = this.transformation.scaling.x *
                          this.transformation.scaling.x *
                          this.parent.transformation.scaling.x * 
                          this.parent.transformation.scaling.x;
      // Returns the distance of the farthest vertex from the center of the mesh
      // Find which vertices are used in the mesh.
      // TODO: We are checking the mesh's polygons to find out which vertices 
      // are used in the model. However, this causes duplicate vertices to be 
      // added since vertices are shared. Find a way to prune the unused 
      // vertices when the mesh is created from the template so that we can 
      // use the vertices directly instead of going through polygons.
      var usedVertices = [];      
      for (var i=0; i<this.numFaces; ++i) {
        var i1 = this.faceIndices[i][0];
        var i2 = this.faceIndices[i][1];
        var i3 = this.faceIndices[i][2];
        var i4 = this.faceIndices[i][3];
        
        var v1 = this.vertices[i1];
        var v2 = this.vertices[i2];
        var v3 = this.vertices[i3];
        var v4 = i4 ? this.vertices[i4] : null;
        usedVertices.push(v1);
        usedVertices.push(v2);
        usedVertices.push(v3);
        if (v4) usedVertices.push(v4);
      }
      
      var centerOfGravity = new mea3D.Vector3(0,0,0);
      if (usedVertices && usedVertices.length>0) {
      
        for (var i=0; i<usedVertices.length; i++) {
          centerOfGravity.x += usedVertices[i].x;
          centerOfGravity.y += usedVertices[i].y;
          centerOfGravity.z += usedVertices[i].z;
        }
        centerOfGravity.x /= usedVertices.length;
        centerOfGravity.y /= usedVertices.length;
        centerOfGravity.z /= usedVertices.length;
        
        // Find maximum distance:
        var maxDistSquared = 0;
        for (var i=0; i<usedVertices.length; i++) {
          var dist = usedVertices[i].subt(centerOfGravity).mag2() * scalingFactor;
          if (dist>maxDistSquared) {
            maxDistSquared = dist;
          }
        }
        radius = Math.sqrt(maxDistSquared);      
      } else { // usedVertices && usedVertices.length>0
        radius = 0;
      }
      
      return {radius:radius, position: centerOfGravity};
    }; // type==POLYGON
    
    return {radius:0, position: new mea3D.Vector3(0,0,0)};
  },
  
  calculateBoundingShape:function() {
    // calculate the radius and center of the bounding shape (sphere for now):
    var boundingSphere = this.calculateBoundingShapeParameters();
    if (!boundingSphere) {
      return;
    }
    // create the shape
    this.boundingShape = new mea3D.BoundingShape(
      {
        type      : mea3D.BoundingShapeType.SPHERE,
        position  : boundingSphere.position,
        radius    : boundingSphere.radius,
        finalPosition: this.finalTransformation.position.add(boundingSphere.position),
        ownerMesh : this
      }
    );
  },
  
  
  // Transformations
  moveTo:function(x,y,z) {
    this.transformation.moveTo(x,y,z);
  },
  move:function(x,y,z) {
    this.transformation.move(x,y,z);
  },
  rotate:function(x,y,z) {
    this.transformation.rotate(x,y,z);
  },
  scale:function(s) {
    this.transformation.scale(s);
  },
  scale3:function(sx,sy,sz) {
    this.transformation.scale3(sx,sy,sz);
  }
};

