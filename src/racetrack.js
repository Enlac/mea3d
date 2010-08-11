// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.RaceTrackPoint = function(position, direction) {
  this.position = position;
  this.direction = direction;
};
/**
* @constructor
*/
mea3D.RaceTrackControlPoint = function(position, upVector) {
  this.position = position;
  this.upVector = upVector;
};
/**
* @constructor
*/
mea3D.RaceTrack = function(points) {
  
  if (points) this.points = points;
  this.buildMesh();
};

mea3D.RaceTrack.prototype = {

  buildMesh:function() {
    
    this.vertices = [];
    this.polygons = [];
    
    if (!this.points) { 
      return;
    }
    var stepDistance = 2;    
    for (var i=1; i<this.points.length+1; i++) {

      var p0 = this.points[i-1].position;
      var p1 = this.points[i%this.points.length].position;
      var p2 = this.points[(i+1)%this.points.length].position;
      var p3 = this.points[(i+2)%this.points.length].position;
      var dist = p2.subt(p1).mag();
      var curDist = 0;
      
      var upVector = new Vector3(0,1,0);
      while (curDist<dist) {
        
        var t = curDist/dist;        
        var curPoint = mea3D.Math.catmullRomSplinePos(p0,p1,p2,p3,t);
        var curTangent = mea3D.Math.catmullRomSplineTangent(p0,p1,p2,p3,t);
        this.vertices.push(new mea3D.RaceTrackPoint(curPoint, curTangent));
        
        var normalizedTangent = curTangent.norm();
        var forwardVector = normalizedTangent.scale(stepDistance);
        var sideVector = normalizedTangent.cross(upVector).norm();
        var frontLeft = curPoint.add(forwardVector).add(sideVector);
        var frontRight = curPoint.add(forwardVector).subt(sideVector);
        var backLeft = curPoint.add(sideVector);
        var backRight = curPoint.subt(sideVector);
        
        var v1 = new Vertex(backLeft.x,   backLeft.y,   backLeft.z);
        var v2 = new Vertex(frontLeft.x,  frontLeft.y,  frontLeft.z);
        var v3 = new Vertex(frontRight.x, frontRight.y, frontRight.z);
        var v4 = new Vertex(backRight.x,  backRight.y,  backRight.z);
        var polygon = new Polygon(mea3D.RenderableType.POLYGON, v1, v2, v3, v4);
        this.polygons.push(polygon);
        
        curDist += stepDistance;
      }
    }
    Logging.log("Racetrack loaded : " + this.points.length + " control points, " +
      this.vertices.length + " calculated points"
    );
  },  
};
