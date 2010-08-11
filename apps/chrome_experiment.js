// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

/**
* @constructor
*/
mea3D.ChromeExperiment = function() {}

mea3D.ChromeExperiment.prototype = {

  init:function(options) {
    
    if (typeof options=="undefined") {
      options = {
        rendererOptions:null, // null falls back to default values
        rayTracerOptions:null // null falls back to default values
      };
    }
    
    this.renderer = new mea3D.Renderer(de("sceneDiv"), options.rendererOptions);
    if (!this.renderer.initiated) {
      var errorDiv = de("errorDiv");
      if (errorDiv) {
        errorDiv.style.display = "block";
      }
      return false;
    }
    
    // Closure compiler breaks rendering options so we set these here:
    this.renderer.clearColor = new ColorRGBA(0.1, 0.1, 0.2);
    this.renderer.camera.eyePos = new Vector3(-50,25,-50);
    this.renderer.camera.eyeDir = new Vector3(0.8,0,1).norm();
    
    this.sceneOffsetX = mea3D.getPageOffsetLeft(this.renderer.canvas);
    this.sceneOffsetY = mea3D.getPageOffsetTop(this.renderer.canvas);
      
    this.buildScene();
    this.renderer.update();
    this.updateInformation();
    this.bindInputEvents();
    
    //this.animate();
  },
  
  buildScene:function() {
  
    // Create the scene
    var scene = new mea3D.Scene();
    
    // Airplane model
    var airplane = new mea3D.Model3D("airplane", airplaneModelTemplate,
      new Transformation(new Vector3(-44,25,-40))
    );
    scene.addModel(airplane);
    
    // Gears    
    var gearModel = new mea3D.Model3D("gearModel", null);
    var gearMaterials = [
      new mea3D.Material(0, null, new ColorRGBA(1,1,0.3), new ColorRGBA(0.3, 0.1, 0.1)),
      new mea3D.Material(0, null, new ColorRGBA(0.3,0.3,1), new ColorRGBA(0.3, 0.1, 0.1)),
      new mea3D.Material(0, null, new ColorRGBA(1,0.3,0.3), new ColorRGBA(0.3, 0.1, 0.1))
    ];
    gearMaterials[0].enableEmitColor = true;
    gearMaterials[1].enableEmitColor = true;
    gearMaterials[2].enableEmitColor = true;
    var gearMesh1 = mea3D.Mesh.createFromTemplate(
      gearModel, "gearMesh1", gearMeshTemplate, [gearMaterials[0]], 
      new Transformation(new Vector3(0, 20, 0), new Vector3(6, 6, 6), new Vector3(0,0,0.2))
    );
    var gearMesh2 = mea3D.Mesh.createFromTemplate(
      gearModel, "gearMesh2", gearMeshTemplate, [gearMaterials[1]],
      new Transformation(new Vector3(-27, 32, 0),  new Vector3(10.5, 10.5, 4))
    );
    var gearMesh3 = mea3D.Mesh.createFromTemplate(
      gearModel, "gearMesh3", gearMeshTemplate, [gearMaterials[2]],
      new Transformation(new Vector3(27, 32, 0), new Vector3(10.5, 10.5, 4))
    );
    gearModel.addMesh(gearMesh1);
    gearModel.addMesh(gearMesh2);
    gearModel.addMesh(gearMesh3);    
    gearMesh1.material = gearMaterials[0];
    gearMesh2.material = gearMaterials[1];
    gearMesh3.material = gearMaterials[2];
    gearModel.updateTransformation();
    scene.addModel(gearModel);
    
    // Skybox
    scene.skyBox = new mea3D.Model3D("skybox", skyBoxModelTemplate);
    //scene.addModel(new mea3D.Model3D("skybox", skyBoxModelTemplate));
    
    // Light setup
    scene.ambientColor = new ColorRGBA(0.1, 0.1, 0.1); // ambient color
    scene.addLight(               // add a white light to the center
      new mea3D.Light(
        mea3D.LightType.POINT, 
        new ColorRGBA(0.8, 0.8, 0.8), 
        new Vector3(-40,35,-45),       // light position
        null,                      // point lights dont have directions
        1000000,                   // range
        {att0:0, att1:0.00, att2:0.003} // attenuation factors (see DirectX SDK, Attenuation and Spotlight Factor)
      )
    );
    /*scene.addLight(
      new mea3D.Light(
        mea3D.LightType.DIRECTIONAL,
        new ColorRGBA(0.4, 0.4, 0.4),
        null,                         // directional lights dont have a position
        new Vector3(0,-1,-1)          // light direction
      )
    );*/    
    scene.addLight(               // add a green light to the right
      new mea3D.Light(
        mea3D.LightType.POINT, 
        new ColorRGBA(0.8, 0, 0), 
        new Vector3(-20,15,-20),   // light position
        null,                      // point lights dont have directions
        1000000,                   // range
        {att0:0, att1:0.00, att2:0.002} // attenuation factors (see DirectX SDK, Attenuation and Spotlight Factor)
      )
    );
    scene.addLight(                // add a green light to the left
      new mea3D.Light(
        mea3D.LightType.POINT, 
        new ColorRGBA(0, 0.8, 0), 
        new Vector3(20,15,-20),    // light position
        null,                      // point lights dont have directions
        1000000,                   // range
        {att0:0, att1:0.00, att2:0.002} // attenuation factors (see DirectX SDK, Attenuation and Spotlight Factor)
      )
    );
    scene.addLight(                // add a blue light to the back
      new mea3D.Light(
        mea3D.LightType.POINT, 
        new ColorRGBA(0, 0.0, 0.8), 
        new Vector3(0,20,20),      // light position
        null,                      // point lights dont have directions
        1000000,                   // range
        {att0:0, att1:0.00, att2:0.002} // attenuation factors (see DirectX SDK, Attenuation and Spotlight Factor)
      )
    );
    
    // Turn off all lights in the beginning
    for (var i=1; i<scene.lights.length; i++) {
      scene.lights[i].enabled = false;
    }
    this.renderer.scene = scene;
  },
  
  onKey:function(keyCode) {
    
    // Check if a meaningful key is pressed:
    if (!( keyCode==mea3D.KeyCodes.KEYCODE_W || keyCode==mea3D.KeyCodes.KEYCODE_S || 
        keyCode==mea3D.KeyCodes.KEYCODE_A || keyCode==mea3D.KeyCodes.KEYCODE_D ||
        keyCode==mea3D.KeyCodes.KEYCODE_UP|| keyCode==mea3D.KeyCodes.KEYCODE_DOWN || 
        keyCode==mea3D.KeyCodes.KEYCODE_LEFT || keyCode==mea3D.KeyCodes.KEYCODE_RIGHT ||
        keyCode==mea3D.KeyCodes.KEYCODE_L || keyCode==mea3D.KeyCodes.KEYCODE_M || 
        keyCode==mea3D.KeyCodes.KEYCODE_B || keyCode==mea3D.KeyCodes.KEYCODE_R ||
        keyCode==mea3D.KeyCodes.KEYCODE_Q || keyCode==mea3D.KeyCodes.KEYCODE_E || 
        
        keyCode==mea3D.KeyCodes.KEYCODE_1 || keyCode==mea3D.KeyCodes.KEYCODE_2 || // lights 
        keyCode==mea3D.KeyCodes.KEYCODE_3 || keyCode==mea3D.KeyCodes.KEYCODE_4 || // lights 
        keyCode==mea3D.KeyCodes.KEYCODE_5 || keyCode==mea3D.KeyCodes.KEYCODE_6   // lights 
      ))
      return true;
    
                
    if (keyCode==mea3D.KeyCodes.KEYCODE_W) {   // Move forward
      this.renderer.camera.moveForwardBackward(1.0);
    }

    if (keyCode==mea3D.KeyCodes.KEYCODE_S) {   // Move backward
      this.renderer.camera.moveForwardBackward(-1.0);
    }    
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_LEFT) {  // Turn left
      this.renderer.camera.rotateYaw(-Math.PI/15);
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_RIGHT) {  // Turn right    
      this.renderer.camera.rotateYaw(Math.PI/15);
    }

    if (keyCode==mea3D.KeyCodes.KEYCODE_UP) {  // Look up      
      this.renderer.camera.rotatePitch(-Math.PI/15);
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_DOWN) {  // Look down
      this.renderer.camera.rotatePitch(Math.PI/15);
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_A) { // Strafe left
      this.renderer.camera.moveLeftRight(-1.0);
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_D) { // Strafe right
      this.renderer.camera.moveLeftRight(1.0);
    }
    
    /*if (keyCode==mea3D.KeyCodes.KEYCODE_L) {
      if (de("loggingLevel")) {
        de("loggingLevel").selectedIndex = (de("loggingLevel").selectedIndex+1) % (LOG_NONE+1);
        Logging.log("Logging level is now " + de("loggingLevel").value, LOG_NONE+1);
      }
    }*/
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_M) {
      this.renderer.options.enableMouseNavigation = !this.renderer.options.enableMouseNavigation;
      Logging.info("Mouse navigation is now " + (this.renderer.options.enableMouseNavigation?"on":"off"));
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_B) {
      this.renderer.options.backfaceCulling = !this.renderer.options.backfaceCulling;
      Logging.info("Backface culling is now " + (this.renderer.options.backfaceCulling?"on":"off"));
      if (de("backfaceCulling")) de("backfaceCulling").innerHTML = (this.renderer.options.backfaceCulling?"on":"off");
    }
    
    if (keyCode==mea3D.KeyCodes.KEYCODE_R) {
      this.renderer.options.renderMode = 
        (this.renderer.options.renderMode+1)%(mea3D.RenderModes.RENDER_FACES+1);
      var renderModeStrings = ["None", "Points", "Wireframe", "Faces"];
      if (de("renderMode")) {
        if (renderModeStrings[this.renderer.options.renderMode])
          de("renderMode").innerHTML = renderModeStrings[this.renderer.options.renderMode];
        else
          de("renderMode").innerHTML = "Unknown";
      }
    }
        
    if (keyCode==mea3D.KeyCodes.KEYCODE_Q) {
      this.renderer.camera.moveUpDown(1);     // move the camera up
    }
    if (keyCode==mea3D.KeyCodes.KEYCODE_E) {
      this.renderer.camera.moveUpDown(-1);    // move the camera down
    }
    
    if (keyCode>=mea3D.KeyCodes.KEYCODE_1 && keyCode<=mea3D.KeyCodes.KEYCODE_6) {
      var lightNo = keyCode-mea3D.KeyCodes.KEYCODE_1;
      if (lightNo<this.renderer.scene.lights.length) {
        this.renderer.scene.lights[lightNo].enabled = 
          !this.renderer.scene.lights[lightNo].enabled;
      }
    }
    
    var me = this;
    setTimeout(function() {
      me.renderer.updateTransformMatrix();
      me.renderer.update();
      me.updateInformation();
    }, 1);
    return false;
  },
  
  onWheel:function(mouseDelta) {
    
    //Logging.log("Wheel delta:" + mouseDelta);
    this.renderer.camera.fovHorizontal += mouseDelta/1000.0;
    if (this.renderer.camera.fovHorizontal>Math.PI*0.9) {
      this.renderer.camera.fovHorizontal = Math.PI*0.9;
    }
    if (this.renderer.camera.fovHorizontal<Math.PI*0.001) {
      this.renderer.camera.fovHorizontal = Math.PI*0.001;
    }
    
    this.renderer.camera.fovVertical = this.renderer.camera.fovHorizontal/this.renderer.options.aspectRatio;
    this.renderer.updateProjectionMatrix();
    this.renderer.updateTransformMatrix();
    this.renderer.update();
    
    return false;
  },
  
  updateInformation:function() {
    
    if (de("numFaces")) de("numFaces").innerHTML = this.renderer.numRenderedPolygons;
    if (de("numVertices")) de("numVertices").innerHTML = this.renderer.numRenderedVertices;    
    if (de("numFramesRendered")) de("numFramesRendered").innerHTML = this.renderer.numFramesRendered;
  },

  bindInputEvents:function() {

    var me = this;
    
    document.onkeydown = function(ev) {
      var keyCode = ev.keyCode;
      return me.onKey(keyCode);
    };
    // NOTE: Closure compiler breaks document.onmousewheel, so we do this:
    document.addEventListener("mousewheel", function(ev) {
      if (ev.wheelDelta) {
        var ret = me.onWheel(ev.wheelDelta);
        me.updateInformation();
        return ret;
      }
    }, false);
    
    document.onmousemove = function(ev) {
      if (me.renderer.options.enableMouseNavigation) {
        if (ev.pageX && ev.pageY) {
          var ret = me.renderer.onMouseMove(
            ev.pageX-me.sceneOffsetX, ev.pageY-me.sceneOffsetY
          );
          me.updateInformation();
          return ret;
        }
      }
    };
    
    if (de("btnStartAnim")) {
      de("btnStartAnim").onclick = function(ev) {
        if (!me.runAnimation) {
          me.runAnimation = true;
          me.renderer.options.enableMouseNavigation = false;
          de("btnStartAnim").style.display = "none";
          de("btnStopAnim").style.display = "inline";
          me.animate();
        }
      };
    }
    
    if (de("btnStopAnim")) {
      de("btnStopAnim").onclick = function(ev) {
        me.runAnimation = false;
        me.renderer.options.enableMouseNavigation = true;
        de("btnStartAnim").style.display = "inline";
        de("btnStopAnim").style.display = "none";
      };
    }
  },
  
  animate:function() {
  
    var me = this;
    var divFPS = de("framesPerSecond");
    var startTime = new Date();
    var lastFPSCalculationTime = startTime;
    var numFrames = 0;
    var angle = 0;    
    var currentLight = 0;
    var lastLightToggleTime = startTime;
    var gearRatio = (10.5/6.0);
    var airplaneModel = this.renderer.scene.getModelByName("airplane");
    var gearModel = this.renderer.scene.getModelByName("gearModel");
    var gearMesh1 = gearModel.getMeshByName("gearMesh1");
    var gearMesh2 = gearModel.getMeshByName("gearMesh2");
    var gearMesh3 = gearModel.getMeshByName("gearMesh3");
    var fpsCalculator = new mea3D.FPSCalculator();
    
    // Reset camera's up vector:
    this.renderer.camera.upVector = new Vector3(0,1,0);
    // Turn on plane's light:
    this.renderer.scene.lights[0].enabled = true;
    
    function updateScene() {
      angle += (Math.PI/25);
      var s = Math.sin(angle);
      var c = Math.cos(angle);
      var planePos = new Vector3(35*s, 32+2*s, 35*c);
      var planeDir = new Vector3(0, angle-Math.PI/2, Math.PI/10);
      
      // Update the light which follows the plane
      me.renderer.scene.lights[0].position = planePos;
      me.renderer.scene.lights[0].position.y -= 3;
      // Update the place
      airplaneModel.transformation.position = planePos;
      airplaneModel.transformation.rotation = planeDir;
      airplaneModel.updateTransformation();
      
      // Update gears 
      gearMesh1.transformation.rotation.z = angle*0.25*gearRatio;
      gearMesh2.transformation.rotation.z = -angle*0.25;
      gearMesh3.transformation.rotation.z = -angle*0.25;
      gearModel.updateTransformation();
      // ===============
      
      // Update camera
      var s2 = Math.sin(angle/10.0);      
      var c2 = Math.cos(angle/10.0);
      var cameraRadius = 70 + s2 * 20;
      me.renderer.camera.eyePos = new Vector3(cameraRadius*c2, 50+20*s2, cameraRadius*s2);
      me.renderer.camera.eyeDir = planePos.scale(0.3).subt(me.renderer.camera.eyePos).norm();
      // Ride on the plane:      
      //me.renderer.camera.eyePos = planePos.add(new Vector3(0,3,0));      
      //me.renderer.camera.eyeDir = planePos.cross(new Vector3(0,1,0)).scale(-1);
      
      // Toggle lights
      var currentTime = new Date();
      if (currentTime-lastLightToggleTime>300) {
        currentLight = Math.floor(Math.random()* (me.renderer.scene.lights.length-1))+1;
        me.renderer.scene.lights[currentLight].enabled = !me.renderer.scene.lights[currentLight].enabled ;
        //currentLight = (currentLight + 1) % me.renderer.scene.lights.length;
        lastLightToggleTime = currentTime;
      }
      
      fpsCalculator.update();
      if (divFPS) {
        divFPS.innerHTML = fpsCalculator.fps.toFixed(2);
      }
      
      me.renderer.updateTransformMatrix();
      me.renderer.update();
      numFrames++;
      me.updateInformation();
      
      if (me.runAnimation) {
        setTimeout(updateScene, 1);
     }
    }
    updateScene();
  },
  
  benchmark:function() {
    var startTime = new Date();
    var frameCount = 0;
    Logging.log("=================================================");
    Logging.log("Benchmarking...");
    for (var i=0; i<500; i++) {
      this.renderer.update();
      frameCount++;
    }    
    Logging.log("Frames Rendered: " + frameCount);
    Logging.log("Time elapsed: " + (((new Date())-startTime)/1000.0) + " seconds");
  }
};

// Export Chrome Experiment object to make closure compiler happy:
window["mea3D"] = mea3D;
window["mea3D"]["ChromeExperiment"] = mea3D.ChromeExperiment;
window["mea3D"]["ChromeExperiment"]["prototype"] = mea3D.ChromeExperiment.prototype;
window["mea3D"]["ChromeExperiment"]["prototype"]["init"] = mea3D.ChromeExperiment.prototype.init;
window["mea3D"]["ChromeExperiment"]["prototype"]["run"] =  mea3D.ChromeExperiment.prototype.run;

