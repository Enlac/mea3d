// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.RayTracer=function(container, options) {

  this.container = container;
  this.initiated = false;
  this.setOptions(options);
  this.initCanvas();
}

mea3D.RayTracer.prototype = {

  initCanvas:function() {
    if (!this.container) {
      return false;
    }
    
    this.canvas = this.container.getElementsByTagName("canvas")[0];
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("style", "border:1px solid blue;");
      this.container.appendChild(this.canvas);
    }
    if (!this.canvas || !(this.canvas.getContext)) {
      return false;
    }
    this.canvas.width  = this.width * this.pixelSize;
    this.canvas.height = this.height* this.pixelSize;    
    this.context = this.canvas.getContext("2d");
    this.initiated = true;
    return true;
  },

  setCallback:function(func) {
    this.callbackFunc = func;
  },
  setRenderFinishedCallback:function(func) {
    this.callbackRenderFinished = func;
  },
  
  setOptions:function(options) {
    var defaultOptions = { 
      width:320,
      height:240,
      pixelSize:2,
      clearColor:new ColorRGBA(1,0,0,0),
      calculateReflections:true,
      calculateShadows:true,
      subPixelsX:1,
      subPixelsY:1
    };
    this.options    = mea3D.getOptions(options, defaultOptions);
    this.width      = this.options.width;
    this.height     = this.options.height;
    this.clearColor = this.options.clearColor;
    this.pixelSize  = this.options.pixelSize;
    this.initCanvas();
  },
  
  setPixel:function(x,y,color) {
    for (var dy=0; dy<this.pixelSize; dy++) {
      for (var dx=0; dx<this.pixelSize; dx++) {
        var offset = 4*((this.pixelSize*this.width*(this.pixelSize*y+dy)+(this.pixelSize*x)+dx));
        this.imageData.data[offset]   = Math.floor(color.r * 255);
        this.imageData.data[offset+1] = Math.floor(color.g * 255);
        this.imageData.data[offset+2] = Math.floor(color.b * 255);
        this.imageData.data[offset+3] = Math.floor(color.a * 255);
      }
    }
  },

  addMeshToPolygonBuffer:function(mesh) {
    
    //if (!mesh) return;
    // Loop through the face indices
    var numFaces = mesh.numFaces;
    for (var i=0; i<numFaces; i++) {
      /*
      var vertexCount = mesh.faceIndices[i].length;
      // currently only triangles are supported:
      //if (vertexCount>3) {
      //  i+= (vertexCount-4);
      //  continue;
      //}
      
      var i0 = mesh.faceIndices[i][0];
      var i1 = mesh.faceIndices[i][1];
      var i2 = mesh.faceIndices[i][2];      
      var i3 = (vertexCount==4) ? mesh.faceIndices[i][3]:-1; 
      var p1 = mesh.worldTransformedVertices[i0];
      var p2 = mesh.worldTransformedVertices[i1];
      var p3 = mesh.worldTransformedVertices[i2];
      var p4 = (vertexCount==4) ? mesh.worldTransformedVertices[i3]:null;
      
      var v1  = new Vertex(p1.x, p1.y, p1.z);
      var v2  = new Vertex(p2.x, p2.y, p2.z);
      var v3  = new Vertex(p3.x, p3.y, p3.z);
      var v4  = (vertexCount==3) ? null:new Vertex(p4.x, p4.y, p4.z);
      
      // Note: Backface culling is done during raytracing.
      // TODO: Change the mesh class so that it carries realCoords, transformedCoords and normals and centers
      var precalculatedData = {
        normal: mesh.faceNormals[i],
        center: mesh.faceCenters[i]
      };
      
      // Assign material and color
      var material = mesh.material ? mesh.material: new mea3D.Material(new ColorRGBA(1,1,1), 0);
      if (mesh.faceMaterials && mesh.faceMaterials[i]) {
        material = mesh.faceMaterials[i];
      }      
      
      var polygon = new Polygon(
          v1, v2, v3, v4,
          // A copy of transformed 3D points and original color (for raytracing)
          { // Original vertices
            v1:v1,
            v2:v2,
            v3:v3
          },
          material,         // Original material
          precalculatedData   // calculated normal and center data
        );*/
      // add the computed polygon to render buffer.
      var polygon = mesh.polygons[i];
      this.renderBuffer.push(polygon);    
    } // for (var i=0; i<numFaces; i++)
  },
  
  addModelToPolygonBuffer:function(model) {
    //if (!model) return;
    for (var k=0; k<model.meshList.length; k++) {        
      this.addMeshToPolygonBuffer(model.meshList[k]);
    }
  },
  buildPolygonBuffer:function() {
   
    // Add all the polygons in the scene to the render buffer
    this.renderBuffer = [];    
    for (var z=0; z<this.scene.models.length; z++) {
      this.addModelToPolygonBuffer(this.scene.models[z]);
    }
    // Finally add the skybox
    this.addModelToPolygonBuffer(this.scene.skyBox);
  },
  
  calculatePixelColor:function(width, height, x,y) {
    
    var eyePos = this.camera.eyePos;
    var eyeDir = this.camera.eyeDir;
    var upVector = this.camera.upVector;
    var leftVector = this.camera.leftVector;
    var fovHorizontal = this.camera.fovHorizontal;
    var fovVertical = this.camera.fovVertical;
    var polygons = this.renderBuffer;
    
    // Direction of the ray from eye position to given pixel's 3D position
    var pixelDirectionVector = mea3D.Math.getPixelDirectionVector(
      width, height, 
      x,y,
      fovHorizontal, fovVertical,  // TODO: Include fov in calculations.
      eyeDir, upVector, leftVector
    ).norm();
    
    var intersection = mea3D.Math.getRayPolygonListIntersection(
      polygons, eyePos, pixelDirectionVector);
      
    if (intersection) {
      
      // TODO: Only get the enabled lights here instead of all:
      var illuminatingLights = this.scene.lights;
      if (this.options.calculateShadows) {
        // Find out which lights can illuminate this point on the polygon
        illuminatingLights = mea3D.Math.getIlluminatingLights(
          intersection.position,
          polygons,
          this.scene.lights,
          intersection.polygonIndex
        );
      }
      
      // Calculate the color on the polygon hit based on scene lights:
      var calculatedColor = mea3D.Math.computeLighting(
        intersection.polygon,
        intersection.position,
        illuminatingLights,
        this.scene.ambientColor
      );
          
      // Calculate reflection
      if (this.options.calculateReflections && 
          intersection.polygon.material && 
          intersection.polygon.material.reflectivity>0) {
        
        // Get the reflected ray 
        var reflected = mea3D.Math.getReflectedRay(
          intersection.polygon.normal, 
          pixelDirectionVector
        );
        
        //Logging.log("Reflected ray: " + reflected);
        var reflectionOrigin = intersection.position;
        var reflectionIntersection = mea3D.Math.getRayPolygonListIntersection(
          polygons,
          reflectionOrigin,
          reflected,
          intersection.polygonIndex // Skip the polygon for which we are calculating reflection
        );
        
        var reflectedColor;
        if (reflectionIntersection) {
          
          // We have a reflection!
          var rawReflectedColor = reflectionIntersection.polygon.material.ambientColor;
           
          // Calculate reflected color based on scene lights
          reflectedColor = mea3D.Math.computeLighting(
            reflectionIntersection.polygon,
            reflectionIntersection.position,
            this.scene.lights,
            this.scene.ambientColor
          );
          
        } else { // reflected ray didn't hit any object. Set the reflected color as background
          reflectedColor = this.clearColor;
        }
        //if (reflectedColor.r<0 || reflectedColor.g<0 || reflectedColor.b<0)
        //  Logging.log("reflectedColor<0: " + reflectedColor);
          
        // Update the color with the reflected color:
        var reflectivity = intersection.polygon.material.reflectivity;
        var oneMinusReflectivity = (1-reflectivity);
        calculatedColor.r = oneMinusReflectivity*calculatedColor.r + reflectivity*reflectedColor.r;
        calculatedColor.g = oneMinusReflectivity*calculatedColor.g + reflectivity*reflectedColor.g;
        calculatedColor.b = oneMinusReflectivity*calculatedColor.b + reflectivity*reflectedColor.b;
      }
      return calculatedColor;
    }
    return this.clearColor;
  },
  
  // Renders the scene with raytracing. Can use subpixel rendering for antialiasing.
  startRender:function() {
    
    this.buildPolygonBuffer();    
    this.imageData = this.context.createImageData(
      this.width*this.pixelSize,
      this.height*this.pixelSize
    ); // Rendered image data to be filled
   
    Logging.info("Total " + this.renderBuffer.length + " polygons ");       
    
    this.totalProcessedPixels = 0;
    this.progress = 0; // Progress percentage
    this.completed = false;
    this.lastYPos = 0;
    this.lastXPos = 0;
  },

  iterate:function() {
    var width = this.width;
    var height = this.height;
    var totalPixels = width * height;
    var processedPixels = 0;
    var yStart = (this.lastYPos) ? this.lastYPos:0;
    var xStart = (this.lastXPos) ? this.lastXPos:0;
    
    var subPixelsX = this.options.subPixelsX;
    var subPixelsY = this.options.subPixelsY;
    var subPixelCount = subPixelsX * subPixelsY;    
    var subPixelStepX = 1.0/subPixelsX;
    var subPixelStepY = 1.0/subPixelsY;
    

    for (var y=yStart; y<height; y++) {
      for (var x=xStart; x<width; x++) {

        var pixelSum = new ColorRGBA(0,0,0,0);
        // Calculate subpixels
        for (var subPixelY=0; subPixelY<subPixelsY; subPixelY++) {
          for (var subPixelX=0; subPixelX<subPixelsX; subPixelX++) {
          
            var pixelX = x + subPixelX*subPixelStepX + subPixelStepX/2; // last term is for centering the subpixel
            var pixelY = y + subPixelY*subPixelStepY + subPixelStepY/2; // last term is for centering the subpixel
            var color = this.calculatePixelColor(
              width, height,
              pixelX, pixelY              
            );
            pixelSum.r += color.r;
            pixelSum.g += color.g;
            pixelSum.b += color.b;
            pixelSum.a += color.a;
          }
        }
        // Get the average of subpixel colors and paint the pixel
        var finalColor = pixelSum.divide(subPixelCount);        
        this.setPixel(x,y, finalColor);
        
        if (this.totalProcessedPixels%1000==0) {
          this.progress = (100.0*this.totalProcessedPixels/totalPixels);
          Logging.info("Render " + this.progress.toFixed(1) + "% complete");
        }
        this.totalProcessedPixels++;
        processedPixels++;
            
        if (processedPixels>1000) {
          // TODO: Fix x position so that we dont redo part of x
          this.lastXPos = 0; //x;
          this.lastYPos = y;
          this.totalProcessedPixels = y*this.width;
          this.completed = false;
          
          // update the image
          this.context.putImageData(this.imageData,0,0);          
          
          if (this.callbackFunc) this.callbackFunc();
          var me = this;
          setTimeout(function() { me.iterate()}, 1);
          return;
        }
      }
    }
    
    // TODO: We normally shouldn't need to explicitly set these two:
    this.totalProcessedPixels = this.width * this.height;
    this.progress = 100.0;
    
    if (this.callbackRenderFinished) this.callbackRenderFinished();
    this.completed = true;
    // Finally, draw the image
    this.context.putImageData(this.imageData,0,0);
    Logging.info("Raytrace finished.");
  }
};
