// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.RenderUtils = {

  renderSplineMesh:function(renderer, mesh) {    
    for (var i=0; i<mesh.vertices.length; i++) {
      renderer.drawPoint(mesh.vertices[i].position);
      /*renderer.drawLine(mesh.vertices[i].position, 
        mesh.vertices[i].position.add(mesh.vertices[i].direction.norm())
      );*/
    }    
    for (var i=0; i<mesh.polygons.length; i++) {
      var polygon = mesh.polygons[i];
      polygon.material = null;
      polygon.projectedVertices.v1 = renderer.project(polygon.v1.pos);
      polygon.projectedVertices.v2 = renderer.project(polygon.v2.pos);
      polygon.projectedVertices.v3 = renderer.project(polygon.v3.pos);
      polygon.projectedVertices.v4 = renderer.project(polygon.v4.pos);
      //Logging.log("Polygon " + i + ":" + mesh.polygons[i].projectedVertices.v1.toString());
      /*renderer.drawLine(mesh.polygons[i].v1.pos, mesh.polygons[i].v2.pos);
      renderer.drawLine(mesh.polygons[i].v2.pos, mesh.polygons[i].v3.pos);
      renderer.drawLine(mesh.polygons[i].v3.pos, mesh.polygons[i].v4.pos);
      renderer.drawLine(mesh.polygons[i].v4.pos, mesh.polygons[i].v1.pos);      
      */
    }
    renderer.drawPolygonList(mesh.polygons);
  },
  
  renderHeightMap:function(renderer, heightMap) {  
    if (!heightMap) {
      return;
    }
    for (var i=0; i<heightMap.polygons.length; i++) {
      var polygon = heightMap.polygons[i];
      //polygon.material = null;
      polygon.projectedVertices.v1 = renderer.project(polygon.v1.pos);
      polygon.projectedVertices.v2 = renderer.project(polygon.v2.pos);
      polygon.projectedVertices.v3 = renderer.project(polygon.v3.pos);
      polygon.projectedVertices.v4 = renderer.project(polygon.v4.pos);
      //Logging.log("Polygon " + i + ":" + mesh.polygons[i].projectedVertices.v1.toString());
      /*renderer.drawLine(mesh.polygons[i].v1.pos, mesh.polygons[i].v2.pos);
      renderer.drawLine(mesh.polygons[i].v2.pos, mesh.polygons[i].v3.pos);
      renderer.drawLine(mesh.polygons[i].v3.pos, mesh.polygons[i].v4.pos);
      renderer.drawLine(mesh.polygons[i].v4.pos, mesh.polygons[i].v1.pos);      
      */
    }
    renderer.drawPolygonList(heightMap.polygons);
  }
};

