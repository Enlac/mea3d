//
// mea3D HTML5 Canvas 3D library
//
// Math utilities 
//
// Author: Mustafa Acer

mea3D.Math.Util = {

  getReflectedRay:function(normal, incomingRay) {
    // Rr = Ri - 2 N (Ri . N) from http://local.wasp.uwa.edu.au/~pbourke/geometry/reflected/
    var dot = 2* normal.dot(incomingRay);
    var N = normal.scale(dot);
    return incomingRay.subt(N);
  },
  
  catmullRomSplinePos:function(p0,p1,p2,p3,t) {
  
    var tSquare = t*t;
    var tCube = tSquare*t;
    
    var p1_2 = p1.scale(2);
    var p0_2 = p0.scale(2);
    var p1_5 = p1.scale(5);
    var p2_4 = p2.scale(4);
    var p1_3 = p1.scale(3);
    var p2_3 = p2.scale(3);
    
    var el0 = p1_2;
    var el1 = p2.subt(p0).scale(t);
    var el2 = (p0_2.subt(p1_5).add(p2_4).subt(p3)).scale(tSquare);
    var el3 = (p1_3.add(p3).subt(p0.add(p2_3))).scale(tCube);   
    var pos = el0.add(el1).add(el2).add(el3).scale(0.5);
    return pos;
  },
  catmullRomSplineTangent:function(p0,p1,p2,p3,t) {
  
    var tSquare = t*t;    
    var p0_2 = p0.scale(2);
    var p1_5 = p1.scale(5);
    var p2_4 = p2.scale(4);
    var p1_3 = p1.scale(3);
    var p2_3 = p2.scale(3);
    
    var el1 = p2.subt(p0);
    var el2 = (p0_2.subt(p1_5).add(p2_4).subt(p3)).scale(2*t);
    var el3 = (p1_3.add(p3).subt(p0.add(p2_3))).scale(3*tSquare);   
    var tangent = el1.add(el2).add(el3).scale(0.5);
    return tangent;
  },

  // TODO: This function cannot find Quad-Ray intersections. It only finds the
  // intersection for the first triangular half. FIX IT!
  getRayPolygonListIntersection:function(polygonList, rayOrigin, rayDir, skipPolygon) {
    
    var intersection = {polygonIndex:-1, distance:-1};    
    var numFaces = polygonList.length;
    
    if (typeof skipPolygon=="undefined") skipPolygon = -1;
    
    // Vector creation is expensive. Do them here:
    var intersectionPoint = new mea3D.Vector3(0,0,0);
    var w = new mea3D.Vector3(0,0,0);
    var distanceVector = new mea3D.Vector3(0,0,0);
    var u,v, dot_uv, dot_wv, dot_wu, dot_uu, dot_vv;
    var center, normal, v1;
    var polygon;
    var d, denominator, planeDist;
    var den, s, t; //, trueDistanceSquared;
    
    for (var i=0; i<numFaces; i++) {
      
      if (i==skipPolygon) continue;
      
      polygon = polygonList[i];
      center = polygon.center;
      normal = polygon.normal;
      
      d = polygon.minusCenterDotNormal; // var d = -center.dot(normal);     
      denominator = rayDir.dot(normal); // N.D
      
      // This performs backface culling:
      if (denominator<=0) continue;     
    
      planeDist = -(d + (normal.dot(rayOrigin)))/denominator;  // rayOrigin is the origin of the ray    
      if (planeDist<=0) continue;    // no intersection
      
      // Find intersection point with the plane
      intersectionPoint.set(
        rayOrigin.x + rayDir.x*planeDist,   // x
        rayOrigin.y + rayDir.y*planeDist,   // y
        rayOrigin.z + rayDir.z*planeDist);  // z
      
      // Intersection point found. Check if it is inside the triangle.
      // Now, check if the intersection is inside the triangle:
      // Equations: Ray/Segment-Triangle Intersection from http://www.softsurfer.com/Archive/algorithm_0105/algorithm_0105.htm
      /*v1 = polygon.v1.pos;
      u = polygon.edge1;     // v1 - v0
      v = polygon.edge2;     // v2 - v0
      w.x = intersectionPoint.x - v1.x;
      w.y = intersectionPoint.y - v1.y;
      w.z = intersectionPoint.z - v1.z;
      
      dot_uv = polygon.dot_edge12; //u.dot(v);
      dot_wv = w.dot(v);
      dot_wu = w.dot(u);
      dot_uu = polygon.dot_edge11; //u.dot(u);
      dot_vv = polygon.dot_edge22; //v.dot(v);
      den = polygon.insidePolygonFormulaDenominator;
      s = ((dot_uv * dot_wv ) - (dot_vv * dot_wu))/den;
      t = ((dot_uv * dot_wu ) - (dot_uu * dot_wv))/den;
      */
      
      // TODO: Refactor and optimize
      if (!polygon.v4) {
        // triangle
        var pointCoords = mea3D.Math.Util.getPointCoordsInsideTriangle(
          intersectionPoint, 
          polygon.v1.pos, polygon.v2.pos, polygon.v3.pos
        );
        s = pointCoords.s;
        t = pointCoords.t;
        
        // If polygon is a triangle and the point is not in it, skip this polygon
        if (s<0 || t<0 || s+t>1) continue;
        
      } else {
      
        // Quad has two triangles: v1,v2,v3 and v3,v4,v1
        // Triangle 1:
        var pointCoords = mea3D.Math.Util.getPointCoordsInsideTriangle(
          intersectionPoint, 
          polygon.v1.pos, polygon.v2.pos, polygon.v3.pos
        );
        s = pointCoords.s;
        t = pointCoords.t;
        
        // If not in triangle 1, check triangle 2:
        if (s<0 || t<0 || s+t>1) {
          
          pointCoords = mea3D.Math.Util.getPointCoordsInsideTriangle(
            intersectionPoint, 
            polygon.v3.pos, polygon.v4.pos, polygon.v1.pos
          );
          s = pointCoords.s;
          t = pointCoords.t;
          if (s<0 || t<0 || s+t>1)  {
            continue;
          }          
        }
      }
      /*
      var pointCoords = mea3D.Math.Util.getPointCoordsInsideTriangle(
        intersectionPoint, 
        polygon.v1.pos, polygon.v2.pos, polygon.v3.pos
      );
      var s = pointCoords.s;
      var t = pointCoords.t;
      // If polygon is a triangle and the point is not in it, skip this polygon
      if (!polygon.v4 && s<=0 || t<=0 || s+t>1) continue;
      
      if (s<=0 || t<=0 || s+t>1) {
        
        if (!polygon.v4) {
          continue;
        }
        pointCoords = mea3D.Math.Util.getPointCoordsInsideTriangle(
          intersectionPoint, 
          polygon.v1.pos, polygon.v2.pos, polygon.v3.pos
        }
      );
        
      };
      
      if (poly
      // Otherwise, the polygon is a quadrilateral. Check the other triangle 
      // of the quad:
      */
      
      if (planeDist<intersection.distance || intersection.distance==-1) {
        intersection.distance = planeDist;
        intersection.polygonIndex = i;
        intersection.polygon = polygon;
        intersection.coords = {s:s, t:t};
        intersection.position = intersectionPoint;
      }
    }
    
    if (intersection.polygonIndex>=0) {
      return intersection;
    }
    return null;
  },
  
  // Returns u,v coordinates of the point with respect to the given triangle.
  // Used in raytracing:
  getPointCoordsInsideTriangle:function(point, v1,v2,v3) {    
    
    //var v1 = polygon.v1.pos;
    var u = v2.subt(v1);  //polygon.edge1;     // v1 - v0
    var v = v3.subt(v1);  //polygon.edge2;     // v2 - v0
    var w = point.subt(v1);
    
    var dot_uv = u.dot(v);  //polygon.dot_edge12; //u.dot(v);
    var dot_wv = w.dot(v);
    var dot_wu = w.dot(u);
    var dot_uu = u.dot(u);  //polygon.dot_edge11; //u.dot(u);
    var dot_vv = v.dot(v);  //polygon.dot_edge22; //v.dot(v);
               
    var den = (dot_uv*dot_uv)-(dot_uu*dot_vv);    //polygon.insidePolygonFormulaDenominator;
    var s = ((dot_uv * dot_wv ) - (dot_vv * dot_wu))/den;
    var t = ((dot_uv * dot_wu ) - (dot_uu * dot_wv))/den;
    
    // If point is not in triangle, then just skip this triangle
    //if (s<=0 || t<=0 || s+t>1) continue;
    return {s:s, t:t};
  },
  
  getPixelDirectionVector:function(width,height,x,y, fovHorizontal, fovVertical, eyeDir, upVector, leftVector){
    var halfWidth = width/2;
    var halfHeight = height/2;
    var pX = (x-halfWidth)/halfWidth;
    var pY = (y-halfHeight)/halfHeight;
    /*
    // TODO: Make this calculation correct (Numbers are calibrated!)
    var aspectRatio = fovHorizontal/fovVertical;
    var angleX = pX * 0.5 * 1.3;   // * fovHorizontal;
    var angleY = -pY * 0.5 /1.1;  // * fovVertical;
   
    var vec = eyeDir.add(leftVector.scale(angleX));
    vec = vec.add(upVector.scale(angleY));
    */
    var leftVector = upVector.cross(eyeDir);
    var vec = mea3D.Math.rotateVectorAroundAxis(eyeDir, upVector, fovHorizontal*pX*0.5);
    
    vec = mea3D.Math.rotateVectorAroundAxis(vec, leftVector, fovVertical*pY*0.5);
    /*mea3D.Logging.log("===========================");
    mea3D.Logging.log("upVector: " + upVector);
    mea3D.Logging.log("w,h  : " + width + "," + height);
    mea3D.Logging.log("fovs  : " + fovHorizontal + "," + fovVertical);
    mea3D.Logging.log("x,y  : " + x + "," + y);
    mea3D.Logging.log("pX,pY: " + pX + "," + pY);*/
    return vec;
  },
  
  getIlluminatingLights:function(point, polygonList, lights, skipPolygon) {
  
    var illuminatingLights = [];
    // For each light, check if the light is visible from the given point
    for (var i=0; i<lights.length; i++) {
      var light = lights[i];
      var rayDir;
      
      switch (light.type) {
        case mea3D.LightType.POINT:
          // For point lights, we check if there is a blocking polygon
          // between us and the light's position
          rayDir = light.position.subt(point).norm();
          break;
        
        case mea3D.LightType.DIRECTIONAL:
          // For directional lights, we check only through the light's direction.
          rayDir = light.direction;
          break;
      }
      
      if (rayDir) {
        var intersection = mea3D.Math.Util.getRayPolygonListIntersection(
          polygonList,
          point,
          rayDir,
          skipPolygon
        );
        
        if (intersection) { // There is a blocking polygon between point and light
          
        } else {
          // no blocking polygon, the light can illuminate the given point.
          illuminatingLights.push(light);
        }
      } // rayDir
    }
    return illuminatingLights;
  },
  
  computeLighting:function(pointOnPolygon, polygonNormal, polygonMaterial, lights, ambientColor) {

    var computedColor = new mea3D.ColorRGBA(0,0,0);    
    // Sum up all lights in the scene
    for (var i=0; i<lights.length; i++) {
    
      if (!lights[i].enabled)
        continue;
        
      var litColor = lights[i].calculateColor(
        polygonMaterial, 
        pointOnPolygon, // polygon center for realtime calculation, a specific point for raytracing
        polygonNormal
      );
      if (litColor) {
        computedColor.r += litColor.r;
        computedColor.g += litColor.g;
        computedColor.b += litColor.b;
        //computedColor.a += litColor.a; // not used now        
      }
    }
    
    // Ambient color:
    if (polygonMaterial.enableAmbientColor && polygonMaterial.ambientColor && ambientColor) {
      computedColor.r += (polygonMaterial.ambientColor.r * ambientColor.r);
      computedColor.g += (polygonMaterial.ambientColor.g * ambientColor.g);
      computedColor.b += (polygonMaterial.ambientColor.b * ambientColor.b);
    }
    
    // Emit color
    if (polygonMaterial.enableEmitColor && polygonMaterial.emitColor) {
      computedColor.r += polygonMaterial.emitColor.r;
      computedColor.g += polygonMaterial.emitColor.g;
      computedColor.b += polygonMaterial.emitColor.b;
    }
    return computedColor;
  },
  
  getBoundingSphere:function(pos1, radius1, pos2, radius2) {
  
    var distanceVector = pos2.subt(pos1);
    var dist = distanceVector.mag();
    var radiusSum = radius1 + radius2;
    
    // TODO: Are these calculations independent of the dist/radiusSum ratio?
    var radius = (dist + radiusSum)/2;
    var centerDist = (dist + radius1 - radius2)/2;
    var center = pos2.add(distanceVector.norm().scale(-centerDist));
    return {radius: radius, position:center};
  },
  
  // Calculates the minimum sphere that bounds all the spheres in the sphereList.
  // Returns {center, radius}
  getMinimumBoundingSphere:function(sphereList) {  
    if (!sphereList || sphereList.length==0) {
      return null;
    }
    var radius = sphereList[0].radius;
    var center = sphereList[0].position;
    for (var i=1; i<sphereList.length; i++) {
      var newSphere = mea3D.Math.Util.getBoundingSphere(
        center, radius, sphereList[i].position, sphereList[i].radius
      );
      radius = newSphere.radius;
      center = newSphere.position;
    }
    return {radius: radius, position:center};
  }

}