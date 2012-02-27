// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
* @param {Array=} vals
*/
mea3D.Matrix4 = function(vals) {
  if (!vals) {
    this.vals = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
  } else {
    this.vals = vals;
  }
}

mea3D.Matrix4.prototype = {
  toString:function() {
    var str = "\n";
    for (var r=0; r<4; r++) {
      //str = str + "[" + this.vals[r].join(",") + "]\n";
      str += "[";
      for (var c=0; c<4; c++) {
        str = str + this.vals[r][c].toFixed(3) + ", ";
      }
      str += "]\n";
    }
    return str;
  },
  
  equals:function(mat) {
    for (var y=0; y<4; y++) {
      for (var x=0; x<4; x++) {
        if (Math.abs(this.vals[x][y]-mat.vals[x][y])>0.0001)
          return false;
      }
    }
    return true;
  },
  
  loadIdentity:function() {
    this.vals = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
  },
  scale:function(d) {
    var vals = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (var r=0; r<4; r++) {
      for (var c=0; c<4; c++) {
        vals[r][c] = d * this.vals[r][c];
      }
    }
    return new mea3D.Matrix4(vals);
  },
  
  mult:function(matrix4) {
    var vals = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (var r=0; r<4; r++) {
      for (var c=0; c<4; c++) {
        for (var k=0; k<4; k++) {
          vals[r][c] += (this.vals[r][k]* matrix4.vals[k][c]);
        }
      }
    }
    return new mea3D.Matrix4(vals);
  },
  
  multVector3:function(vector3) {
    var vec = new mea3D.Vector3(0,0,0);
    vec.x = this.vals[0][0]*vector3.x + this.vals[0][1]*vector3.y + this.vals[0][2]*vector3.z + this.vals[0][3]*vector3.w;
    vec.y = this.vals[1][0]*vector3.x + this.vals[1][1]*vector3.y + this.vals[1][2]*vector3.z + this.vals[1][3]*vector3.w;
    vec.z = this.vals[2][0]*vector3.x + this.vals[2][1]*vector3.y + this.vals[2][2]*vector3.z + this.vals[2][3]*vector3.w;
    vec.w = this.vals[3][0]*vector3.x + this.vals[3][1]*vector3.y + this.vals[3][2]*vector3.z + this.vals[3][3]*vector3.w;
    return vec;
  },
  
  add:function(matrix4) {
    var vals = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (var r=0; r<4; r++) {
      for (var c=0; c<4; c++) {
        vals[r][c] = this.vals[r][c] + matrix4.vals[r][c];
      }
    }
    return new mea3D.Matrix4(vals);
  },
  
  subt:function(matrix4) {
    return this.add( matrix4.scale(-1) );
  },
  
  transpose:function() {
    var matrix = new mea3D.Matrix4();
    for (var y=0; y<4; y++) {
      for (var x=0; x<4; x++) {
        matrix.vals[x][y] = this.vals[y][x];
      }
    }
    return matrix;
  },

  // Sets the value in 3rd row, 3rd column to 1 by dividing the matrix with that value.
  normalize:function() {
    var w = this.vals[3][3];
    if (w==0) {
      mea3D.Logging.log("ERROR: w==0 in Matrix");
      return null;
    }
    var matrix = new mea3D.Matrix4();
    for (var y=0; y<4; y++) {
      for (var x=0; x<4; x++) {
        matrix.vals[x][y] = this.vals[y][x]/w;
      }
    }
    return matrix;
  },
  
  transformVector:function(v) {
    var out = new mea3D.Vector3(0,0,0);
    out.x = v.x * this.vals[0][0] + v.y * this.vals[1][0] + v.z * this.vals[2][0] + this.vals[3][0];
    out.y = v.x * this.vals[0][1] + v.y * this.vals[1][1] + v.z * this.vals[2][1] + this.vals[3][1];
    out.z = v.x * this.vals[0][2] + v.y * this.vals[1][2] + v.z * this.vals[2][2] + this.vals[3][2];
    out.w = v.x * this.vals[0][3] + v.y * this.vals[1][3] + v.z * this.vals[2][3] + this.vals[3][3];
    return out;
  },
  
  toArray:function() {
    return this.vals[0].concat(this.vals[1]).concat(this.vals[2]).concat(this.vals[3]);
  }
};
