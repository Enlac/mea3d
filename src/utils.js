// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

// Combines given options with the default values
mea3D.getOptions = function(options, defaultOptions) {
  var calculatedOptions = {};
  if (defaultOptions) {
    for (var optionName in defaultOptions) {
      if (options && optionName in options) {
        //Logging.log("Setting " + optionName + " to " + options[optionName]);
        calculatedOptions[optionName] = options[optionName];
      }
      else  {
        //Logging.log("Defaulting " + optionName + " to " + defaultOptions[optionName]);
        calculatedOptions[optionName] = defaultOptions[optionName];
      }
    }
  }
  return calculatedOptions;
};

// Utility to parse 400x300 type strings
mea3D.getXYValues = function(str) {

  if (!str) return {x:-1, y:-1};
  
  var arr = str.split("x");
  var x = parseInt(arr[0]);
  var y = parseInt(arr[1]);
  return {x:x, y:y};
};

// From Google JavaScripts:
mea3D.getPageOffsetTop = function(a){
  return a.offsetTop + (a.offsetParent ? mea3D.getPageOffsetTop(a.offsetParent):0)
};
mea3D.getPageOffsetLeft = function(a){
  return a.offsetLeft + (a.offsetParent ? mea3D.getPageOffsetLeft(a.offsetParent):0)
};

mea3D.Utils = {

  getElementsByTagName:function(domElement, tagName) {
    tagName = tagName.toUpperCase();
    var child = domElement.firstChild;
    var children = [];
    while (child) {
      if (child.tagName==tagName) {
        children.push(child);
      }
      // no recursion
    }
    return children;
  },
  
  getCanvasElement:function(domElement) {
    if (!domElement) {
      return null;
    }
    var canvas = null;
    if (domElement.getElementsByTagName) {
      canvas = domElement.getElementsByTagName("canvas") && domElement.getElementsByTagName("canvas")[0];
    } else {
      canvas = this.getElementsByTagName("canvas") && this.getElementsByTagName("canvas")[0];
    }
    return canvas;
  },
  
  createCanvas:function(parent, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    parent.appendChild(canvas);
    return canvas;
  }
}

