// mea3D
// 
// Closure Compiler exports
//
// Author: Mustafa Emre Acer
//

window["mea3D"] = mea3D;

// ColorRGBA:
mea3D["ColorRGBA"] = mea3D.ColorRGBA;

// Vector:
mea3D["Vector3"] = mea3D.Vector3;

// Light:
mea3D["Light"] = mea3D.Light;
mea3D["LightType"] = mea3D.LightType;
mea3D.Light.prototype["setEnabled"] = mea3D.Light.prototype.setEnabled;
mea3D.Light.prototype["getEnabled"] = mea3D.Light.prototype.getEnabled;

// Material:
mea3D["Material"] = mea3D.Material;

// Mesh:
mea3D["Mesh"] = mea3D.Mesh;
mea3D.Mesh["createFromTemplate"] = mea3D.Mesh.createFromTemplate;

// Transformation:
mea3D["Transformation"] = mea3D.Transformation;

// Model3D:
mea3D["Model3D"] = mea3D.Model3D;
mea3D.Model3D.prototype["addMesh"] = mea3D.Model3D.prototype.addMesh;
mea3D.Model3D.prototype["updateTransformation"] = mea3D.Model3D.prototype.updateTransformation;

// Camera:
mea3D["Camera"] = mea3D.Camera;
mea3D.Camera.prototype["getEyePos"] = mea3D.Camera.prototype.getEyePos;
mea3D.Camera.prototype["moveTo"] = mea3D.Camera.prototype.moveTo;

mea3D.Camera.prototype["getEyeDir"] = mea3D.Camera.prototype.getEyeDir;
mea3D.Camera.prototype["setEyeDir"] = mea3D.Camera.prototype.setEyeDir;

mea3D.Camera.prototype["getFovHorizontal"] = mea3D.Camera.prototype.getFovHorizontal;
mea3D.Camera.prototype["getFovVertical"] = mea3D.Camera.prototype.getFovVertical;
mea3D.Camera.prototype["getUpVector"] = mea3D.Camera.prototype.getUpVector;

mea3D.Camera.prototype["moveByMouseDelta"] = mea3D.Camera.prototype.moveByMouseDelta;
mea3D.Camera.prototype["moveForwardBackward"] = mea3D.Camera.prototype.moveForwardBackward;
mea3D.Camera.prototype["moveLeftRight"] = mea3D.Camera.prototype.moveLeftRight;

mea3D.Camera.prototype["rotateYaw"] = mea3D.Camera.prototype.rotateYaw;
mea3D.Camera.prototype["rotatePitch"] = mea3D.Camera.prototype.rotatePitch;

// Renderer:
mea3D["Renderer"] = mea3D.Renderer;
mea3D.Renderer.prototype["isInitialized"] = mea3D.Renderer.prototype.isInitialized;
mea3D.Renderer.prototype["getCamera"] = mea3D.Renderer.prototype.getCamera;
mea3D.Renderer.prototype["update"] = mea3D.Renderer.prototype.update;

// Scene:
mea3D["Scene"] = mea3D.Scene;
mea3D.Scene.prototype["addModel"] = mea3D.Scene.prototype.addModel;
mea3D.Scene.prototype["addLight"] = mea3D.Scene.prototype.addLight;
mea3D.Scene.prototype["getLights"] = mea3D.Scene.prototype.getLights;

// Utils:
mea3D["Utils"] = mea3D.Utils;
mea3D.Utils["getPageOffsetTop"] = mea3D.Utils.getPageOffsetTop;
mea3D.Utils["getPageOffsetLeft"] = mea3D.Utils.getPageOffsetLeft;
mea3D.Utils["getXYValues"] = mea3D.Utils.getXYValues;
mea3D.Utils["getElementsByTagName"] = mea3D.Utils.getElementsByTagName;
mea3D.Utils["getCanvasElement"] = mea3D.Utils.getCanvasElement;
mea3D.Utils["createCanvas"] = mea3D.Utils.createCanvas;
