// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

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
      //mea3D.Logging.log("mea3D.Polygon " + i + ":" + mesh.polygons[i].projectedVertices.v1.toString());
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
      //mea3D.Logging.log("mea3D.Polygon " + i + ":" + mesh.polygons[i].projectedVertices.v1.toString());
      /*renderer.drawLine(mesh.polygons[i].v1.pos, mesh.polygons[i].v2.pos);
      renderer.drawLine(mesh.polygons[i].v2.pos, mesh.polygons[i].v3.pos);
      renderer.drawLine(mesh.polygons[i].v3.pos, mesh.polygons[i].v4.pos);
      renderer.drawLine(mesh.polygons[i].v4.pos, mesh.polygons[i].v1.pos);      
      */
    }
    renderer.drawPolygonList(heightMap.polygons);
  },
  
  drawLights:function(renderer, lights) {
    // Draw lights:
    if (lights) {
      for (var i=0; i<lights.length; i++) {
        if (lights[i].position) { // Some lights don't have a position vector (eg. ambient)        
          renderer.drawPoint(lights[i].position, lights[i].color);
        }
      }
    }
  },
  
  drawCrossHair:function(renderer, width, height, color) {
    // Draw a cross shaped cross hair in the middle of viewport
    width = width || 10;
    height = height || 10;
    color = color || new mea3D.ColorRGBA(1,1,0);
    var halfWidth = renderer.viewport.width/2;
    var halfHeight = renderer.viewport.height/2;
    renderer.drawLine2D(halfWidth-width, halfHeight, halfWidth+width, halfHeight,   color);
    renderer.drawLine2D(halfWidth, halfHeight-height, halfWidth, halfHeight+height, color);
  },
  
  renderAxes:function(renderer) {
    // Draw axes
    renderer.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(4,0,0), new mea3D.ColorRGBA(0,1,1));     // x axis
    renderer.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(0,0,4), new mea3D.ColorRGBA(1,1,0));     // z axis
    renderer.drawLine(new mea3D.Vector3(0,0,0), new mea3D.Vector3(0,4,0), new mea3D.ColorRGBA(1,0,1));     // y axis
    renderer.renderText("+X", new mea3D.Vector3(5,0,0), new mea3D.ColorRGBA(1,1,1));
    renderer.renderText("+Z", new mea3D.Vector3(0,0,5));
    renderer.renderText("+Y", new mea3D.Vector3(0,5,0));
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
};
