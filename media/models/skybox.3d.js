
var skyBoxModelTemplate = {
name:"skyBox",
meshList:
 [
  {
    name:"body",
    materialIndex:1,
    vertices: [],   // vertices and faces are built below.
    faceIndices: [],
    faceMaterialIndices: []
  } // mesh
 ] // meshList
,

materials:
  [
    {ambientColor:[0.5,0.5,0.4], reflectivity:0.3},
    {ambientColor:[0.5,0.5,0.4], reflectivity:0.3}
  ]
}; // model

(function() {
  // Build the vertices and faces.
  var tileWidth =  3;
  var tileHeight = 3;    
  var tileCountX = 30;
  var tileCountY = 30;  
  
  var vertices = skyBoxModelTemplate.meshList[0].vertices;
  var faceIndices = skyBoxModelTemplate.meshList[0].faceIndices;
  var faceMaterialIndices = skyBoxModelTemplate.meshList[0].faceMaterialIndices;
  
  var count = 0;
  for (var y=0; y<tileCountY; y++) {
    for (var x=0; x<tileCountX; x++) {
      var vX = (x-tileCountX/2)*tileWidth;
      var vZ = (y-tileCountY/2)*tileHeight;
      
      //var vY = -3 + Math.sqrt(vX*vX + vZ*vZ)/10.0;
      //var vY = 40 - Math.sqrt(vX*vX + vZ*vZ);
      var vY = 20*Math.sin((vX*vX + vZ*vZ)/1700.0);
      vertices.push(vX, vY, vZ);
      //vertices.push(vX, -1, vZ);

      if (x!=tileCountX-1 && y!=tileCountY-1) {
        var i1 = y*tileCountX + x;
        var i2 = i1 + 1;
        var i3 = i2 + tileCountX;
        var i4 = i3-1;
        
        // Use 4 edge polygons:
        faceIndices.push([i1,i4,i3,i2]);
        faceMaterialIndices.push(count%2 + 1);  // material index starts from 1 not 0
        
        // Use Triangles:
        //faceIndices.push(3, i1,i3,i2);
        //faceMaterialIndices.push(count%2 + 1);  // material index starts from 1 not 0
        
        //faceIndices.push(3, i1,i4,i3 );
        //faceMaterialIndices.push(count%2 + 1);
        count++;
      }
    }
  }
  skyBoxModelTemplate.meshList[0].faceMaterialIndices = null;
  //console.log("Skybox has " + vertices.length/3 + " vertices and " + faceIndices.length + " faces.");
})();
      