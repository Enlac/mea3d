/**
 * @license
 *
 * mea3D - HTML5 3D Engine - http://mea3d.googlecode.com
 *
 * Author:  Mustafa Emre Acer
 * Version: 1.0.2
 */
 
if (typeof(window.mea3D)=="undefined") {
  var mea3D = {};
}
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Renderer2D = function(canvasElement) {
  if (!canvasElement) {
    return;
  }
  this.canvas = canvasElement;
  this.width = parseInt(this.canvas.width, 10);
  this.height = parseInt(this.canvas.height, 10);
  this.pixelSize = 1;
  this.context = this.canvas.getContext("2d");
  this.imageData = this.context.createImageData(
    this.width*this.pixelSize,
    this.height*this.pixelSize
  ); // Rendered image data to be filled
}

mea3D.Renderer2D.prototype = {

  /*setPixel:function(x,y,color) {
    for (var dy=0; dy<this.pixelSize; dy++) {
      for (var dx=0; dx<this.pixelSize; dx++) {
        var offset = 4*((this.pixelSize*this.width*(this.pixelSize*y+dy)+(this.pixelSize*x)+dx));
        this.imageData.data[offset]   = Math.floor(color.r * 255);
        this.imageData.data[offset+1] = Math.floor(color.g * 255);
        this.imageData.data[offset+2] = Math.floor(color.b * 255);
        this.imageData.data[offset+3] = Math.floor(color.a * 255);
      }
    }
  },*/
  setPixel:function(x,y,color) {
    var offset = ((this.width*y)+x) << 2; //*4
    this.imageData.data[offset]   = color.r;
    this.imageData.data[offset+1] = color.g;
    this.imageData.data[offset+2] = color.b;
    this.imageData.data[offset+3] = 255;
  },
  beginPath:function() {  
  },
  closePath:function() {
  },
  moveTo:function() {  
  },
  lineTo:function() {  
  },
  fill:function() {  
  },
  stroke:function() {  
  },
  fillText:function() {  
  },
  fillRect:function(x,y,w,h) {
    var color = new mea3D.ColorRGBA(255,255,0);
    var x0 = x;
    var x1 = x+w;
    var y0 = y;
    var y1 = y+h;
    for (var py=y0; py<y1; ++py) {
      for (var px=y0; px<y1; ++px) {
        this.setPixel(px,py,color);
      }
    }
  },
  arc:function() {
  },
  draw:function() {
    this.context.putImageData(this.imageData,0,0);
    this.setPixel(100,100, new mea3D.ColorRGBA(255,0,0));
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

// Combines given options with the default values
mea3D.getOptions = function(options, defaultOptions) {
  var calculatedOptions = {};
  if (defaultOptions) {
    for (var optionName in defaultOptions) {
      if (options && optionName in options) {
        //mea3D.Logging.log("Setting " + optionName + " to " + options[optionName]);
        calculatedOptions[optionName] = options[optionName];
      }
      else  {
        //mea3D.Logging.log("Defaulting " + optionName + " to " + defaultOptions[optionName]);
        calculatedOptions[optionName] = defaultOptions[optionName];
      }
    }
  }
  return calculatedOptions;
};


mea3D.Utils = {

  // From Google JavaScripts:
  getPageOffsetTop:function(a){
    return a.offsetTop + (a.offsetParent ? mea3D.Utils.getPageOffsetTop(a.offsetParent):0);
  },
  // From Google JavaScripts:
  getPageOffsetLeft:function(a){
    return a.offsetLeft + (a.offsetParent ? mea3D.Utils.getPageOffsetLeft(a.offsetParent):0);
  },

  // Utility to parse 400x300 type strings
  getXYValues:function(str) {
  
    if (!str) return {x:-1, y:-1};
    
    var arr = str.split("x");
    var x = parseInt(arr[0], 10);
    var y = parseInt(arr[1], 10);
    return {x:x, y:y};
  },

  // getElementsByTagName implementation for IE, not recursive
  getElementsByTagName:function(domElement, tagName) {
    tagName = tagName.toUpperCase();
    var child = domElement.firstChild;
    var children = [];
    while (child) {
      if (child.tagName==tagName) {
        children.push(child);
      }
      // no recursion
    }
    return children;
  },
  
  getCanvasElement:function(domElement) {
    if (!domElement) {
      return null;
    }
    var canvas = null;
    if (domElement.getElementsByTagName) {
      canvas = domElement.getElementsByTagName("canvas") && domElement.getElementsByTagName("canvas")[0];
    } else {
      canvas = mea3D.Utils.getElementsByTagName("canvas") && mea3D.Utils.getElementsByTagName("canvas")[0];
    }
    return canvas;
  },
  
  createCanvas:function(parent, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    parent.appendChild(canvas);
    return canvas;
  }
}
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.LogLevel = {
  LOG_ALL   :0,
  LOG_DEBUG :1,
  LOG_INFO  :2,
  LOG_ERROR :3,
  LOG_NONE  :4
};

mea3D.Logging = {
  log:function(s) {
    if (typeof(window.console)!="undefined") {
      window.console.log(s);
    }
    var debugDiv = document.getElementById("debugDiv");
    if (debugDiv) {
      if (debugDiv.innerHTML.length>20000) {
        // clean if there is too much text
        debugDiv.innerHTML = "";
      }
      debugDiv.innerHTML += (s.replace(/\n/g, "<br>") + "<br>");
      if (document.getElementById("debugDivScrollTo")) {
        document.getElementById("debugDivScrollTo").scrollIntoView();
      }
    }
  },
  
  logByLevel:function(s, level) {
    var loggingLevel = document.getElementById("loggingLevel") ? 
      document.getElementById("loggingLevel").selectedIndex : 0;
    if (level) {    
      if (level<loggingLevel)
        return;
    }
    else {
      // if only log() is called, assume it's level is debug.
      if (mea3D.LogLevel.LOG_DEBUG<loggingLevel)
        return;
    }
    mea3D.Logging.log(s);
  },
  
  debug:function(s) {
    mea3D.Logging.logByLevel(s, mea3D.LogLevel.LOG_DEBUG);
  },
  
  info:function(s) {
    mea3D.Logging.logByLevel(s, mea3D.LogLevel.LOG_INFO);  
  },
  
  error:function(s) {
    mea3D.Logging.logByLevel(s, mea3D.LogLevel.LOG_ERROR);
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
* @param {number=} alpha
*/
mea3D.ColorRGBA = function(red, green, blue, alpha) {
  this.r = red;
  this.g = green;
  this.b = blue;
  
  this.a = (typeof alpha=="undefined") ? 1.0 : alpha;
}

// Static method
mea3D.ColorRGBA.createFromValues = function(array) {
  return new mea3D.ColorRGBA(array[0], array[1], array[2], array[3]);
};

mea3D.ColorRGBA.prototype = {

  // TODO: Make the color values integer. Float may not be good.
  toString:function() {
    return "rgb(" + 
      Math.floor(255*this.r) + "," + 
      Math.floor(255*this.g) + "," + 
      Math.floor(255*this.b) + ")";
  },
  
  equals:function(c) {  
    // TODO: Should we use triple equal signs?
    return this.r==c.r && this.g==c.g && this.b==c.b; // ignore alpha
  },
  
  copy:function() {
    return new mea3D.ColorRGBA(this.r, this.g, this.b, this.a);
  },
  
  scale:function(scaleR, scaleG, scaleB){
    return new mea3D.ColorRGBA(
      this.r*scaleR,
      this.g*scaleG,
      this.b*scaleB
      );
  },
  
  addColor:function(color) {
    return new mea3D.ColorRGBA(
      this.r + color.r,
      this.g + color.g,
      this.b + color.b,
      this.a + color.a);
  },
  
  add:function(r,g,b,a) {
    return new mea3D.ColorRGBA(
      this.r + r,
      this.g + g,
      this.b + b,
      this.a + a);
  },
  
  divide:function(denominator) {
    if (denominator==0) return null;
    return new mea3D.ColorRGBA(
      this.r/denominator,
      this.g/denominator,
      this.b/denominator,
      this.a/denominator);
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Vector2 = function(x,y) {
  this.x = x? x:0;
  this.y = y? y:0;
}
mea3D.Vector2.prototype = {
  toString:function() {
    return "(" + this.x.toFixed(3) + "," + this.y.toFixed(3) + ")";
  },
  scale:function(d) {
    return new mea3D.Vector2(this.x*d, this.y*d);
  },
  add:function(v) {
    return new mea3D.Vector2(this.x + v.x, this.y + v.y);
  },
  subt:function(v) {
    return new mea3D.Vector2(this.x - v.x, this.y - v.y);
  },
  dot:function(v) {
    return this.x*v.x + this.y*v.y;
  },
  mag:function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
};

// 3D Vectors
/**
* @constructor
* @param {number=} x
* @param {number=} y
* @param {number=} z
* @param {number=} w
*/
mea3D.Vector3 = function(x,y,z, w) {
  this.x = (x) ? x:0;
  this.y = (y) ? y:0;
  this.z = (z) ? z:0;
  this.w = (w) ? w:1.0; // homogenous coordinates
  
}

mea3D.Vector3.prototype = {
  toString:function() {
    return "(" + this.x.toFixed(3) + "," + 
    this.y.toFixed(3) + "," + 
    this.z.toFixed(3) + ",w:" + 
    this.w.toFixed(3) + ")";
  },
  equals:function(vec3) {
    var threshold = 0.0001;
    if (Math.abs(this.x-vec3.x)>threshold || 
        Math.abs(this.y-vec3.y)>threshold ||
        Math.abs(this.z-vec3.z)>threshold ||
        Math.abs(this.w-vec3.w)>threshold)
        return false;
    return true;
  },
  copy:function() {
    return new mea3D.Vector3(this.x, this.y, this.z, this.w);
  },
  
  scale:function(s) {
    return new mea3D.Vector3(this.x*s, this.y*s, this.z*s);
  },
  scale3:function(sx,sy,sz) {
    return new mea3D.Vector3(this.x*sx, this.y*sy, this.z*sz);
  },
  add:function(v) {
    return new mea3D.Vector3(
      this.x + v.x,
      this.y + v.y,
      this.z + v.z);
  },
  subt:function(v) {
    return new mea3D.Vector3(
      this.x - v.x,
      this.y - v.y,
      this.z - v.z);
  },
  mag:function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  },
  // Square of magnitude. 
  mag2:function() {
    return this.x*this.x + this.y*this.y + this.z*this.z;
  },
  norm:function() {
    var thisMag = this.mag();
    return this.scale(1/thisMag);
  },
  dot:function(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
  },
  cross:function(v) {
    return new mea3D.Vector3(
                        this.y*v.z - this.z*v.y,
                        this.z*v.x - this.x*v.z,
                        this.x*v.y - this.y*v.x);
  },
  set:function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Line3 = function(v1, v2) {
  this.v1 = v1;
  this.v2 = v2;
}

mea3D.Line3.prototype = {
  toString:function() {
    return this.v1.toString() + "," + this.v2.toString();
  },
  length:function() {
    var dX = this.v1.x-this.v2.x;
    var dY = this.v1.y-this.v2.y;
    var dZ = this.v1.z-this.v2.z;
    return Math.sqrt(dX*dX + dY*dY + dZ*dZ);
  },
  direction:function() {
    return this.v2.subt(this.v1).norm();
  }
};
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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
* @param {mea3D.Vector3=} position
* @param {mea3D.Vector3=} scaling
* @param {mea3D.Vector3=} rotation
*/
mea3D.Transformation = function(position, scaling, rotation) {
  this.position = position ? position : new mea3D.Vector3(0,0,0);
  this.rotation = rotation ? rotation : new mea3D.Vector3(0,0,0);
  this.scaling  = scaling  ? scaling  : new mea3D.Vector3(1,1,1);
  this.update();
}

mea3D.Transformation.prototype = {
  toString:function() {
    return  "position: " + this.position.toString() +
            "rotation: " + this.rotation.toString() +
            "scaling : " + this.scaling.toString();
  },
 
  copy:function() {
    var trans = new mea3D.Transformation(
      this.position.copy(),
      this.scaling.copy(),
      this.rotation.copy()
    );
    trans.update();
    return trans;
  },
  
  update:function() {   
    this.scaleMatrix = mea3D.Math.getScaleMatrix4(
      this.scaling.x, this.scaling.y, this.scaling.z
    );
    this.rotationMatrix = mea3D.Math.getRotationMatrix4(
      this.rotation.x, this.rotation.y, this.rotation.z
    );
    this.translationMatrix = mea3D.Math.getTranslationMatrix4(
      this.position.x, this.position.y, this.position.z
    );
    this.matrix = mea3D.Math.getTransformationMatrix4(
      this.scaling, this.rotation, this.position
    );
  },
  
  combine:function(childTransformation) {
    var trans = new mea3D.Transformation();
    trans.position = this.position.add(childTransformation.position);
    trans.rotation = this.rotation.copy(); //.add(childTransformation.rotation);
    // TODO: Add a "scale by vector" function to Vector3 class to encapsulate this:
    trans.scaling.x = this.scaling.x * childTransformation.scaling.x;
    trans.scaling.y = this.scaling.y * childTransformation.scaling.y;
    trans.scaling.z = this.scaling.z * childTransformation.scaling.z;
    trans.update();
    return trans;
  },
  
  moveTo:function(x,y,z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.update();
  },
  
  move:function(deltaX,deltaY,deltaZ) {
    this.position.x += deltaX;
    this.position.y += deltaY;
    this.position.z += deltaZ;
    this.update();
  },
  rotate:function(angleX, angleY, angleZ) {
    this.rotation.x += angleX;
    this.rotation.y += angleY;
    this.rotation.z += angleZ;
    this.update();
  },
  scale:function(s) {
    this.scaling.x = s;
    this.scaling.y = s;
    this.scaling.z = s;
    this.update();
  },
  scale3:function(sx, sy, sz) {
    this.scaling.x = sx;
    this.scaling.y = sy;
    this.scaling.z = sz;
    this.update();
  }
};
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

// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Camera = function(eyePos, eyeDir, upVector, fovHorizontal, fovVertical) {
  
  if (eyePos && eyeDir && upVector) {
    this.eyePos = eyePos;
    this.eyeDir = eyeDir.norm();
    this.upVector = upVector;
    this.fovHorizontal = fovHorizontal;
    this.fovVertical = fovVertical;
    this.update();
  } else {
    this.reset();
  }
}
  
mea3D.Camera.prototype = {

  toString:function() {
    return this.eyePos.toString() + "," + this.eyeDir.toString();
  },
  
  reset:function() {
  
    this.eyePos   = new mea3D.Vector3(0,0,0);  // camera position
    this.eyeDir   = new mea3D.Vector3(0,0,1);  // camera direction      
    this.upVector = new mea3D.Vector3(0,1,0);  // camera up vector      
    this.update();
  },
  
  update:function() {
    this.lookAt          = this.eyePos.add(this.eyeDir.norm());
    this.leftVector      = this.upVector.cross(this.eyeDir).norm();
    this.viewTransform   = mea3D.Math.getCameraMatrix4( this.eyePos, this.lookAt, this.upVector );
  },
  
  // negative delta will move backwards
  moveForwardBackward:function(delta) {
    if (delta==0) return;
    this.eyePos = this.eyePos.add(this.eyeDir.norm().scale(delta));
  },
  // negative delta will move left
  moveLeftRight:function(delta) {
    if (delta==0) return;
    var strafeVec = this.upVector.cross(this.eyeDir).norm();
    this.eyePos = this.eyePos.add(strafeVec.scale(delta));
  },
  rotateYaw:function(angle) {
    this.eyeDir = mea3D.Math.rotateVector3(this.eyeDir, 0, angle, 0);
  },
  rotatePitch:function(angle) {
    this.eyeDir = mea3D.Math.rotateVector3(this.eyeDir, 0, 0, angle);
  },

  moveUpDown:function(delta) {
    if (delta==0) return;
    this.eyePos = this.eyePos.add(this.upVector.scale(delta));
  },
  moveTo:function(pos) {
    this.eyePos = new mea3D.Vector3(pos.x, pos.y, pos.z);
  },
  getEyePos:function() {
    return this.eyePos;
  },
  
  getEyeDir:function() {
    return this.eyeDir;
  },
  setEyeDir:function(dir) {
    this.eyeDir = new mea3D.Vector3(dir.x, dir.y, dir.z).norm();
  },

  getFovHorizontal:function() {
    return this.fovHorizontal;
  },
  setFovHorizontal:function(fh) {
    this.fovHorizontal = fh;
  },
  
  getFovVertical:function() {
    return this.fovVertical;
  },
  setFovVertical:function(fv) {
    this.fovVertical = fv;
  },
  
  getUpVector:function() {
    return this.upVector;
  },
  setUpVector:function(vec) {
    this.upVector = new mea3D.Vector3(vec.x, vec.y, vec.z);
  },
  
  getViewTransform:function() {
    return this.viewTransform;
  },
  
  getLeftVector:function() {
    return this.leftVector;
  },
  
  /*
  moveByMouse:function(x,y) {
  
    // Calculations are from http://viewport3d.com/trackball.htm
    //Logging.debug("Mouse x: " + x);
    //Logging.debug("Mouse y: " + y);
    var mouseCoordsVec = mea3D.Math.mouseCoordsToDirectionVector(x,y);    
    this.eyeDir = mouseCoordsVec; //=> this is resetting rotation by keyboard
    
    //mouseCoordsVec.y = -mouseCoordsVec.y;
    //this.eyeDir = this.eyeDir.add(mouseCoordsVec.norm()).norm; // => we may try this
    this.lookAt = this.eyePos.add(this.eyeDir);
    //this.upVector = mea3D.Math.rotateVector3(this.eyeDir, -Math.PI/2, 0, 0).norm(); 
  },
  */
  moveByMouseDelta:function(x,y) {
  
    // Calculations are from http://viewport3d.com/trackball.htm
    // Rotate by Y axis
    this.eyeDir = mea3D.Math.rotateVectorAroundAxis(this.eyeDir, this.upVector, x).norm();
    var leftVector = this.upVector.cross(this.eyeDir).norm();
    // Rotate by X axis
    this.eyeDir = mea3D.Math.rotateVectorAroundAxis(this.eyeDir, leftVector, y).norm();
   
    // Calculate new upvector
    //this.upVector = this.eyeDir.cross(leftVector).norm();
    this.lookAt = this.eyePos.add(this.eyeDir);
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.ViewPort = function(x,y,width,height,zNear, zFar) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.zNear = zNear;
  this.zFar = zFar;
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
* @param {number=} nx
* @param {number=} ny
* @param {number=} nz
* @param {mea3D.ColorRGBA=} color
*/
mea3D.Vertex = function(x,y,z, nx,ny,nz, color) {
  this.pos = new mea3D.Vector3(0,0,0);
  this.pos.x = x;
  this.pos.y = y;
  this.pos.z = z;
  
  this.normal = new mea3D.Vector3(0,0,0);
  if (nx) this.normal.x = nx;
  if (ny) this.normal.y = ny;
  if (nz) this.normal.z = nz;
  
  // Seems like we cannot use vertex colors in HTML5 canvases, but anyways:
  this.color = (color)?color:"#fff";
}

mea3D.Vertex.fromVector = function(vector) {
  return new mea3D.Vertex(
    vector.x,
    vector.y,
    vector.z
  );
};
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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Texture=function(filePath) {
  this.image = null;
  if (filePath) {
    this.loadFromFile(filePath);
  }
};

mea3D.Texture.prototype = {
  
  loadFromFile:function(filePath) {
    this.image = new Image();
    this.image.src = filePath;
    //mea3D.Logging.log("loaded texture " + filePath);
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

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
  this.color = color ? color: new mea3D.ColorRGBA(0,1,0);
  this.position = position;
  this.direction = direction ? direction.norm():null;
  this.range = range;
  this.enabled = (typeof enabled=="undefined")? true:enabled;
  if (range) this.rangeSquared = range*range; // precalculated 
  this.attenuation = attenuation;
}

mea3D.Light.prototype = {

  setEnabled:function(enabled) {
    this.enabled = enabled;
  },
  getEnabled:function() {
    return this.enabled;
  },
  
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
  
    var calculatedColor = new mea3D.ColorRGBA(0,0,0);
    
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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.BoundingShapeType = {
  NONE: 0,
  BOX: 1,
  SPHERE: 2
};
/**
* @constructor
*/
mea3D.BoundingShape = function(params) {
  if (params) {
    this.params = params;
    this.type = params.type;
    this.ownerMesh = params.ownerMesh;  // Which 3d mesh does this belong to?
    
    // relative position of the bounding shape to the model.
    this.position = params.position;
    this.finalPosition = params.finalPosition;
    
    if (this.type==mea3D.BoundingShapeType.SPHERE) {
      this.radius = params.radius;
      this.radiusSquared = this.radius*this.radius;
    }
  }
};

mea3D.BoundingShape.prototype = {
  toString:function() {
    if (this.type==mea3D.BoundingShapeType.SPHERE) {
      return this.position.toString() + " - r:" + this.radius;
    }
    return this.position.toString();
  },
  
  copy:function() {
    var newShape = new mea3D.BoundingShape(this.params);
    return newShape;
  }
};

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
    //mea3D.Logging.log("Mesh loaded with " + this.numVertices + " vertices, " + this.numFaces + " faces.");
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
    
    // Project all points and store them in this.projectedVertices
    var projected;
    for (var i=0; i<this.numVertices; i++) {      
      
      // Calculate 2D projection of the world transformed point:
      projected = mea3D.Math.transformPoint(
        this.worldTransformedVertices[i], matrix
      );
      // Perspective division:
      projected.x /= (projected.z);
      projected.y /= (projected.z);
      
      // Transform into viewport coords:
      projected.x =  ((projected.x * viewportWidth)  / (2.0*projected.w)) + viewportWidth/2;
      projected.y = -((projected.y * viewportHeight) / (2.0*projected.w)) + viewportHeight/2;    
      
      // Assign fields one by one in order to not lose the reference to
      // this.projectedVertices[i].
      this.projectedVertices[i].x = projected.x;
      this.projectedVertices[i].y = projected.y;
      this.projectedVertices[i].z = projected.z;      
    }
  },
  
  
  calculateLighting:function(lights, ambientColor) {
    var polygon;
    for (var i=0; i<this.numFaces; ++i) {
      polygon = this.polygons[i];
      polygon.computedColor = mea3D.Math.computeLighting(
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
      mea3D.Logging.log("Bounding surface radius: " + this.radius);      
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
      
        //mea3D.Logging.log("Center of gravity: " + centerOfGravity);
        
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
    mea3D.Logging.log("Bounding shape calculated : " + this.boundingShape);
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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Model3D = function(name, modelTemplate, transformation) {
    
  /*if (modelTemplate) {
    mea3D.Logging.info("Loading model template " + modelTemplate.name + " into model " + name);
  } else {
    mea3D.Logging.info("Creating empty model (" + name + ")");
  }*/
  
  this.name = name;
  this.transformation = transformation ? transformation : new mea3D.Transformation();
  
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
    //mea3D.Logging.info("Model (" + modelTemplate.name + ") loaded, " + this.numVertices + " vertices, " + this.numFaces + " faces.");
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
    //mea3D.Logging.log("Model transformation : " + this.transformation.toString());
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
    //mea3D.Logging.log("Mesh transformation : " + mesh.transformation);
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
    //mea3D.Logging.log("Bounding shape calculated : " + this.boundingShape);
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
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.KeyCodes = {
  KEYCODE_A: 65,
  KEYCODE_B: 66,
  KEYCODE_C: 67,
  KEYCODE_D: 68,
  KEYCODE_E: 69,
  KEYCODE_F: 70,
  KEYCODE_G: 71,
  KEYCODE_H: 72,
  KEYCODE_I: 73,
  KEYCODE_J: 74,
  KEYCODE_K: 75,
  KEYCODE_L: 76,
  KEYCODE_M: 77,
  KEYCODE_N: 78,
  KEYCODE_O: 79,
  KEYCODE_P: 80,
  KEYCODE_Q: 81,
  KEYCODE_R: 82,
  KEYCODE_S: 83,
  KEYCODE_T: 84,
  KEYCODE_U: 85,
  KEYCODE_V: 86,
  KEYCODE_W: 87,
  KEYCODE_X: 88,
  KEYCODE_Y: 89,
  KEYCODE_Z: 90,

  KEYCODE_UP: 38,
  KEYCODE_DOWN: 40,
  KEYCODE_LEFT: 37,
  KEYCODE_RIGHT: 39,

  KEYCODE_0: 48,
  KEYCODE_1: 49,
  KEYCODE_2: 50,
  KEYCODE_3: 51,
  KEYCODE_4: 52,
  KEYCODE_5: 53,
  KEYCODE_6: 54,
  KEYCODE_7: 55,
  KEYCODE_8: 56,
  KEYCODE_9: 57,

  KEYCODE_SPACE: 32,
  KEYCODE_PERIOD: 190
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

/**
* @constructor
*/
mea3D.Scene = function() {
  this.models = [];
  this.modelsHash = {};
  this.skyBox = null; // Skybox is the model which will always be drawn first
  
  this.lights = [];
  this.ambientColor = new mea3D.ColorRGBA(0, 0, 0);
  this.boundingShapes = [];
}

mea3D.Scene.prototype = {

  addModel:function(model) {
    if (model) {
      this.modelsHash[model.name] = model;
      this.models.push(model);
    }
  },
  getModelByName:function(name) {
    return this.modelsHash[name];
  },
  
  addLight:function(light) {
    if (light) {
      this.lights.push(light);
    }
  },
  
  addBoundingShape:function(shape) {
    this.boundingShapes.push(shape);
  },
  
  getLights:function() {
    return this.lights;
  },
  
  hitTestBoundingShape:function(lineOrigin, lineDirection) {
    var nearestBoundingShapeDistanceSquared = -1;
    var nearestBoundingShape = null;
    var boundingShape;
    for (var i=0; i<this.boundingShapes.length; ++i) {
      boundingShape = this.boundingShapes[i];
      var distanceSquared = mea3D.Math.distanceSquaredPointToLine(
        boundingShape.finalPosition,
        lineOrigin,
        lineDirection
      );
      //mea3D.Logging.log(">>>>>> BoundingShape" + i + " tested, distance: " + distanceSquared);
      
      if (distanceSquared<boundingShape.radiusSquared) {
        // We hit an object.
        //mea3D.Logging.log(">>>>>> HITTEST: Hit an object!");
        if (nearestBoundingShapeDistanceSquared==-1 ||
            distanceSquared<nearestBoundingShapeDistanceSquared) {
          nearestBoundingShapeDistanceSquared = distanceSquared;
          nearestBoundingShape = boundingShape;
          //mea3D.Logging.log(">>>>>> Minimum distance :" + nearestBoundingShapeDistanceSquared);
        }
      }
    }
    return nearestBoundingShape;
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

mea3D.RenderModes = {
  RENDER_NONE:0,
  RENDER_POINTS:1,
  RENDER_WIREFRAMES:2,
  RENDER_FACES:3
};

/** @constructor 
*/
mea3D.RenderStats = function() {
  this.verticesRendered = 0;
  this.polygonsRendered = 0;
  this.framesRendered = 0;
}

/** @constructor 
*/
mea3D.Canvas2DRenderer = function(canvas, viewport, options, renderStats) {
  this.canvas = canvas;
  this.viewport = viewport;
  this.options = options;
  
  this.context = null;
  this.sceneProjection = null;
  this.renderStats = renderStats;
  this.currentStrokeColor = new mea3D.ColorRGBA();
  this.currentFillColor = new mea3D.ColorRGBA();
}
mea3D.Canvas2DRenderer.prototype = {

  init:function() {
    // TODO: IE 9 will fail here if DOCTYPE is not standards. Check it here.
    if (!(this.canvas.getContext)) {
      return false;
    }
    this.context = this.canvas.getContext("2d");
    if (!this.context) {
      throw "Error creating 2D context";
    }
    this.context.lineWidth = 2;
    this.sceneProjection = new mea3D.SceneProjection(this.options, this.viewport, this.renderStats);
  },
  
  setStrokeColor:function(color) {
    if (!this.currentStrokeColor.equals(color)) {
      this.context.strokeStyle = color.toString();
      this.currentStrokeColor = color;
    }
  },
  
  setFillColor:function(color) {
    if (!this.currentFillColor.equals(color)) {
      this.context.fillStyle = color.toString();
      this.currentFillColor = color;
    }
  },
  
  drawRect:function(x, y, w, h, color) {
    if (color) {
      this.setFillColor(color);
    }
    this.context.fillRect(x, y, w, h);
  },
  
  drawLine2D:function(x1,y1, x2,y2, color, lineWidth) {
      
    if (color) { 
      this.setStrokeColor(color);
    }
    if (lineWidth) {
      this.context.lineWidth = lineWidth;
    }   
    this.context.beginPath();
    this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    this.context.stroke();
    this.context.closePath();    
  },
  
  drawLine:function(v1, v2, color, lineWidth) {
    var p1 = this.sceneProjection.project(v1);
    var p2 = this.sceneProjection.project(v2);
    if (!p1 || !p2) return;
    
    var z1 = p1.copy();
    var z2 = p2.copy();
    function adjustVector(v, vOrg) {
      if (v.z<0) {
        // Doesnt work :(
        v.x = v.x * v.z;
        v.y = v.y * v.z;
      }
    }
    // Adjust the points if their z coordinate is negative:
    adjustVector(z1, v1);
    adjustVector(z2, v2);

    //mea3D.Logging.log("P1:  " + p1, LOG_ERROR);
    //mea3D.Logging.log("Z 1: " + z1, LOG_ERROR);
    //mea3D.Logging.log("P2:  " + p2, LOG_ERROR);
    //mea3D.Logging.log("Z 2: " + z2, LOG_ERROR);

    this.drawLine2D(p1.x, p1.y, p2.x, p2.y, color, lineWidth);
    this.drawRect(p1.x-3,p1.y-3, 6,6, new mea3D.ColorRGBA(1,0,0));
    this.drawRect(p2.x-3,p2.y-3, 6,6, new mea3D.ColorRGBA(0,1,1));
        
    /*this.drawLine2D(z1.x, z1.y, z2.x, z2.y, "#0F0");
    this.drawRect(z1.x-3, z1.y-3, 6,6, "#ff0");
    this.drawRect(z2.x-3, z2.y-3, 6,6, "#0ff");*/
  },
  
  drawPoint2D:function(x, y, color) {
    this.drawRect(x-2, y-2, 4, 4, color);
  },
  
  drawPoint:function(point, color) {  
    var p = this.sceneProjection.project(point);
    if (!p) {
      return;
    }
    // TODO: expand this here:
    this.drawPoint2D(p.x, p.y, color);
  },
  
  drawPolygon2D:function(v1,v2,v3,v4, color, img) {
    if (color) { 
      this.setFillColor(color);
    }    
    
    // Ignore img parameter
    
    /*// Scale the vertices so that there is no gap between polygons:
    var edge1 = v2.subt(v1);
    var edge2 = v3.subt(v2);
    var scaler = 1.05;
    if (v4) {
      var edge3 = v4.subt(v3);        
      var newV1 = v2.add(edge1.scale(-scaler));
      var newV2 = v1.add(edge1.scale(scaler));
      var newV3 = v2.add(edge2.scale(scaler));
      var newV4 = v3.add(edge3.scale(scaler));
      v1 = newV1;
      v2 = newV2;
      v3 = newV3;
      v4 = newV4;

    } else {
      var newV1 = v2.add(edge1.scale(-scaler));
      var newV2 = v1.add(edge1.scale(scaler));
      var newV3 = v2.add(edge2.scale(scaler));
      v1 = newV1;
      v2 = newV2;
      v3 = newV3;
    }
    */
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(v1.x, v1.y);
    this.context.lineTo(v2.x, v2.y);
    this.context.lineTo(v3.x, v3.y);
    if (v4) this.context.lineTo(v4.x, v4.y);
    this.context.fill();
    //this.context.stroke();
    this.context.closePath();
  },
  
  renderText2D:function(text, position, fontSize, color) {
    if (color) {
      this.setFillColor(color);
    }
    if (fontSize) {
      this.context.font = fontSize + "pt Arial";
    }
    this.context.fillText(text, position.x, position.y);
  },
  
  // Renders text in 3d
  renderText:function(text, position, fontSize, color) {
    if (color) {
      this.setFillColor(color);
    }
    if (fontSize) {
      this.context.font = fontSize + "pt Arial";
    }
    var projected = this.sceneProjection.project(position);
    this.context.fillText(text, projected.x, projected.y);
  },
  
    // Draw a 2D circle at the given point and radius
  renderCircle2D:function(position, radius, color) {
    //mea3D.Logging.log("Rendering surface at : " + position + ", radius: " + radius);
    if (color) {
      this.setFillColor(color);
    }
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius, 0, Math.PI*2, true);
    this.context.closePath();
    //this.context.fill();
    this.context.stroke();
  },
  
  drawScene:function(scene) {
    this.sceneProjection.drawScene(scene);
  },
  
  begin:function() {
  },
  end:function() {
  },
  
  clear:function() {
    this.drawRect(
      0,0,
      this.viewport.width, 
      this.viewport.height, 
      this.options.clearColor
    );
    this.sceneProjection.clear();
  },
  
  renderPolygon:function(v1, v2, v3, v4, color, texture) {
    
    switch (this.options.renderMode) {
    
      case mea3D.RenderModes.RENDER_FACES:
        // Draw faces
        this.drawPolygon2D(v1,v2,v3,v4, color, 
          (texture && texture.image)? texture.image:null
        );
        break;
            
      case mea3D.RenderModes.RENDER_WIREFRAMES:      
        // Draw wireframes
        if (v4) { // 4 lines
          this.drawLine2D(v1.x, v1.y, v2.x, v2.y, color);
          this.drawLine2D(v2.x, v2.y, v3.x, v3.y);  // no need to set color again
          this.drawLine2D(v3.x, v3.y, v4.x, v4.y);
          this.drawLine2D(v4.x, v4.y, v1.x, v1.y);     
          
        } else {
        // triangle
          this.drawLine2D(v1.x, v1.y, v2.x, v2.y, color);
          this.drawLine2D(v1.x, v1.y, v3.x, v3.y); // no need to set color again
          this.drawLine2D(v2.x, v2.y, v3.x, v3.y);     
        }
        break;
      
      case mea3D.RenderModes.RENDER_POINTS:
        // TODO: Add z-order checking to points and lines:
        // Draw points
        this.drawPoint2D(v1.x, v1.y, color);
        this.drawPoint2D(v2.x, v2.y); // no need to set color again
        this.drawPoint2D(v3.x, v3.y);      
        if (v4) this.drawPoint2D(v4.x, v4.y);
        break;
    }
  },

  render:function() {
    
    // Render the buffer (draw farthest first)
    var renderBuffer = this.sceneProjection.renderBuffer;
    var faceCount = renderBuffer.length;
    for (var i=faceCount-1; i>=0; i--) {
      var polygon = renderBuffer[i];
      
      switch (polygon.type) {
      
        case mea3D.RenderableType.POLYGON:
           // 2D mea3D.Polygon
          this.renderPolygon(
            polygon.projectedVertices.v1,
            polygon.projectedVertices.v2,
            polygon.projectedVertices.v3,
            polygon.projectedVertices.v4,
            polygon.computedColor,
            (polygon.material && polygon.material.texture) ? polygon.material.texture:null
          );
          break;
        
        case mea3D.RenderableType.SURFACE:
          // 2D Surface
          this.renderCircle2D(polygon.position, polygon.radius, polygon.color);
          break;
        
        case mea3D.RenderableType.TEXT:
          // Text mesh
          this.renderText2D(polygon.text, polygon.position, polygon.fontSize, polygon.color);
          break;
      }
    }  
    this.renderStats.polygonsRendered = faceCount;
    this.renderStats.framesRendered++;
  },
 
  setTransformMatrix:function(matrixTransform) {
    this.sceneProjection.setTransformMatrix(matrixTransform);
  }
}

/** @constructor 
*/
mea3D.SceneProjection = function(options, viewport, renderStats) {
  this.renderBuffer = [];
  this.renderStats = renderStats;
  this.viewport = viewport;
  this.options = options;
};

mea3D.SceneProjection.prototype = {
  
  clear:function() {
    this.renderBuffer = [];
    this.renderStats.verticesRendered = 0;
  },
  
  drawSurfaceMesh:function(mesh, lights, ambientColor) {
    // TODO: Ugly, refactor.
    // Here we are drawing a circle for a sphere.
    // Draw a 3D Sphere
    var projected = mea3D.Math.transformPoint(mesh.finalTransformation.position, this.matrixTransform);
    projected.x /= (projected.z);
    projected.y /= (projected.z);
    
    // Transform into viewport coords
    projected.x = ((projected.x * this.viewport.width)  / 2.0) + this.viewport.width/2;
    projected.y = -((projected.y * this.viewport.height)/ 2.0) + this.viewport.height/2;    

    var radiusVector = mesh.finalTransformation.position.add(new mea3D.Vector3(0, mesh.radius, 0));
    var projectedRadius = mea3D.Math.transformPoint(radiusVector, this.matrixTransform);
    projectedRadius.x /= projectedRadius.z;
    projectedRadius.y /= projectedRadius.z;
    
    projectedRadius.x =  ((projectedRadius.x * this.viewport.width) / 2.0) + this.viewport.width/2;
    projectedRadius.y = -((projectedRadius.y * this.viewport.height)/ 2.0) + this.viewport.height/2;    
    
    var projectedRadius2 = new mea3D.Vector2(projected.x-projectedRadius.x, projected.y-projectedRadius.y);      
    var radius = projectedRadius2.mag();
    
    // Draw a circle with the projected position and radius.
    // TODO: Make this work with wireframe mode too.
    this.renderBuffer.push({
      position:projected,
      // TODO: FIX THIS IMMEDIATELY:
      //radius:radius*mesh.parent.transformation.scaling.x * mesh.transformation.scaling.x, // <<== Not only x should be here
      radius: radius,
      color:new mea3D.ColorRGBA(1,1,0),
      type: mea3D.RenderableType.SURFACE,
      projectedCenter:projected
    });
  },
  
  drawTextMesh:function(mesh, lights, ambientColor) {
    // TODO: Ugly, refactor.
    mesh.fontSize = 1;
    
    var projected = mea3D.Math.transformPoint(mesh.finalTransformation.position, this.matrixTransform);
    projected.x /= (projected.z);
    projected.y /= (projected.z);
    
    // Transform into viewport coords
    projected.x =  ((projected.x * this.viewport.width) / 2.0) + this.viewport.width/2;
    projected.y = -((projected.y * this.viewport.height)/ 2.0) + this.viewport.height/2;    
    
    // TODO: Fix!
    var radiusVector = mesh.finalTransformation.position.add(new mea3D.Vector3(0, mesh.fontSize*mesh.finalTransformation.scaling.x, 0));
    var projectedRadius = mea3D.Math.transformPoint(radiusVector, this.matrixTransform);
    projectedRadius.x /= projectedRadius.z;
    projectedRadius.y /= projectedRadius.z;
    
    projectedRadius.x = ((projectedRadius.x * this.viewport.width)  /2.0) + this.viewport.width/2;
    projectedRadius.y = -((projectedRadius.y * this.viewport.height)/2.0) + this.viewport.height/2;    
    
    var projectedRadius = new mea3D.Vector2(projected.x-projectedRadius.x, projected.y-projectedRadius.y);      
    var radius = projectedRadius.mag();
    
    this.renderBuffer.push({
      position: projected,
      text:     mesh.text,
      fontSize: radius,
      color:    mesh.material.ambientColor,
      type:     mea3D.RenderableType.TEXT,
      projectedCenter:projected
    });
  },
  
  drawMesh:function(mesh, lights, ambientColor) {
    switch (mesh.type) {
      case mea3D.MeshType.MESH_POLYGON:
        this.drawPolygonMesh(mesh, lights, ambientColor);
        break;
      
      case mea3D.MeshType.MESH_SURFACE:
        this.drawSurfaceMesh(mesh, lights, ambientColor);
        break;
            
      case mea3D.MeshType.MESH_TEXT:
        this.drawTextMesh(mesh, lights, ambientColor);
        break;
    }
  },
  
  
  setTransformMatrix:function(matrixTransform) {
    this.matrixTransform = matrixTransform;
  },
  
  drawPolygonMesh:function(mesh, lights, ambientColor) {
  
    // Project all vertices:
    mesh.updateCentersAndNormals();
    mesh.projectVertices(
      this.matrixTransform, 
      this.viewport.width,
      this.viewport.height
    );
    
    this.renderStats.verticesRendered += mesh.vertices.length;
    this.drawPolygonList(mesh.polygons, lights, ambientColor);
  },
  
  drawPolygonList:function(polygonList, lights, ambientColor) {
      
    // Loop through the face indices
    var numFaces = polygonList.length;    
    for (var i=0; i<numFaces; ++i) {
      
      var polygon = polygonList[i];      
      var p1 = polygon.projectedVertices.v1;
      var p2 = polygon.projectedVertices.v2;
      var p3 = polygon.projectedVertices.v3;
      var p4 = polygon.projectedVertices.v4;
      
      if (p1.z<0 || p2.z<0 || p3.z<0 || (polygon.vertexCount==4 && p4.z<0)) {
        continue;
      }
      
      // Backface culling:
      if (this.options.backfaceCulling) {
        var a1 = p1.subt(p2);
        var a2 = p1.subt(p3);
        var b1 = new mea3D.Vector3(a1.x, a1.y, 0);
        var b2 = new mea3D.Vector3(a2.x, a2.y, 0);
        var cross = b1.cross(b2);
        if (cross.z<0) {
          continue;
        }
      }
      
      // Calculate center for z-sorting:
      polygon.projectedCenter = mea3D.Math.getFaceCenter(
        polygon.projectedVertices.v1,
        polygon.projectedVertices.v2,
        polygon.projectedVertices.v3,
        polygon.projectedVertices.v4
      );
      
      // Compute lighting
      if (polygon.material) {
        polygon.computedColor = mea3D.Math.computeLighting(
          polygon.transformedCenter,
          polygon.transformedNormal,
          polygon.material,
          lights,
          ambientColor
        );
      }      
      // Add the computed polygon to render buffer.
      this.renderBuffer.push(polygon);   
    }
  },
  
  drawModel:function(model, lights, ambientColor) {
    for (var i=0; i<model.meshList.length; i++) {
      this.drawMesh(model.meshList[i], lights, ambientColor);
    }
  },
  
  sortFunction:function(a, b) {
    // Sort ascending on vertex.z
    return a.projectedCenter.z-b.projectedCenter.z;
  },
  
  drawScene:function(scene) {
    // Draw 3D models
    for (var i=0; i<scene.models.length; i++) {
      this.drawModel(scene.models[i], scene.lights, scene.ambientColor);
    }
    
    //this.drawLights(scene.lights);
    //this.drawCrossHair();
    //this.renderAxes();
    /*if (mea3D.RenderUtils) {
      if (scene.raceTrack) {
        mea3D.RenderUtils.renderSplineMesh(this, scene.raceTrack);
      }
      if (scene.HeightMap) {
        mea3D.RenderUtils.renderHeightMap(this, scene.HeightMap);
      }
    }*/
    
    // Sort buffer by z coordinates (painters algorithm)
    this.renderBuffer.sort(this.sortFunction);
    
    // We always draw the skyBox first so that it's always in the background.
    if (scene.skyBox) {
      this.drawModel(scene.skyBox, scene.lights, scene.ambientColor);
    }
  },
  
  project:function(point) {
    // Direct3D style projection
    var projected = mea3D.Math.transformPoint(point, this.matrixTransform);   
    projected.x /= (projected.z);
    projected.y /= (projected.z);
    
    projected.x =  ((projected.x * this.viewport.width) / 2.0) + this.viewport.width/2;
    projected.y = -((projected.y * this.viewport.height)/ 2.0) + this.viewport.height/2;
    
    return projected;
  }
}


/**
* @constructor
*/
mea3D.Renderer = function(container, options) {

  if (!container) {
    return false;
  }
  this.container = container;
  
  var defaultOptions = { 
    width:          800,                              // viewport height
    height:         600,                              // viewport width
    backfaceCulling:true,                             // backface culling
    clearColor:     new mea3D.ColorRGBA(0,0,0),       // color with which we clean the screen
    renderMode:     mea3D.RenderModes.RENDER_FACES,   // render mode
    enableMouseNavigation:true,                       // should enable mouse navigation?
    cameraPosition:  new mea3D.Vector3(0,0,0),        // initial camera position
    cameraDirection: new mea3D.Vector3(0,0,1),        // initial camera direction
    cameraUpVector:  new mea3D.Vector3(0,1,0),        // initial camera up vector
    
    fovHorizontal:   Math.PI/3,                       // horizontal field of view
    aspectRatio:     this.width/this.height,          // viewport aspect ratio
    fovVertical:     Math.PI/(this.aspectRatio)       // vertical field of view
  };
  // Get the options
  this.options = mea3D.getOptions(options, defaultOptions);
  this.options.aspectRatio = (this.options.width/this.options.height);  
  // Calculate vertical fov using aspect ratio if it's not given
  if (!this.options.fovVertical) {
    this.options.fovVertical = this.options.fovHorizontal/this.options.aspectRatio;
  }
  // Create the viewport
  this.viewport = new mea3D.ViewPort(
    0, 0, // left and top coords
    this.options.width,
    this.options.height, 
    0.1, 100000 // near and far planes
  );  
  // Create the camera
  this.camera = new mea3D.Camera(
    this.options.cameraPosition.copy(),
    this.options.cameraDirection.norm(),    
    this.options.cameraUpVector,
    this.options.fovHorizontal,       // horizontal field of view
    this.options.fovVertical          // vertical field of view
  );
  // Set container width and heights  
  this.container.style.width  = this.viewport.width  + "px";
  this.container.style.height = this.viewport.height + "px";  
  
  this.renderStats = new mea3D.RenderStats();
  this.initialized = false;
  this.init();    
  this.reset();
};

mea3D.Renderer.prototype = {
  
  init:function() {
  
    this.canvas = mea3D.Utils.getCanvasElement(this.container);
    
    if (!this.canvas) {
      this.canvas = mea3D.Utils.createCanvas(this.container, this.viewport.width, this.viewport.height);
      //mea3D.Logging.log("Created: Width, Height: " + this.canvas.width + "," + this.canvas.height);
    }
    
    // TODO: IE 9 will fail here if DOCTYPE is not standards. Check it here.
    /*if (!(this.canvas.getContext)) {
      return false;
    }*/
    
    this.context = new mea3D.Canvas2DRenderer(this.canvas, this.viewport, this.options, this.renderStats);
    this.context.init();
    this.initialized = true;
    return true;
  },
  
  isInitialized:function() {
    return this.initialized;
  },
  
  reset:function() {    
    if (!(this.isInitialized())) {
      return false;
    }
    // Transformations:
    this.worldTransform = new mea3D.Matrix4(); // identity
    this.updateProjectionMatrix();
    this.updateTransformMatrix(); 

    // List of projected polygons
    //this.renderBuffer = []; // This is calcuated every frame. Used to sort polys.
  },
  
  updateProjectionMatrix:function() {
    this.projectionTransform = mea3D.Math.getProjectionMatrix4(
      this.viewport.zNear, 
      this.viewport.zFar, 
      this.camera.getFovHorizontal(), 
      this.camera.getFovVertical()
    );
  },
  
  updateTransformMatrix:function() {
  
    // Update camera matrix
    this.camera.update();
    
    // Update Direct3D-ish transform matrices
    this.matrixWorldView = mea3D.Math.mult4(
      this.worldTransform,
      this.camera.getViewTransform()
    );
    this.matrixTransform = mea3D.Math.mult4(
        this.matrixWorldView,
        this.projectionTransform        
    );

    // Update perspective projection matrix
    this.screenProjectionMatrix = mea3D.Math.getScreenProjectionMatrix4(
      0,0, 
      this.viewport.width, this.viewport.height, 
      this.viewport.zNear, this.viewport.zFar
    );

    this.context.setTransformMatrix(this.matrixTransform);
  },
  
  setStrokeColor:function(color) {
    this.context.setStrokeColor(color);
  },
  setFillColor:function(color) {
    this.context.setFillColor(color);
  },
  
  drawRect:function(x, y, w, h, color) {
    this.context.drawRect(x, y, w, h, color);
  },
  
  drawLine2D:function(x1,y1, x2,y2, color, lineWidth) {
    this.context.drawLine2D(x1,y1, x2,y2, color, lineWidth);   
  },
  
  drawLine:function(v1, v2, color, lineWidth) {
    this.context.drawLine(v1, v2, color, lineWidth);
  },  
  
  drawPoint2D:function(x, y, color) {
    this.context.drawPoint2D(x, y, color);
  },
  
  drawPoint:function(point, color) {
    this.context.drawPoint(point, color);
  },  
  
  drawPolygon2D:function(v1,v2,v3,v4, color, img) {
    this.context.drawPolygon2D(v1,v2,v3,v4, color, img);
  },

  
  renderText2D:function(text, position, fontSize, color) {
    this.context.renderText2D(text, position, fontSize, color);
  },
  
  // Renders text in 3d
  renderText:function(text, position, fontSize, color) {
    this.context.renderText(text, position, fontSize, color);
  },
  
  // Draw a 2D circle at the given point and radius
  renderCircle2D:function(position, radius, color) {
    this.context.renderCircle2D(position, radius, color);
  },

  drawCrossHair:function(w, h) {
    w = w || 10;
    h = h || 10;
    var halfWidth = this.viewport.width/2;
    var halfHeight = this.viewport.height/2;
    this.drawLine2D(halfWidth-w, halfHeight, halfWidth+w, halfHeight,  new mea3D.ColorRGBA(1,1,0));
    this.drawLine2D(halfWidth, halfHeight-h, halfWidth, halfHeight+10, new mea3D.ColorRGBA(1,1,0));
  },
  
  renderAxes:function() {
    // Draw axes
    this.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(4,0,0), new mea3D.ColorRGBA(0,1,1));     // x axis
    this.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(0,0,4), new mea3D.ColorRGBA(1,1,0));     // z axis
    this.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(0,4,0), new mea3D.ColorRGBA(1,0,1));     // y axis
    this.renderText("+X", new mea3D.Vector3(5,0,0), new mea3D.ColorRGBA(1,1,1));
    this.renderText("+Z", new mea3D.Vector3(0,0,5));
    this.renderText("+Y", new mea3D.Vector3(0,5,0));
  },
  
  clear:function() {
    this.context.clear();
  },
  
  drawLights:function(lights) {
    // Draw lights:
    for (var i=0; i<lights.length; i++) {
      if (lights[i].position) { // Some lights dont have a position vector (i.e. ambient)        
        this.drawPoint(lights[i].position, lights[i].color);
      }
    }    
  },
  
  /*updateLighting:function(scene) {
  
    if (scene.models) {
      // Re-compute lights for all vertices:
      for (var i=0; i<scene.models.length; ++i) {
        var model = scene.models[i];
        for (var j=0; j<model.meshList.length; ++j) {
          var mesh = model.meshList[j];
          mesh.calculateLighting(scene.lights, scene.ambientColor);
        }
      }
    }
  },*/
  
  update:function(scene) {

    this.clear();
    
    this.context.begin();
    
    this.context.drawScene(scene);
    
    this.context.render();
    /*
    if (this.context.draw) {
      this.context.draw();  // For custom 2D renderer
    }*/
    
    this.context.end();
  },
  
  screenToViewportCoords:function(screenX, screenY) {
    // Calculate mouse positions
    var halfWidth = this.viewport.width/2;
    var halfHeight= this.viewport.height/2;
    var x = (screenX - halfWidth) /halfWidth;
    var y = (screenY - halfHeight)/halfHeight;
    return new mea3D.Vector2(x,y);
  },
  /*
  // Input handling
  onMouseMove:function(screenX, screenY) {
  
    if (screenX==this.prevMouseX && screenY==this.prevMouseY)
      return true;
    
    if (!(this.options.enableMouseNavigation))
      return true;
          
    var viewportCoords = this.screenToViewportCoords(screenX, screenY);
    var prevCoords = this.screenToViewportCoords(this.prevMouseX, this.prevMouseY);
    var deltaCoords = viewportCoords.subt(prevCoords);
    
    this.camera.moveByMouseDelta(deltaCoords.x, deltaCoords.y);
    this.updateTransformMatrix();    

    this.prevMouseX = screenX;
    this.prevMouseY = screenY;
    
    this.update();
    // TEST: Mouse hit test:
    this.getMouseSelection(screenX, screenY);
    
    return false;
  },
  */
  
  // Make mesh emitColor yellow:
  highlightMesh:function(mesh, enableHighlight) {
    if (mesh && mesh.material) {
      mesh.material.enableEmitColor = enableHighlight;
    }
  },
  
  // Get mouse selection for the given point
  getMouseSelection:function(scene, mouseX, mouseY) {
    var boundingShape = this.hitTestBoundingShapes(scene, mouseX, mouseY);
    if (boundingShape) {
      if (this.prevSelectedShape != boundingShape) {
        if (this.prevSelectedShape)
          this.highlightMesh(this.prevSelectedShape.ownerMesh, false); // de-highlight previous mesh
          
        this.highlightMesh(boundingShape.ownerMesh, true); // highlight new mesh
                
        // Callback functions
        if (boundingShape.onMouseOver) {
          boundingShape.onMouseOver(boundingShape);
        }
        if (this.prevSelectedShape && this.prevSelectedShape.onMouseOut) {
          this.prevSelectedShape.onMouseOut(this.prevSelectedShape);
        }
        
        this.prevSelectedShape = boundingShape;
        mea3D.Logging.log("A new mesh is selected");
      }
    } else { // Nothing is selected
    
      if (this.prevSelectedShape) {
        this.highlightMesh(this.prevSelectedShape.ownerMesh, false); // de-highlight previous mesh
        
        if (this.prevSelectedShape.onMouseOut) {
          this.prevSelectedShape.onMouseOut(this.prevSelectedShape);
        }
      }
      this.prevSelectedShape = null; // no mesh is selected
    }
    return boundingShape;
  },

  // TODO: Refactor
  hitTestBoundingShapes:function(scene, x,y) {
      
    // Direction of the ray from eye position to given pixel's 3D position
    var pixelDirectionVector = mea3D.Math.getPixelDirectionVector(
      this.viewport.width, this.viewport.height, 
      x,y,
      this.camera.getFovHorizontal(), this.camera.getFovVertical(),  // TODO: Include fov in calculations.
      this.camera.getEyeDir(), this.camera.getUpVector(), this.camera.getLeftVector()
    ).norm();
    
    var lineOrigin = this.camera.getEyePos();
    var lineDirection = pixelDirectionVector;
    var lineEnd = lineOrigin.add(lineDirection.scale(1,1,1));
    // Draw mouse line:
    //this.drawLine(lineOrigin, lineEnd);
    
    var nearestBoundingShape = scene.hitTestBoundingShape(
      lineOrigin, lineDirection
    );
    return nearestBoundingShape;
  },
  
  getCamera:function() {
    return this.camera;
  },
  getCanvas:function() {
    return this.canvas;
  }
};
// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

// Frames Per Second Calculator
/**
* @constructor
*/
mea3D.FPSCalculator = function() {
  
  this.currentTime = new Date();
  this.startTime = this.currentTime;
  this.lastFPSCalculationTime = 0;
  this.fps = 0;
  this.numFrames = 0;
}

mea3D.FPSCalculator.prototype = {

  update:function() {
    
    this.currentTime = new Date();
    this.numFrames++;
    
    // Upte the FPS every 100 ms.
    var elapsedTime = (this.currentTime-this.startTime)/1000.0; // seconds      
    if ((this.currentTime-this.lastFPSCalculationTime)>100) {        
      this.fps = (this.numFrames/elapsedTime);
      this.lastFPSCalculationTime = this.currentTime;
    }    
    // Re-calculate FPS every 2 seconds:
    if (elapsedTime>2) {
      this.numFrames = 0;
      this.startTime = this.currentTime;      
    }    
  }  
  /*getFPS:function() {
    return this.fps;
  }*/
};
