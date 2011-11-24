// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

mea3D.RenderModes = {
  RENDER_NONE:0,
  RENDER_POINTS:1,
  RENDER_WIREFRAMES:2,
  RENDER_FACES:3
};

/**
* @constructor
*/
mea3D.Renderer = function(container, options) {

  if (!container) return false;
  this.container = container;
  
  var defaultOptions = { 
    width:          800,                        // viewport height
    height:         600,                        // viewport width
    backfaceCulling:true,                       // backface culling
    clearColor:     new mea3D.ColorRGBA(0,0,0),       // color with which we clean the screen
    renderMode:     mea3D.RenderModes.RENDER_FACES,  // render mode
    enableMouseNavigation:true,                // should enable mouse navigation?
    cameraPosition:  new mea3D.Vector3(0,0,0),       // initial camera position
    cameraDirection: new mea3D.Vector3(0,0,1),       // initial camera direction
    cameraUpVector:  new mea3D.Vector3(0,1,0),       // initial camera up vector
    
    fovHorizontal:   Math.PI/3,                 // horizontal field of view
    aspectRatio:     this.width/this.height,    // viewport aspect ratio
    fovVertical:     Math.PI/(this.aspectRatio) // vertical field of view
  };
  // Get the options
  this.options = mea3D.getOptions(options, defaultOptions);
  this.options.aspectRatio = (this.options.width/this.options.height);  
  // Calculate vertical fov using aspect ratio if it's not given
  if (!this.options.fovVertical) {
    this.options.fovVertical = this.options.fovHorizontal/this.options.aspectRatio;
  }
  // Create the viewport
  this.viewport = new mea3D.ViewPort(0, 0, // left and top coords
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
  
  this.numFramesRendered = 0;
  this.initiated = false;
  this.init();    
  this.reset();
  this.currentStrokeColor = new mea3D.ColorRGBA();
  this.currentFillColor = new mea3D.ColorRGBA();

};

mea3D.Renderer.prototype = {
  
  init:function() {
  
    this.canvas = mea3D.Utils.getCanvasElement(this.container);
    
    //this.canvas = this.container.getElementsByTagName("canvas")[0];
    if (!this.canvas) {
      this.canvas = mea3D.Utils.createCanvas(this.container, this.viewport.width, this.viewport.height);
      /*
      // Use excanvas for IE if it is available:
      if (typeof G_vmlCanvasManager!="undefined") {
        G_vmlCanvasManager.initElement(this.canvas);
        //this.canvas.setAttribute("width", this.viewport.width);
        //this.canvas.setAttribute("height", this.viewport.height);
        this.canvas.width = this.viewport.width;
        this.canvas.height = this.viewport.height;
      }*/
      //Logging.log("Created: Width, Height: " + this.canvas.width + "," + this.canvas.height);
    }
    
    // TODO: IE 9 will fail here if DOCTYPE is not standards. Check it here.
    if (!(this.canvas.getContext)) {
      return false;
    }
    this.context = this.canvas.getContext("2d");
    //this.context = new mea3D.Renderer2D(this.canvas);  // Uses our custom renderer (not working)
    this.context.lineWidth = 2;
    this.initiated = true;
    return true;
  },
  
 
  reset:function() {    
    if (!(this.initiated)) {
      return false;
    }
    // Transformations:
    this.worldTransform = new mea3D.Matrix4(); // identity
    this.updateProjectionMatrix();
    this.updateTransformMatrix(); 

    // List of projected polygons
    this.renderBuffer = []; // This is calcuated every frame. Used to sort polys.
  },
  
  updateProjectionMatrix:function() {
    this.projectionTransform = mea3D.Math.getProjectionMatrix4(
      this.viewport.zNear, 
      this.viewport.zFar, 
      this.camera.fovHorizontal, 
      this.camera.fovVertical
    );
  },
  
  updateTransformMatrix:function() {
  
    // Update camera matrix
    this.camera.update();
    
    // Update Direct3D-ish transform matrices
    this.matrixWorldView = mea3D.Math.mult4(
      this.worldTransform,
      this.camera.viewTransform
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
    var p1 = this.project(v1);
    var p2 = this.project(v2);
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

    //Logging.log("P1:  " + p1, LOG_ERROR);
    //Logging.log("Z 1: " + z1, LOG_ERROR);
    //Logging.log("P2:  " + p2, LOG_ERROR);
    //Logging.log("Z 2: " + z2, LOG_ERROR);

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
    var p = this.project(point);
    if (!p) return;
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

  renderPolygon:function(v1, v2, v3, v4, color, texture) {
    
    switch(this.options.renderMode) {
    
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
    var projected = this.project(position);
    this.context.fillText(text, projected.x, projected.y);
  },
  
  // Draw a 2D circle at the given point and radius
  renderCircle2D:function(position, radius, color) {
    //Logging.log("Rendering surface at : " + position + ", radius: " + radius);
    if (color) {
      this.setFillColor(color);
    }
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius, 0, Math.PI*2, true);
    this.context.closePath();
    //this.context.fill();
    this.context.stroke();
  },  
  
  
  drawSurfaceMesh:function(mesh) {
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
    
    var projectedRadius = new mea3D.Vector2(projected.x-projectedRadius.x, projected.y-projectedRadius.y);      
    var radius = projectedRadius.mag();
    
    // Draw a circle with the projected position and radius.
    // TODO: Make this work with wireframe mode too.
    this.renderBuffer.push(
      { position:projected,
        // TODO: FIX THIS IMMEDIATELY:
        //radius:radius*mesh.parent.transformation.scaling.x * mesh.transformation.scaling.x, // <<== Not only x should be here
        radius: radius,
        color:new mea3D.ColorRGBA(1,1,0),
        type: mea3D.RenderableType.SURFACE,
        projectedCenter:projected
      }
    );
  },
  
  drawTextMesh:function(mesh) {
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
         
    this.renderBuffer.push(
      { position: projected,
        text:     mesh.text,
        fontSize: radius,
        color:    mesh.material.ambientColor,
        type:     mea3D.RenderableType.TEXT,
        projectedCenter:projected
      }
    );
  },
  
  drawMesh:function(mesh) {    
    switch (mesh.type) {
      case mea3D.MeshType.MESH_POLYGON:
        this.drawPolygonMesh(mesh);
        break;      
      
      case mea3D.MeshType.MESH_SURFACE:
        this.drawSurfaceMesh(mesh);
        break;
            
      case mea3D.MeshType.MESH_TEXT:
        this.drawTextMesh(mesh);
        break
    }
  },
  
  drawPolygonMesh:function(mesh) {
  
    // Project all vertices:
    mesh.updateCentersAndNormals();
    mesh.projectVertices(
      this.matrixTransform, 
      this.viewport.width,
      this.viewport.height
    );
    
    var numVertices = mesh.vertices.length;
    this.numRenderedVertices += numVertices;
    
    this.drawPolygonList(mesh.polygons);
    //Logging.info("Transformed " + mesh.worldTransformedVertices.length + " points");
  },
  
  drawPolygonList:function(polygonList) {
      
    // Loop through the face indices
    var numFaces = polygonList.length;    
    for (var i=0; i<numFaces; ++i) {
      
      var polygon = polygonList[i];      
      var p1 = polygon.projectedVertices.v1;
      var p2 = polygon.projectedVertices.v2;
      var p3 = polygon.projectedVertices.v3;
      var p4 = polygon.projectedVertices.v4;
      
      if (p1.z<0 || p2.z<0 || p3.z<0 || (polygon.vertexCount==4 && p4.z<0))
        continue;
      
      // Backface culling:
      if (this.options.backfaceCulling) {
        var a1 = p1.subt(p2);
        var a2 = p1.subt(p3);
        var b1 = new mea3D.Vector3(a1.x, a1.y, 0);
        var b2 = new mea3D.Vector3(a2.x, a2.y, 0);
        var cross = b1.cross(b2);
        if (cross.z<0)
         continue;
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
          this.scene.lights,
          this.scene.ambientColor
        );
      }      
      // Add the computed polygon to render buffer.
      this.renderBuffer.push(polygon);   
    }
  },
  
  drawModel:function(model) {
    for (var i=0; i<model.meshList.length; i++) {
      this.drawMesh(model.meshList[i]);
    }
  },

  drawCrossHair:function(w,h) {
    w = w || 10;
    h = h || 10;
    var halfWidth = this.viewport.width/2;
    var halfHeight = this.viewport.height/2;
    this.drawLine2D(halfWidth-w, halfHeight, halfWidth+w, halfHeight,  new mea3D.ColorRGBA(1,1,0));
    this.drawLine2D(halfWidth, halfHeight-h, halfWidth, halfHeight+10, new mea3D.ColorRGBA(1,1,0));
  },
  
  sortFunction:function(a,b) {
    // Sort ascending on vertex.z
    return a.projectedCenter.z-b.projectedCenter.z;
  },
  
  render:function() {
    
    // Sort buffer by z coordinates (painters algorithm)
    this.renderBuffer.sort(this.sortFunction);
    
    // We always draw the skyBox first so that it's always in the background.
    if (this.scene.skyBox) {
      this.drawModel(this.scene.skyBox);
    }
    
    // Render the buffer (draw farthest first)
    var faceCount = this.renderBuffer.length;
    for (var i=faceCount-1; i>=0; i--) {
      var polygon = this.renderBuffer[i];
      
      switch(polygon.type) {
                
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
    this.numRenderedPolygons = faceCount;
    this.numFramesRendered++;
  },
  
  project:function(point) {
    // Direct3D style projection
    var projected = mea3D.Math.transformPoint(point, this.matrixTransform);   
    projected.x /= (projected.z);
    projected.y /= (projected.z);
    
    projected.x =  ((projected.x * this.viewport.width) / 2.0) + this.viewport.width/2;
    projected.y = -((projected.y * this.viewport.height)/ 2.0) + this.viewport.height/2;
    
    return projected;
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
    this.drawRect(
      0,0,
      this.viewport.width, 
      this.viewport.height, 
      this.options.clearColor
    );
    this.renderBuffer = [];
    this.numRenderedVertices = 0;
  },
  
  drawLights:function() {
    // Draw lights:
    for (var i=0; i<this.scene.lights.length; i++) {
      if (this.scene.lights[i].position) { // Some lights dont have a position vector (i.e. ambient)        
        this.drawPoint(this.scene.lights[i].position, this.scene.lights[i].color);
      }
    }    
  },
  
  /*updateLighting:function() {
  
    if (this.scene && this.scene.models) {
      // Re-compute lights for all vertices:
      for (var i=0; i<this.scene.models.length; ++i) {
        var model = this.scene.models[i];
        for (var j=0; j<model.meshList.length; ++j) {
          var mesh = model.meshList[j];
          mesh.calculateLighting(this.scene.lights, this.scene.ambientColor);
        }
      }
    }
  },*/
  
  update:function() {

    this.clear();                
    
    // Draw 3D models
    for (var i=0; i<this.scene.models.length; i++) {
      this.drawModel(this.scene.models[i]);
    }    
    
    //this.drawLights();
    //this.drawCrossHair();
    //this.renderAxes();    
    if (mea3D.RenderUtils) {    
      if (this.scene.raceTrack) {
        mea3D.RenderUtils.renderSplineMesh(this, this.scene.raceTrack);
      }
      if (this.scene.HeightMap) {
        mea3D.RenderUtils.renderHeightMap(this, this.scene.HeightMap);
      }
    }
    
    this.render();
    
    if (this.context.draw) {
      this.context.draw();  // For custom 2D renderer
    }
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
  getMouseSelection:function(mouseX, mouseY) {
    var boundingShape = this.hitTestBoundingShapes(mouseX, mouseY);
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
        Logging.log("A new mesh is selected");
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
  hitTestBoundingShapes:function(x,y) {
      
    // Direction of the ray from eye position to given pixel's 3D position
    var pixelDirectionVector = mea3D.Math.getPixelDirectionVector(
      this.viewport.width, this.viewport.height, 
      x,y,
      this.camera.fovHorizontal, this.camera.fovVertical,  // TODO: Include fov in calculations.
      this.camera.eyeDir, this.camera.upVector, this.camera.leftVector
    ).norm();
    
    var lineOrigin = this.camera.eyePos;
    var lineDirection = pixelDirectionVector;
    var lineEnd = lineOrigin.add(lineDirection.scale(1,1,1));
    // Draw mouse line:
    //this.drawLine(lineOrigin, lineEnd);
    
    var nearestBoundingShape = this.scene.hitTestBoundingShape(
      lineOrigin, lineDirection
    );
    return nearestBoundingShape;
  }
};

