// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.Model3D = function(name, modelTemplate, transformation) {
    
  /*if (modelTemplate) {
    Logging.info("Loading model template " + modelTemplate.name + " into model " + name);  
  } else {
    Logging.info("Creating empty model (" + name + ")");  
  }*/
  
  this.name = name;
  this.transformation = transformation ? transformation : new Transformation();
  
  this.numFaces = 0;
  this.numVertices = 0;
  this.meshNames = {};
  
  // Build up textures
  this.textures = null;
  if (modelTemplate && modelTemplate.textures) {
    this.textures = new Array(modelTemplate.textures.length);
    for (var i=0; i<modelTemplate.textures.length; i++) {
      this.textures[i] = new mea3D.Texture(modelTemplate.textures[i]);
    }
  }
  
  // Build up materials
  this.materials = null;
  if (modelTemplate && modelTemplate.materials) {
    this.materials = new Array(modelTemplate.materials.length);
    for (var i=0; i<modelTemplate.materials.length; i++) {    
      this.materials[i] = mea3D.Material.createFromTemplate(
        modelTemplate.materials[i],
        this.textures
      );
    }
  }
  if (modelTemplate) {
    this.loadFromTemplate(modelTemplate);
    //Logging.info("Model (" + modelTemplate.name + ") loaded, " + this.numVertices + " vertices, " + this.numFaces + " faces.");
  }
  
  this.updateTransformation();  
}

mea3D.Model3D.prototype = {

  loadFromTemplate:function(modelTemplate) {
    this.meshList = null;
    if (modelTemplate && modelTemplate.meshList) {
      this.meshList = new Array(modelTemplate.meshList.length);
      // Build meshes
      for (var i=0; i<modelTemplate.meshList.length; i++) {    
        this.meshList[i] = mea3D.Mesh.createFromTemplate(
          this,
          modelTemplate.meshList[i].name,
          modelTemplate.meshList[i],
          this.materials
        );    
        this.meshNames[modelTemplate.meshList[i].name] = this.meshList[i];
        this.numFaces += this.meshList[i].numFaces;
        this.numVertices += this.meshList[i].numVertices;
      }
    }
  },
  getMeshByName:function(meshName) {
    return this.meshNames[meshName];
  },
  
  updateTransformation:function() {
    this.transformation.update();
    this.updateMeshes();
    //Logging.log("Model transformation : " + this.transformation.toString());
  },
  
  updateMeshes:function() {
    if (this.meshList) {
      for (var i=0; i<this.meshList.length; i++) { 
        // Update the transformations and vertices
        this.meshList[i].updateTransformation();
      }
    }
  },
  
  
  addMesh:function(mesh, transformation) {
    if (!this.meshList) { this.meshList = []; }    
    if (transformation) { mesh.transformation = transformation; }
    mesh.parent = this;
    if (!mesh.material) {
      if (this.materials && this.materials.length>0) { 
        mesh.material = this.materials[0];
      } else {
        mesh.material = new mea3D.Material();
      }
    }
    mesh.updateTransformation();
    this.meshList.push(mesh);
    if (mesh.name) {
      this.meshNames[mesh.name] = mesh;
    }
    //Logging.log("Mesh transformation : " + mesh.transformation);
  },
  
  calculateBoundingShapeParameters:function() {
    // Return the maximum sphere that contains all the meshes of this model
    var sphereList = [];
    for (var i=0; i<this.meshList.length; i++) {
      this.meshList[i].calculateBoundingShape();
      if (this.meshList[i].boundingShape) {
        sphereList.push(
          {
            radius:this.meshList[i].boundingShape.radius,
            position:this.meshList[i].transformation.position.add(
              this.meshList[i].boundingShape.position)
          }
        );
      }
    }
    var boundingSphere = mea3D.Math.getMinimumBoundingSphere(sphereList);
    return boundingSphere;
  },
  
  calculateBoundingShape:function() {
    var boundingSphere = this.calculateBoundingShapeParameters();
    this.boundingShape = new mea3D.BoundingShape(
      {
        type      : mea3D.BoundingShapeType.SPHERE,
        position  : boundingSphere.position,
        finalPosition: this.transformation.position.add(boundingSphere.position),
        radius    : boundingSphere.radius,
        ownerMesh : this
      }
    );
    //Logging.log("Bounding shape calculated : " + this.boundingShape);
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
}
