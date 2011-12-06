// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.Math = {

  // 4D Matrices
  getScaleMatrix4:function(sx,sy,sz) {
    return new mea3D.Matrix4( [[sx,0,0,0], [0,sy,0,0], [0,0,sz,0], [0,0,0,1]] );
  },
  getTranslationMatrix4:function(tx,ty,tz) {
    return new mea3D.Matrix4( 
      [[1,0,0,0],
       [0,1,0,0],
       [0,0,1,0],
       [tx,ty,tz,1]
    ]);
  },
  
  // Verified with DirectX SDK:
  getRotationMatrix4:function(angleX, angleY, angleZ) { // yaw, pitch, roll    
    var matX = mea3D.Math.getMatrixRotationX4(angleX);
    var matY = mea3D.Math.getMatrixRotationY4(angleY);
    var matZ = mea3D.Math.getMatrixRotationZ4(angleZ);    
    // Multiplication order is not important here since the matrices 
    // are orthogonal (or is it?)
    return mea3D.Math.mult4( mea3D.Math.mult4(matX, matY), matZ);
  },
  
  // Verified with DirectX SDK:
  getMatrixRotationX4:function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    return new mea3D.Matrix4(
    [ [1, 0, 0,  0],
      [0, c,  s, 0],
      [0, -s, c, 0],
      [0, 0, 0,  1]
    ]);
  },
  getMatrixRotationY4:function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    return new mea3D.Matrix4(
    [ [c, 0, -s, 0],
      [0, 1,  0, 0],
      [s, 0, c,  0],
      [0, 0, 0,  1]
    ]);
  },
  getMatrixRotationZ4:function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    return new mea3D.Matrix4(
    [ [c,  s, 0, 0],
      [-s, c, 0, 0],
      [0, 0, 1,  0],      
      [0, 0, 0,  1]
    ]);
  },
  
  // Expanded 4x4 matrix multiplication. This might perform a little better than mea3D.Matrix4.mult(m)
  mult4:function(a,b) {
    var c = new mea3D.Matrix4();
    c.vals[0][0] = a.vals[0][0] * b.vals[0][0] + a.vals[0][1] * b.vals[1][0] + a.vals[0][2] * b.vals[2][0] + a.vals[0][3] * b.vals[3][0];
    c.vals[0][1] = a.vals[0][0] * b.vals[0][1] + a.vals[0][1] * b.vals[1][1] + a.vals[0][2] * b.vals[2][1] + a.vals[0][3] * b.vals[3][1];
    c.vals[0][2] = a.vals[0][0] * b.vals[0][2] + a.vals[0][1] * b.vals[1][2] + a.vals[0][2] * b.vals[2][2] + a.vals[0][3] * b.vals[3][2];
    c.vals[0][3] = a.vals[0][0] * b.vals[0][3] + a.vals[0][1] * b.vals[1][3] + a.vals[0][2] * b.vals[2][3] + a.vals[0][3] * b.vals[3][3];
    c.vals[1][0] = a.vals[1][0] * b.vals[0][0] + a.vals[1][1] * b.vals[1][0] + a.vals[1][2] * b.vals[2][0] + a.vals[1][3] * b.vals[3][0];
    c.vals[1][1] = a.vals[1][0] * b.vals[0][1] + a.vals[1][1] * b.vals[1][1] + a.vals[1][2] * b.vals[2][1] + a.vals[1][3] * b.vals[3][1];
    c.vals[1][2] = a.vals[1][0] * b.vals[0][2] + a.vals[1][1] * b.vals[1][2] + a.vals[1][2] * b.vals[2][2] + a.vals[1][3] * b.vals[3][2];
    c.vals[1][3] = a.vals[1][0] * b.vals[0][3] + a.vals[1][1] * b.vals[1][3] + a.vals[1][2] * b.vals[2][3] + a.vals[1][3] * b.vals[3][3];
    c.vals[2][0] = a.vals[2][0] * b.vals[0][0] + a.vals[2][1] * b.vals[1][0] + a.vals[2][2] * b.vals[2][0] + a.vals[2][3] * b.vals[3][0];
    c.vals[2][1] = a.vals[2][0] * b.vals[0][1] + a.vals[2][1] * b.vals[1][1] + a.vals[2][2] * b.vals[2][1] + a.vals[2][3] * b.vals[3][1];
    c.vals[2][2] = a.vals[2][0] * b.vals[0][2] + a.vals[2][1] * b.vals[1][2] + a.vals[2][2] * b.vals[2][2] + a.vals[2][3] * b.vals[3][2];
    c.vals[2][3] = a.vals[2][0] * b.vals[0][3] + a.vals[2][1] * b.vals[1][3] + a.vals[2][2] * b.vals[2][3] + a.vals[2][3] * b.vals[3][3];
    c.vals[3][0] = a.vals[3][0] * b.vals[0][0] + a.vals[3][1] * b.vals[1][0] + a.vals[3][2] * b.vals[2][0] + a.vals[3][3] * b.vals[3][0];
    c.vals[3][1] = a.vals[3][0] * b.vals[0][1] + a.vals[3][1] * b.vals[1][1] + a.vals[3][2] * b.vals[2][1] + a.vals[3][3] * b.vals[3][1];
    c.vals[3][2] = a.vals[3][0] * b.vals[0][2] + a.vals[3][1] * b.vals[1][2] + a.vals[3][2] * b.vals[2][2] + a.vals[3][3] * b.vals[3][2];
    c.vals[3][3] = a.vals[3][0] * b.vals[0][3] + a.vals[3][1] * b.vals[1][3] + a.vals[3][2] * b.vals[2][3] + a.vals[3][3] * b.vals[3][3];    
    return c;
  },
  
  // Verified with Direct3D's D3DXMatrixPerspectiveFovLH
  getProjectionMatrix4:function(zNear, zFar, fovHor, fovVer) {
    var w = 1.0/Math.tan(fovHor*0.5);
    var h = 1.0/Math.tan(fovVer*0.5);
    var q = zFar/ (zFar-zNear);
    var matrix = new mea3D.Matrix4();
    matrix.vals[0][0] = w;
    matrix.vals[1][1] = h;
    matrix.vals[2][2] = q;
    matrix.vals[2][3] = 1;
    matrix.vals[3][2] = -q*zNear;
    return matrix;
  },
  
  getCameraMatrix4:function(eyePos, lookAt, upVector) {
    var zAxis = lookAt.subt(eyePos).norm();
    var xAxis = upVector.cross(zAxis).norm();
    var yAxis = zAxis.cross(xAxis);
    
    var dotX  = -xAxis.dot(eyePos);
    var dotY  = -yAxis.dot(eyePos);
    var dotZ  = -zAxis.dot(eyePos);
    
    return new mea3D.Matrix4(
      [ [xAxis.x, yAxis.x, zAxis.x, 0],
        [xAxis.y, yAxis.y, zAxis.y, 0],
        [xAxis.z, yAxis.z, zAxis.z, 0],
        [dotX,    dotY,    dotZ,    1]
      ]);
  },
  getScreenProjectionMatrix4:function(x, y, width, height, zMin, zMax) {
    return new mea3D.Matrix4(
      [ [ width*0.5, 0, 0, 0],
        [ 0, -height*0.5, 0, 0],
        [ 0, 0, zMax-zMin, 0],
        [ x+width*0.5, y+height*0.5, zMin, 1]
      ]);
  },
  rotateVector3:function(vec3, angleX, angleY, angleZ){
    var rotMatrix = mea3D.Math.getRotationMatrix4(angleX, angleY, angleZ);
    return mea3D.Math.transformPoint(vec3, rotMatrix);
  },
  
  transformPoint:function(p, t) { // matrix, point
    return new mea3D.Vector3(
      t.vals[0][0]*p.x + t.vals[1][0]*p.y + t.vals[2][0]*p.z + t.vals[3][0],
      t.vals[0][1]*p.x + t.vals[1][1]*p.y + t.vals[2][1]*p.z + t.vals[3][1],
      t.vals[0][2]*p.x + t.vals[1][2]*p.y + t.vals[2][2]*p.z + t.vals[3][2]);
  },

  getFaceCenter:function(v1,v2,v3,v4) {
    if (v4) { // 4 point polygon
      return new mea3D.Vector3(
        (v1.x + v2.x + v3.x + v4.x)/4.0,
        (v1.y + v2.y + v3.y + v4.y)/4.0,
        (v1.z + v2.z + v3.z + v4.z)/4.0
      );
    } else { // triangle
      return new mea3D.Vector3(
        (v1.x + v2.x + v3.x)/3.0,
        (v1.y + v2.y + v3.y)/3.0,
        (v1.z + v2.z + v3.z)/3.0
      );
    }
  },
  getFaceNormal:function(v1,v2,v3) {  
    // For now, we assume 4 edge polygons are coplanar, so we don't include v4
    // in calculations here:
    var vec1 = v1.subt(v2);
    var vec2 = v1.subt(v3);
    return vec2.cross(vec1).norm();
  },
  
  getTransformationMatrix4:function(scale, rotation, position) {
    var scaleMatrix = mea3D.Math.getScaleMatrix4(scale.x, scale.y, scale.z);
    var rotationMatrix = mea3D.Math.getRotationMatrix4(rotation.x, rotation.y, rotation.z);
    var translationMatrix = mea3D.Math.getTranslationMatrix4(position.x, position.y, position.z);    
    var scaleRotateMatrix = mea3D.Math.mult4(rotationMatrix, scaleMatrix);
    return mea3D.Math.mult4(scaleRotateMatrix, translationMatrix);
  },
  
  // Converts mouse coordinates to a direction vector on a sphere. 
  // From http://viewport3d.com/trackball.htm
  // x and y are [-1,1], with [0,0] being the center of the screen.
  mouseCoordsToDirectionVector:function(x,y) {
    var z2 = 1-(x*x+y*y);
    var z = (z2>0) ? Math.sqrt(z2) : 0;
    return new mea3D.Vector3(x,-y,z).norm();
  },
  
  getRotationMatrixFromOrientation:function(dir) {

    var x_dir = new mea3D.Vector3(0.0,0.0,1.0);
    var y_dir = new mea3D.Vector3();
    var d = dir.z;

    if (d>-0.999999999 && d<0.999999999){ // to avoid problems with normalize in special cases
      x_dir = x_dir.subt(dir).scale(d).norm();
      y_dir = dir.cross(x_dir);
    } else {
      x_dir = new mea3D.Vector3(dir.z, 0, -dir.x);
      y_dir = new mea3D.Vector3(0,1,0);
    };


    // x_dir and y_dir is orthogonal to dir and to eachother.
    // so, you can make matrix from x_dir, y_dir, and dir in whatever way you prefer. 
    // What to do depends to what API you use and where arrow model is pointing.
    // this is matrix i use which may give starting point. 
    // this is for arrow that points in z direction (for arrow that points in x direction you may try swapping dir and x_dir)
      
    return new mea3D.Matrix4( [
      [x_dir.x, x_dir.y, x_dir.z, 0.0], 
      [y_dir.x, y_dir.y, y_dir.z, 0.0],
      [dir.x,   dir.y,   dir.z,   0.0],
      [0,       0,       0,       1.0]
    ]).transpose();
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
        var intersection = mea3D.Math.getRayPolygonListIntersection(
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
        var pointCoords = mea3D.Math.getPointCoordsInsideTriangle(
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
        var pointCoords = mea3D.Math.getPointCoordsInsideTriangle(
          intersectionPoint, 
          polygon.v1.pos, polygon.v2.pos, polygon.v3.pos
        );
        s = pointCoords.s;
        t = pointCoords.t;
        
        // If not in triangle 1, check triangle 2:
        if (s<0 || t<0 || s+t>1) {
          
          pointCoords = mea3D.Math.getPointCoordsInsideTriangle(
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
      var pointCoords = mea3D.Math.getPointCoordsInsideTriangle(
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
        pointCoords = mea3D.Math.getPointCoordsInsideTriangle(
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
  
  getReflectedRay:function(normal, incomingRay) {
    // Rr = Ri - 2 N (Ri . N) from http://local.wasp.uwa.edu.au/~pbourke/geometry/reflected/
    var dot = 2* normal.dot(incomingRay);
    var N = normal.scale(dot);
    return incomingRay.subt(N);
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
  
  // TODO: Test and Optimize
  distanceSquaredPointToLine:function(point, lineOrigin, lineDir) {
    // Formulas from http://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
    var x0 = point;
    var x1 = lineOrigin;
    var x2 = lineOrigin.add(lineDir);
    var x0_x1 = x0.subt(x1);
    var x0_x2 = x0.subt(x2);
    var x2_x1 = lineDir;
    return x0_x1.cross(x0_x2).mag2()/lineDir.mag2();
  },
  
  // Axis is at the origin.
  rotateVectorAroundAxis:function(vector, axis, angle) {
    // The formulas are from http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
    var u = axis.x;
    var v = axis.y;
    var w = axis.z;    
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;    
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);    
    var rotated = new mea3D.Vector3(0,0,0);
    var dot = vector.dot(axis);
    var lenAxis = axis.mag();    
    rotated.x = u * dot + (x*(v*v + w*w) - u*(v*y+w*z))*cos + lenAxis*(-w*y + v*z)*sin;
    rotated.y = v * dot + (y*(u*u + w*w) - v*(u*x+w*z))*cos + lenAxis*(w*x - u*z) *sin;
    rotated.z = w * dot + (z*(u*u + v*v) - w*(u*x+v*y))*cos + lenAxis*(-v*x + u*y)*sin;
    return rotated;
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
      var newSphere = mea3D.Math.getBoundingSphere(
        center, radius, sphereList[i].position, sphereList[i].radius
      );
      radius = newSphere.radius;
      center = newSphere.position;
    }
    return {radius: radius, position:center};
  }
};

