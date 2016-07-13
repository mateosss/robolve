var Debugger = cc.Class.extend({
  object: null,
  methods: [], // Format [{method:function(){},options:{}}]
  ctor: function(object){
    this.object = object;
  },
  debug: function (){
    for (var debugMethod in this.methods) {
      this.methods[debugMethod].method(this.object, {stop: true});
      this.methods[debugMethod].method(this.object, debugMethod.options || {});
    }
  },
  debugLine: function(object, options){
    //TODO Draw a line from object to target with distance label in pixels
    debugName = arguments.callee.name;
    stop = options.stop || false;
    if(stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      target = options.target || null;
      //TODO DRAW A LINE TO TARGET AND LABEL WITH PIXELS DISTANCE ABOVE THAT
    }
  },
  debugRange: function(object, options){
    // Draws a circle from the center with radius sRange
    debugName = arguments.callee.name;
    stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = object.getAnchorPointInPoints();
      var radius = object.sRange / object.level.map.CHILD_SCALE;
      var color = options.color || cc.color(1, 179, 255, 100);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);//TODO esta linea da error compilando para linux, esta repetida 3 veces en debugger
      circle.setName(debugName);
      object.addChild(circle, -1);
    }
  },
  debugAnchor: function(object, options){//TODO Unir esta funcion con debugPoint
    // Draws a circle in the object's anchor point
    debugName = arguments.callee.name;
    stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = object.getAnchorPointInPoints();
      var radius = options.radius || 10;
      var color = options.color || cc.color(200, 0, 200, 255);
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName(debugName);
      object.addChild(circle, 999);
    }
  },
  debugPoint: function(object, options){
    // Draws a point in the given options.pos
    debugName = arguments.callee.name;
    stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var pos = options.point || null;
      var color = options.color || cc.color(0, 200, 200, 255);
      var radius = options.radius || 5;
      var circle = new cc.DrawNode();
      circle.drawDot(pos, radius, color);
      circle.setName(debugName);
      object.addChild(circle, 1000);//TODO hacer nivel z opcional tambien
    }
  },
  debugRect: function(object, options){
    //Draws options.rect, or the object's rect
    debugName = arguments.callee.name;
    stop = options.stop || false;
    if (stop) {object.removeChild(object.getChildByName(debugName));}
    else {
      var square = new cc.DrawNode();
      var rect = options.rect ||
      cc.rect(object.x, object.y, object.width, object.height);
      var origin = options.origin || cc.p(rect.x, rect.y);
      var destination = options.destination ||
      cc.p(rect.x + rect.width, rect.y + rect.height);
      var fillColor = options.fillColor || cc.color(0, 50, 100, 50);
      var lineWidth = options.lineWidth || 1;
      var lineColor = options.lineColor || cc.color(0, 0, 0, 255);
      square.drawRect(origin, destination, fillColor, lineWidth, lineColor);
      square.setName(debugName);
      object.addChild(square, 100);//TODO poner niveles z diferentes
    }
  }
});
