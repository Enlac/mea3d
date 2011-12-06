// mea3D HTML5 Canvas 3D library
//
// Author: Mustafa Acer

// Combines given options with the default values
mea3D.getOptions = function(options, defaultOptions) {
  var calculatedOptions = {};
  if (defaultOptions) {
    for (var optionName in defaultOptions) {
      if (options && optionName in options) {
        //mea3D.Logging.log("Setting " + optionName + " to " + options[optionName]);
        calculatedOptions[optionName] = options[optionName];
      }
      else  {
        //mea3D.Logging.log("Defaulting " + optionName + " to " + defaultOptions[optionName]);
        calculatedOptions[optionName] = defaultOptions[optionName];
      }
    }
  }
  return calculatedOptions;
};


mea3D.Utils = {

  // From Google JavaScripts:
  getPageOffsetTop:function(a){
    return a.offsetTop + (a.offsetParent ? mea3D.Utils.getPageOffsetTop(a.offsetParent):0);
  },
  // From Google JavaScripts:
  getPageOffsetLeft:function(a){
    return a.offsetLeft + (a.offsetParent ? mea3D.Utils.getPageOffsetLeft(a.offsetParent):0);
  },

  // Utility to parse 400x300 type strings
  getXYValues:function(str) {
  
    if (!str) return {x:-1, y:-1};
    
    var arr = str.split("x");
    var x = parseInt(arr[0]);
    var y = parseInt(arr[1]);
    return {x:x, y:y};
  },

  // getElementsByTagName implementation for IE, not recursive
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
      canvas = mea3D.Utils.getElementsByTagName("canvas") && mea3D.Utils.getElementsByTagName("canvas")[0];
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
