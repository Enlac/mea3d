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
  }
  
};

