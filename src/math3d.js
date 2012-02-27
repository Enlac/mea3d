// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Emre Acer

mea3D.Math = {

  /** Returns the scaling matrix built by the given scaling parameters.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} sx  Scaling in X dimension
   * @param {number} sy  Scaling in Y dimension
   * @param {number} sz  Scaling in Z dimension
   *
   * @return {mea3D.Matrix4} Calculated scaling matrix
   */
  getScaleMatrix4:function(sx,sy,sz) {
    return new mea3D.Matrix4( [[sx,0,0,0], [0,sy,0,0], [0,0,sz,0], [0,0,0,1]] );
  },
  
  /** Returns the translation matrix built by the given translation parameters.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} tx  Distance from X axis
   * @param {number} ty  Distance from Y axis
   * @param {number} tz  Distance from Z axis
   *
   * @return {mea3D.Matrix4} Calculated translation matrix
   */
  getTranslationMatrix4:function(tx,ty,tz) {
    return new mea3D.Matrix4( 
      [[1,0,0,0],
       [0,1,0,0],
       [0,0,1,0],
       [tx,ty,tz,1]
    ]);
  },
  
  /** Returns the rotation matrix built by the given rotation parameters.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} angleX  Rotation around X axis in radians (Yaw)
   * @param {number} angleY  Rotation around Y axis in radians (Pitch)
   * @param {number} angleZ  Rotation around Z axis in radions (Roll)
   *
   * @return {mea3D.Matrix4} Calculated rotation matrix
   */
  getRotationMatrix4:function(angleX, angleY, angleZ) {
    var matX = mea3D.Math.getMatrixRotationX4(angleX);
    var matY = mea3D.Math.getMatrixRotationY4(angleY);
    var matZ = mea3D.Math.getMatrixRotationZ4(angleZ);    
    // Multiplication order is not important here since the matrices 
    // are orthogonal (or is it?)
    return mea3D.Math.mult4( mea3D.Math.mult4(matX, matY), matZ);
  },
  
  /** Returns the rotation matrix representing a rotation around X axis.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} angle  Rotation around X axis in radians (Yaw)
   *
   * @return {mea3D.Matrix4} Calculated rotation matrix
   */
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
  
  /** Returns the rotation matrix representing a rotation around Y axis.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} angle  Rotation around Y axis in radians (Pitch)
   *
   * @return {mea3D.Matrix4} Calculated rotation matrix
   */
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
  
  /** Returns the rotation matrix representing a rotation around Z axis.
   *  Resulting matrix is similar to DirectX rotation matrices.
   *
   * @param {number} angle  Rotation around Z axis in radians (Roll)
   *
   * @return {mea3D.Matrix4} Calculated rotation matrix
   */
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
  
  /** Returns the multiplication of matrices a and b. Since this method uses expanded 4x4 matrix 
   *  multiplication, it might perform a  better than mea3D.Matrix4.mult(m)
   *
   * @param {mea3D.Matrix4} a Matrix to be multiplied
   * @param {mea3D.Matrix4} b Matrix to be multiplied
   *
   * @return {mea3D.Matrix4} Calculated product matrix
   */
  mult4:function(a, b) {
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
  
  /** Returns the projection matrix built using the given parameters. Identical to
   * Direct3D D3DXMatrixPerspectiveFovLH method.
   *
   * @param {number} zNear  Near plane distance
   * @param {number} zFar   Far plane distance
   * @param {number} fovHor Horizontal field of view angle, in radians
   * @param {number} fovVer Vertical field of view angle, in radians
   *
   * @return {mea3D.Matrix4} Calculated projection matrix
   */
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
  
  /** Returns the camera matrix built using the given parameters. Identical to
   * Direct3D D3DXMatrixPerspectiveFovLH method.
   *
   * @param {mea3D.Vector3} eyePos     Position of the eye (camera)
   * @param {mea3D.Vector3} lookAtPos  Position to look at
   * @param {mea3D.Vector3} upVector   Up vector of the camera, pointing in camera's Y axis
   *
   * @return {mea3D.Matrix4} Calculated camera matrix
   */
  getCameraMatrix4:function(eyePos, lookAtPos, upVector) {
    var zAxis = lookAtPos.subt(eyePos).norm();
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
  
  /** Returns the screen projection matrix built using the given parameters.
   *
   * @param {number} x      X position of the origin of the projection area
   * @param {number} y      Y position of the origin of the projection area
   * @param {number} width  Width of projection area
   * @param {number} height Height of projection area
   * @param {number} zMin   Mininum z distance for the projection
   * @param {number} zMax   Maximum z distance for the projection
   
   * @return {mea3D.Matrix4} Calculated screen projection matrix
   */
  getScreenProjectionMatrix4:function(x, y, width, height, zMin, zMax) {
    return new mea3D.Matrix4(
      [ [ width*0.5, 0, 0, 0],
        [ 0, -height*0.5, 0, 0],
        [ 0, 0, zMax-zMin, 0],
        [ x+width*0.5, y+height*0.5, zMin, 1]
      ]);
  },
  
  /** Rotates a vector using given rotation parameters.
   *
   * @param {mea3D.Vector3} vec3   The vector to rotate
   * @param {number} angleX        Rotation angle around X axis, in radians
   * @param {number} angleY        Rotation angle around Y axis, in radians
   * @param {number} angleZ        Rotation angle around Z axis, in radians
   *
   * @return {mea3D.Vector3} A newly created, rotated vector 
   */
  rotateVector3:function(vec3, angleX, angleY, angleZ){
    var rotMatrix = mea3D.Math.getRotationMatrix4(angleX, angleY, angleZ);
    return mea3D.Math.transformPoint(vec3, rotMatrix);
  },
  
  /** Transforms a point p using the given transformation matrix t and returns 
   *  a new mea3D.Vector3 instance. This method does not mutate p.
   *
   * @param {mea3D.Vector3} p Point to transform
   * @param {mea3D.Matrix4} t Matrix used to transform the point
   *
   * @return {mea3D.Vector3} A newly created, transformed vector
   */
  transformPoint:function(p, t) {
    return new mea3D.Vector3(
      t.vals[0][0]*p.x + t.vals[1][0]*p.y + t.vals[2][0]*p.z + t.vals[3][0],
      t.vals[0][1]*p.x + t.vals[1][1]*p.y + t.vals[2][1]*p.z + t.vals[3][1],
      t.vals[0][2]*p.x + t.vals[1][2]*p.y + t.vals[2][2]*p.z + t.vals[3][2]);
  },
  
  /** Transforms a vector (point) p using the given transformation matrix t 
   * into out parameter.
   *
   * @param {mea3D.Vector3} p   Vector to transform
   * @param {mea3D.Matrix4} t   Matrix used to transform the point
   * @param {mea3D.Vector3} out Transformed vector
   *
   * @return {mea3D.Vector3} The rotated out vector
   */
  transformPointInPlace:function(p, t, out) {
    out.x = t.vals[0][0]*p.x + t.vals[1][0]*p.y + t.vals[2][0]*p.z + t.vals[3][0];
    out.y = t.vals[0][1]*p.x + t.vals[1][1]*p.y + t.vals[2][1]*p.z + t.vals[3][1];
    out.z = t.vals[0][2]*p.x + t.vals[1][2]*p.y + t.vals[2][2]*p.z + t.vals[3][2];
    return out;
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
  
  /** Converts mouse coordinates to a direction vector on a sphere. X and Y coordinates are normalized
    * screen coordinates, ranging from -1 to 1, where (0,0) is the horizontal and vertical center 
    * of the screen.
    * Formulas from http://viewport3d.com/trackball.htm
    *
    * @param {number} x  A number in the range -1 to 1, where 0 is the horizontal center of the screen
    * @param {number} y  A number in the range -1 to 1, where 0 is the vertical the center of the screen
    */
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
    }


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
  
  /** Returns the rotated vector by rotating the given vector around the given axis 
    * by given angle degrees. Axis is a vector at the origin.
    *
    * @param {mea3D.Vector3} vector Vector to rotate
    * @param {mea3D.Vector3} axis   Axis used to rotate the vector
    * @param {number} angle         Angle to rotate, in radians 
    */
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
  
}

