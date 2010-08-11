// Author: Mustafa Acer
if (typeof mea3D=="undefined") mea3D = {};

mea3D.LogLevel = {
  LOG_ALL   :0,
  LOG_DEBUG :1,
  LOG_INFO  :2,
  LOG_ERROR :3,
  LOG_NONE  :4
};

var Logging = {
  log:function(s) {
    if (typeof console!="undefined") {
      console.log(s);
    }
    var debugDiv = document.getElementById("debugDiv");
    if (debugDiv) {
      if (debugDiv.innerHTML.length>20000) {
        // clean if there is too much text
        debugDiv.innerHTML = "";
      }
      debugDiv.innerHTML += (s.replace(/\n/g, "<br>") + "<br>");
      if (document.getElementById("debugDivScrollTo")) {
        document.getElementById("debugDivScrollTo").scrollIntoView();
      }
    }
  },
  
  logByLevel:function(s, level) {
    var loggingLevel = document.getElementById("loggingLevel") ? 
      document.getElementById("loggingLevel").selectedIndex : 0;
    if (level) {    
      if (level<loggingLevel)
        return;
    }
    else {
      // if only log() is called, assume it's level is debug.
      if (mea3D.LogLevel.LOG_DEBUG<loggingLevel)
        return;
    }
    Logging.log(s);
  },
  
  
  debug:function(s) {
    Logging.logByLevel(s, mea3D.LogLevel.LOG_DEBUG);
  },
  
  info:function(s) {
    Logging.logByLevel(s, mea3D.LogLevel.LOG_INFO);  
  },
  error:function(s) {
    Logging.logByLevel(s, mea3D.LogLevel.LOG_ERROR);
  }
};
