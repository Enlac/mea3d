// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Emre Acer

/** @constructor 
 *  @implements {mea3D.RendererContextInterface}
 *   
 *  Canvas 2D context that handles various rendering operations.
 *  
 */
mea3D.Canvas2DRendererContext = function(canvas, viewport, options, renderStats) {
  this.canvas = canvas;
  this.viewport = viewport;
  this.options = options;
  
  this.context = null;
  this.sceneProjection = null;
  this.renderStats = renderStats;
  this.currentStrokeColor = new mea3D.ColorRGBA(1,1,1);
  this.currentFillColor = new mea3D.ColorRGBA(0,0,0);
}
mea3D.Canvas2DRendererContext.prototype = {

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
    return true;
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
  
  drawRect2D:function(x, y, width, height, color) {
    if (color) {
      this.setFillColor(color);
    }
    this.context.fillRect(x, y, width, height);
  },
  
  /** Draws a line in 2D coordinates 
   *
   *  @param {number} x1               X coordinate of the starting point of line segment
   *  @param {number} y1               Y coordinate of the starting point of line segment
   *  @param {number} x2               X coordinate of the ending point of line segment
   *  @param {number} y2               Y coordinate of the ending point of line segment
   *  @param {mea3D.ColorRGBA=} color  Color of line segment, optional
   *  @param {number=} lineWidth       Line width used to draw the segment, optional
   */
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
  
  /** Draws a line in 3D coordinates
    *
   *  @param {mea3D.Vector3} v1        Starting point of line segment
   *  @param {mea3D.Vector3} v2        Ending point of line segment
   *  @param {mea3D.ColorRGBA=} color  Color of line segment, optional
   *  @param {number=} lineWidth       Line width used to draw the segment, optional
   *  @param {boolean=} drawEndPoints  If true, will draw the end points of the line, optional
   */
  drawLine:function(v1, v2, color, lineWidth, drawEndPoints) {
    var p1 = this.sceneProjection.project(v1);
    var p2 = this.sceneProjection.project(v2);
    if (!p1 || !p2) {
      return;
    }
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

    this.drawLine2D(p1.x, p1.y, p2.x, p2.y, color, lineWidth);
    if (drawEndPoints) {
      this.drawRect2D(p1.x-3,p1.y-3, 6,6, color);
      this.drawRect2D(p2.x-3,p2.y-3, 6,6, color);
    }
  },
  
  /** Draws a point in 2D
   *
   *  @param {number} x                X coordinate of the point
   *  @param {number} y                Y coordinate of the point
   *  @param {mea3D.ColorRGBA=} color  Color of the point, optional
   */
  drawPoint2D:function(x, y, color) {
    this.drawRect2D(x-2, y-2, 4, 4, color);
  },
  
  /** Draws a point in 3D
   *
   *  @param {mea3D.Vector3} point     Position of the point
   *  @param {mea3D.ColorRGBA=} color  Color of the point, optional
   */
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
    var projected = this.sceneProjection.project(position);
    this.renderText2D(text, projected, fontSize, color);
  },
  
  // Draw a 2D circle at the given point and radius
  renderCircle2D:function(position, radius, color) {
    if (color) {
      this.setFillColor(color);
    }
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius, 0, Math.PI*2, true);
    this.context.closePath();
    //this.context.fill();
    this.context.stroke();
  },
  
  clear:function() {
    this.drawRect2D(
      0,0,
      this.viewport.width, 
      this.viewport.height, 
      this.options.clearColor
    );
  },
  
  beginDraw:function() {
    this.sceneProjection.clear();
  },
  
  drawScene:function(scene) {
    this.sceneProjection.drawScene(scene);
  },
  
  endDraw:function() {
  },
  
  beginRender:function() {
  },
  
  render:function() {
    
    // Render the buffer (draw farthest first)
    var renderBuffer = this.sceneProjection.renderBuffer;
    var faceCount = renderBuffer.length;
    for (var i=faceCount-1; i>=0; i--) {
      
      var renderable = renderBuffer[i];
      
      switch (renderable.type) {
      
        case mea3D.RenderableType.POLYGON:
          // Draw faces
          this.drawPolygon2D(
            renderable.v1,
            renderable.v2,
            renderable.v3,
            renderable.v4,
            renderable.renderColor, 
            null
          );
          break;
        
        case mea3D.RenderableType.SURFACE:
          // 2D Surface
          this.renderCircle2D(renderable.position, renderable.radius, renderable.color);
          break;
        
        case mea3D.RenderableType.TEXT:
          // Text mesh
          this.renderText2D(renderable.text, renderable.position, renderable.fontSize, renderable.renderColor);
          break;
      }
    }  
    this.renderStats.polygonsRendered = faceCount;
    this.renderStats.framesRendered++;
  },
 
  endRender:function() {
  },
  
  // Projects and renders a polygon in 3D
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
        if (v4) {
          this.drawPoint2D(v4.x, v4.y);
        }
        break;
    }
  },
  
  setTransformMatrix:function(matrixTransform) {
    this.sceneProjection.setTransformMatrix(matrixTransform);
  },
  setProjectionMatrix:function(matrixProjection){
    // Nothing to do
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
    throw "not implemented";
    /*// TODO: Ugly, refactor.
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
    });*/
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
    
    var projectedRadius2 = new mea3D.Vector2(projected.x-projectedRadius.x, projected.y-projectedRadius.y);      
    var radius = projectedRadius2.mag();
    
    this.renderBuffer.push(new mea3D.Renderable2D.Text(
      projected,  // position
      projected,  // center
      mesh.text,  // text
      radius,     // fontsize
      mesh.material.ambientColor // renderColor
    ));
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
        polygon.computedColor = mea3D.Math.Util.computeLighting(
          polygon.transformedCenter,
          polygon.transformedNormal,
          polygon.material,
          lights,
          ambientColor
        );
      }
      
      // Add the computed polygon to render buffer.
      var renderable = new mea3D.Renderable2D.Quad(
        polygon.projectedVertices.v1,
        polygon.projectedVertices.v2,
        polygon.projectedVertices.v3,
        polygon.projectedVertices.v4,
        polygon.projectedCenter,
        polygon.computedColor);
      this.renderBuffer.push(renderable);
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
    if (!scene) {
      return;
    }
    // Draw 3D models
    if (scene.models) {
      for (var i=0; i<scene.models.length; i++) {
        this.drawModel(scene.models[i], scene.lights, scene.ambientColor);
      }
    }
    
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
