// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.Material = function(reflectivity, texture, ambientColor, emitColor) {
  
  this.ambientColor = ambientColor ? ambientColor : new mea3D.ColorRGBA(0,0,0);  
  this.emitColor    = emitColor    ? emitColor    : new mea3D.ColorRGBA(0,0,0);
  this.reflectivity = (typeof reflectivity=="undefined") ? 0:reflectivity; // 0 <= reflectivity <= 1
  
  this.enableAmbientColor = true;
  this.enableEmitColor = true;
  
  if (texture) {
    this.texture = texture;
  }
}

mea3D.Material.createFromTemplate = function(materialTemplate, textures) {

  var materialTexture = null;
  if (textures && materialTemplate.texture) {
    // Assign texture
    materialTexture = textures[materialTemplate.texture-1];
  }
  
  var material = new mea3D.Material(
    materialTemplate.reflectivity,
    materialTexture
  );
  material.setColorValues(
    materialTemplate.ambientColor,
    materialTemplate.emitColor,
    materialTemplate.diffuseColor,
    materialTemplate.specularColor          
  );
  return material;
};

mea3D.Material.prototype = {

  setColorValues:function(ambientValues, emitValues, diffuseValues, specularValues) {
    
    if (ambientValues) {
      this.ambientColor = mea3D.ColorRGBA.createFromValues(ambientValues);
    }
    if (emitValues) {
      this.emitColor = mea3D.ColorRGBA.createFromValues(emitValues);
    }
    // TODO: These values are ignored. Implement them in Math3D.computeLighing:
    /*
    if (diffuseValues) {
      this.diffuseColor = mea3D.ColorRGBA.createFromValues(diffuseValues);
    }
    if (specularValues) {
      this.specularColor = mea3D.ColorRGBA.createFromValues(specularValues);
    }
    */
  }
};
