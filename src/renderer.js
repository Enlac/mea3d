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
        polygon.computedColor = mea3D.Math.Util.computeLighting(
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
    var pixelDirectionVector = mea3D.Math.Util.getPixelDirectionVector(
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
