
/** @interface
 */
mea3D.Renderable2D = function() {
  this.projectedCenter = null;
}

/** @constructor
 *  @implements {mea3D.Renderable2D}
 */
mea3D.Renderable2D.Quad = function(v1, v2, v3, v4, projectedCenter, renderColor) {
  this.type = mea3D.RenderableType.POLYGON;
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;
  this.v4 = v4;
  this.projectedCenter = projectedCenter;
  this.renderColor = renderColor;
}

/** @constructor
 *  @implements {mea3D.Renderable2D}
 */
mea3D.Renderable2D.Text = function(projectedPos, projectedCenter, text, fontSize, renderColor) {
  this.type = mea3D.RenderableType.TEXT;
  this.position = projectedPos;
  this.projectedCenter = projectedCenter;
  this.text = text;
  this.fontSize = fontSize;
  this.renderColor = renderColor;
}
