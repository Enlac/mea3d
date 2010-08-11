// Author: Mustafa Acer

/**
* @constructor
*/
function Vertex(x,y,z, nx,ny,nz, color) {
  this.pos = new Vector3(0,0,0);
  this.pos.x = x;
  this.pos.y = y;
  this.pos.z = z;
  
  this.normal = new Vector3(0,0,0);
  if (nx) this.normal.x = nx;
  if (ny) this.normal.y = ny;
  if (nz) this.normal.z = nz;
  
  // Seems like we cannot use vertex colors in HTML5 canvases, but anyways:
  this.color = (color)?color:"#fff";
}

Vertex.fromVector = function(vector) {
  return new Vertex(
    vector.x,
    vector.y,
    vector.z
  );
};
