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
