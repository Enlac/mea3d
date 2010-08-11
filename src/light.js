// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

mea3D.LightType = {
  NONE:      0, 
  AMBIENT:   1,
  SPOT:      2,
  POINT:     3,
  DIRECTIONAL: 4
};
/**
* @constructor
*/
mea3D.Light = function(type, color, position, direction, range, attenuation, enabled) {

  this.type = type;
  this.color = color ? color: new ColorRGBA(0,1,0);
  this.position = position;
  this.direction = direction ? direction.norm():null;
  this.range = range;
  this.enabled = (typeof enabled=="undefined")? true:enabled;
  if (range) this.rangeSquared = range*range; // precalculated 
  this.attenuation = attenuation;
}

mea3D.Light.prototype = {

  calculateAttenuationFactor:function(distance) {
    if (this.attenuation) {
      var denominator = 0;
      if (this.attenuation.att0) denominator += this.attenuation.att0;
      if (this.attenuation.att1) denominator += (distance*this.attenuation.att1);
      if (this.attenuation.att2) denominator += (distance*distance*this.attenuation.att2);
      return denominator ? (1/denominator):0;
    }
    return 0;
  },
  
  calculateColor:function(faceMaterial, pointOnFace, faceNormal) {
  
    var calculatedColor = new ColorRGBA(0,0,0);
    
    switch (this.type) {
      case mea3D.LightType.AMBIENT:
        return null;
        break;
      
      case mea3D.LightType.SPOT:
        return null;
        break;
      
      case mea3D.LightType.DIRECTIONAL:        
        var dot = this.direction.dot(faceNormal);
        if (dot<0) dot = 0;
        if (dot>1) dot = 1;
        calculatedColor.r = faceMaterial.ambientColor.r*dot*this.color.r;
        calculatedColor.g = faceMaterial.ambientColor.g*dot*this.color.g;
        calculatedColor.b = faceMaterial.ambientColor.b*dot*this.color.b;
        return calculatedColor;
        break;
      
      case mea3D.LightType.POINT:
        var lightToPoint = pointOnFace.subt(this.position);
        var distanceSquared = lightToPoint.mag2();
        if (this.rangeSquared && distanceSquared>this.rangeSquared)
          return calculatedColor; // This light cannot illuminate this polygon
          
        var dot = lightToPoint.norm().dot(faceNormal);
        if (dot<0) dot = 0;
        if (dot>1) dot = 1;
        dot = dot * this.calculateAttenuationFactor(Math.sqrt(distanceSquared));
        
        calculatedColor.r = faceMaterial.ambientColor.r*dot*this.color.r;
        calculatedColor.g = faceMaterial.ambientColor.g*dot*this.color.g;
        calculatedColor.b = faceMaterial.ambientColor.b*dot*this.color.b;
        return calculatedColor;
        break;
    }    

    // Return the scaled the color
    //return color.scale(dot);
  }
};
