/*
Copyright (c) 2011 Sencha Inc. - Author: Nicolas Garcia Belmonte (http://philogb.github.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */
 (function () { 

/*
  File: Core.js

 */

/*
 Object: $jit
 
 Defines the namespace for all library Classes and Objects. 
 This variable is the *only* global variable defined in the Toolkit. 
 There are also other interesting properties attached to this variable described below.
 */
window.$jit = function(w) {
  w = w || window;
  for(var k in $jit) {
    if($jit[k].$extend) {
      w[k] = $jit[k];
    }
  }
};

$jit.version = '2.0.1';
/*
  Object: $jit.id
  
  Works just like *document.getElementById*
  
  Example:
  (start code js)
  var element = $jit.id('elementId');
  (end code)

*/

/*
 Object: $jit.util
 
 Contains utility functions.
 
 Some of the utility functions and the Class system were based in the MooTools Framework 
 <http://mootools.net>. Copyright (c) 2006-2010 Valerio Proietti, <http://mad4milk.net/>. 
 MIT license <http://mootools.net/license.txt>.
 
 These methods are generally also implemented in DOM manipulation frameworks like JQuery, MooTools and Prototype.
 I'd suggest you to use the functions from those libraries instead of using these, since their functions 
 are widely used and tested in many different platforms/browsers. Use these functions only if you have to.
 
 */
var $ = function(d) {
  return document.getElementById(d);
};

$.empty = function() {
};

/*
  Method: extend
  
  Augment an object by appending another object's properties.
  
  Parameters:
  
  original - (object) The object to be extended.
  extended - (object) An object which properties are going to be appended to the original object.
  
  Example:
  (start code js)
  $jit.util.extend({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.extend = function(original, extended) {
  for ( var key in (extended || {}))
    original[key] = extended[key];
  return original;
};

$.lambda = function(value) {
  return (typeof value == 'function') ? value : function() {
    return value;
  };
};

$.time = Date.now || function() {
  return +new Date;
};

/*
  Method: splat
  
  Returns an array wrapping *obj* if *obj* is not an array. Returns *obj* otherwise.
  
  Parameters:
  
  obj - (mixed) The object to be wrapped in an array.
  
  Example:
  (start code js)
  $jit.util.splat(3);   //[3]
  $jit.util.splat([3]); //[3]
  (end code)
*/
$.splat = function(obj) {
  var type = $.type(obj);
  return type ? ((type != 'array') ? [ obj ] : obj) : [];
};

$.type = function(elem) {
  var type = $.type.s.call(elem).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
  if(type != 'object') return type;
  if(elem && elem.$$family) return elem.$$family;
  return (elem && elem.nodeName && elem.nodeType == 1)? 'element' : type;
};
$.type.s = Object.prototype.toString;

/*
  Method: each
  
  Iterates through an iterable applying *f*.
  
  Parameters:
  
  iterable - (array) The original array.
  fn - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.each([3, 4, 5], function(n) { alert('number ' + n); });
  (end code)
*/
$.each = function(iterable, fn) {
  var type = $.type(iterable);
  if (type == 'object') {
    for ( var key in iterable)
      fn(iterable[key], key);
  } else {
    for ( var i = 0, l = iterable.length; i < l; i++)
      fn(iterable[i], i);
  }
};

$.indexOf = function(array, item) {
  if(Array.indexOf) return array.indexOf(item);
  for(var i=0,l=array.length; i<l; i++) {
    if(array[i] === item) return i;
  }
  return -1;
};

/*
  Method: map
  
  Maps or collects an array by applying *f*.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  
  Example:
  (start code js)
  $jit.util.map([3, 4, 5], function(n) { return n*n; }); //[9, 16, 25]
  (end code)
*/
$.map = function(array, f) {
  var ans = [];
  $.each(array, function(elem, i) {
    ans.push(f(elem, i));
  });
  return ans;
};

/*
  Method: reduce
  
  Iteratively applies the binary function *f* storing the result in an accumulator.
  
  Parameters:
  
  array - (array) The original array.
  f - (function) The function to apply to the array elements.
  opt - (optional|mixed) The starting value for the acumulator.
  
  Example:
  (start code js)
  $jit.util.reduce([3, 4, 5], function(x, y) { return x + y; }, 0); //12
  (end code)
*/
$.reduce = function(array, f, opt) {
  var l = array.length;
  if(l==0) return opt;
  var acum = arguments.length == 3? opt : array[--l];
  while(l--) {
    acum = f(acum, array[l]);
  }
  return acum;
};

/*
  Method: merge
  
  Merges n-objects and their sub-objects creating a new, fresh object.
  
  Parameters:
  
  An arbitrary number of objects.
  
  Example:
  (start code js)
  $jit.util.merge({ 'a': 1, 'b': 2 }, { 'b': 3, 'c': 4 }); //{ 'a':1, 'b': 3, 'c': 4 }
  (end code)
*/
$.merge = function() {
  var mix = {};
  for ( var i = 0, l = arguments.length; i < l; i++) {
    var object = arguments[i];
    if ($.type(object) != 'object')
      continue;
    for ( var key in object) {
      var op = object[key], mp = mix[key];
      mix[key] = (mp && $.type(op) == 'object' && $.type(mp) == 'object') ? $
          .merge(mp, op) : $.unlink(op);
    }
  }
  return mix;
};

$.unlink = function(object) {
  var unlinked;
  switch ($.type(object)) {
  case 'object':
    unlinked = {};
    for ( var p in object)
      unlinked[p] = $.unlink(object[p]);
    break;
  case 'array':
    unlinked = [];
    for ( var i = 0, l = object.length; i < l; i++)
      unlinked[i] = $.unlink(object[i]);
    break;
  default:
    return object;
  }
  return unlinked;
};

$.zip = function() {
  if(arguments.length === 0) return [];
  for(var j=0, ans=[], l=arguments.length, ml=arguments[0].length; j<ml; j++) {
    for(var i=0, row=[]; i<l; i++) {
      row.push(arguments[i][j]);
    }
    ans.push(row);
  }
  return ans;
};


/*
  Method: hexToRgb
  
  Converts an Hex color string into an RGB array.
  
  Parameters:
  
  hex - (string) A color hex string.
  
  Example:
  (start code js)
  $jit.util.hexToRgb('#fff'); //[255, 255, 255]
  (end code)
*/
$.hexToRgb = function(hex) {
  if (hex.length != 7) {
    hex = hex.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
    hex.shift();
    if (hex.length != 3)
      return null;
    var rgb = [];
    for ( var i = 0; i < 3; i++) {
      var value = hex[i];
      if (value.length == 1)
        value += value;
      rgb.push(parseInt(value, 16));
    }
    return rgb;
  } else {
    hex = parseInt(hex.slice(1), 16);
    return [ hex >> 16, hex >> 8 & 0xff, hex & 0xff ];
  }
};

$.destroy = function(elem) {
  $.clean(elem);
  if (elem.parentNode)
    elem.parentNode.removeChild(elem);
  if (elem.clearAttributes)
    elem.clearAttributes();
};

$.clean = function(elem) {
  for (var ch = elem.childNodes, i = 0, l = ch.length; i < l; i++) {
    $.destroy(ch[i]);
  }
};

/*
  Method: addEvent
  
  Cross-browser add event listener.
  
  Parameters:
  
  obj - (obj) The Element to attach the listener to.
  type - (string) The listener type. For example 'click', or 'mousemove'.
  fn - (function) The callback function to be used when the event is fired.
  
  Example:
  (start code js)
  $jit.util.addEvent(elem, 'click', function(){ alert('hello'); });
  (end code)
*/
$.addEvent = function(obj, type, fn) {
  if (obj.addEventListener)
    obj.addEventListener(type, fn, false);
  else
    obj.attachEvent('on' + type, fn);
};

$.addEvents = function(obj, typeObj) {
  for(var type in typeObj) {
    $.addEvent(obj, type, typeObj[type]);
  }
};

$.hasClass = function(obj, klass) {
  return (' ' + obj.className + ' ').indexOf(' ' + klass + ' ') > -1;
};

$.addClass = function(obj, klass) {
  if (!$.hasClass(obj, klass))
    obj.className = (obj.className + " " + klass);
};

$.removeClass = function(obj, klass) {
  obj.className = obj.className.replace(new RegExp(
      '(^|\\s)' + klass + '(?:\\s|$)'), '$1');
};



$.event = {
  get: function(e, win) {
    win = win || window;
    return e || win.event;
  },
  getWheel: function(e) {
    return e.wheelDelta? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  },
  isRightClick: function(e) {
    return (e.which == 3 || e.button == 2);
  },
  getPos: function(e, win) {
    // get mouse position
    win = win || window;
    e = e || win.event;
    var doc = win.document;
    doc = doc.documentElement || doc.body;
    //TODO(nico): make touch event handling better
    if(e.touches && e.touches.length) {
      e = e.touches[0];
    }
    var page = {
      x: e.pageX || (e.clientX + doc.scrollLeft),
      y: e.pageY || (e.clientY + doc.scrollTop)
    };
    return page;
  },
  stop: function(e) {
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }
};

$jit.util = $jit.id = $;

var Class = function(properties) {
  properties = properties || {};
  var klass = function() {
    for ( var key in this) {
      if (typeof this[key] != 'function')
        this[key] = $.unlink(this[key]);
    }
    this.constructor = klass;
    if (Class.prototyping)
      return this;
    var instance = this.initialize ? this.initialize.apply(this, arguments)
        : this;
    //typize
    this.$$family = 'class';
    return instance;
  };

  for ( var mutator in Class.Mutators) {
    if (!properties[mutator])
      continue;
    properties = Class.Mutators[mutator](properties, properties[mutator]);
    delete properties[mutator];
  }

  $.extend(klass, this);
  klass.constructor = Class;
  klass.prototype = properties;
  return klass;
};

Class.Mutators = {

  Implements: function(self, klasses) {
    $.each($.splat(klasses), function(klass) {
      Class.prototyping = klass;
      var instance = (typeof klass == 'function') ? new klass : klass;
      for ( var prop in instance) {
        if (!(prop in self)) {
          self[prop] = instance[prop];
        }
      }
      delete Class.prototyping;
    });
    return self;
  }

};

$.extend(Class, {

  inherit: function(object, properties) {
    for ( var key in properties) {
      var override = properties[key];
      var previous = object[key];
      var type = $.type(override);
      if (previous && type == 'function') {
        if (override != previous) {
          Class.override(object, key, override);
        }
      } else if (type == 'object') {
        object[key] = $.merge(previous, override);
      } else {
        object[key] = override;
      }
    }
    return object;
  },

  override: function(object, name, method) {
    var parent = Class.prototyping;
    if (parent && object[name] != parent[name])
      parent = null;
    var override = function() {
      var previous = this.parent;
      this.parent = parent ? parent[name] : object[name];
      var value = method.apply(this, arguments);
      this.parent = previous;
      return value;
    };
    object[name] = override;
  }

});

Class.prototype.implement = function() {
  var proto = this.prototype;
  $.each(Array.prototype.slice.call(arguments || []), function(properties) {
    Class.inherit(proto, properties);
  });
  return this;
};

$jit.Class = Class;

/*
  Object: $jit.json
  
  Provides JSON utility functions.
  
  Most of these functions are JSON-tree traversal and manipulation functions.
*/
$jit.json = {
  
  /*
     Method: getSubtree
  
     Returns the subtree that matches the given id.
  
     Parameters:
  
        tree - (object) A JSON tree object. See also <Loader.loadJSON>.
        id - (string) A node *unique* identifier.
  
     Returns:
  
        A subtree having a root node matching the given id. Returns null if no subtree matching the id is found.

  */
  getSubtree: function(tree, id) {
    if (tree.id == id)
      return tree;
    for ( var i = 0, ch = tree.children; ch && i < ch.length; i++) {
      var t = this.getSubtree(ch[i], id);
      if (t != null)
        return t;
    }
    return null;
  }
};


/*
     An object containing multiple type of transformations. 
*/

$jit.Trans = {
  $extend: true,
  
  linear: function(p){
    return p;
  }
};

var Trans = $jit.Trans;

(function(){

  var makeTrans = function(transition, params){
    params = $.splat(params);
    return $.extend(transition, {
      easeIn: function(pos){
        return transition(pos, params);
      },
      easeOut: function(pos){
        return 1 - transition(1 - pos, params);
      },
      easeInOut: function(pos){
        return (pos <= 0.5)? transition(2 * pos, params) / 2 : (2 - transition(
            2 * (1 - pos), params)) / 2;
      }
    });
  };

  var transitions = {};

  $.each(transitions, function(val, key){
    Trans[key] = makeTrans(val);
  });

  $.each( [
      'Quad', 'Cubic', 'Quart', 'Quint'
  ], function(elem, i){
    Trans[elem] = makeTrans(function(p){
      return Math.pow(p, [
        i + 2
      ]);
    });
  });

})();

/*
   A Class that can perform animations for generic objects.

   If you are looking for animation transitions please take a look at the <Trans> object.

   Used by:

   <Graph.Plot>
   
   Based on:
   
   The Animation class is based in the MooTools Framework <http://mootools.net>. Copyright (c) 2006-2009 Valerio Proietti, <http://mad4milk.net/>. MIT license <http://mootools.net/license.txt>.

*/

var Animation = new Class( {

  initialize: function(options){
    this.setOptions(options);
  },

  setOptions: function(options){
    var opt = {
      duration: 2500,
      fps: 40,
      transition: Trans.Quart.easeInOut,
      compute: $.empty,
      complete: $.empty,
      link: 'ignore'
    };
    this.opt = $.merge(opt, options || {});
    return this;
  },

  step: function(){
    var time = $.time(), opt = this.opt;
    if (time < this.time + opt.duration) {
      var delta = opt.transition((time - this.time) / opt.duration);
      opt.compute(delta);
    } else {
      this.timer = clearInterval(this.timer);
      opt.compute(1);
      opt.complete();
    }
  },

  start: function(){
    if (!this.check())
      return this;
    this.time = 0;
    this.startTimer();
    return this;
  },

  startTimer: function(){
    var that = this, fps = this.opt.fps;
    if (this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = setInterval((function(){
      that.step();
    }), Math.round(1000 / fps));
    return true;
  },

  pause: function(){
    this.stopTimer();
    return this;
  },

  resume: function(){
    this.startTimer();
    return this;
  },

  stopTimer: function(){
    if (!this.timer)
      return false;
    this.time = $.time() - this.time;
    this.timer = clearInterval(this.timer);
    return true;
  },

  check: function(){
    if (!this.timer)
      return true;
    if (this.opt.link == 'cancel') {
      this.stopTimer();
      return true;
    }
    return false;
  }
});


var Options = function() {
  var args = arguments;
  for(var i=0, l=args.length, ans={}; i<l; i++) {
    var opt = Options[args[i]];
    if(opt.$extend) {
      $.extend(ans, opt);
    } else {
      ans[args[i]] = opt;  
    }
  }
  return ans;
};

/*
 * File: Options.Canvas.js
 *
*/

/*
  Object: Options.Canvas
  
  These are Canvas general options, like where to append it in the DOM, its dimensions, background, 
  and other more advanced options.
  
  Syntax:
  
  (start code js)

  Options.Canvas = {
    injectInto: 'id',
    type: '2D', //'3D'
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false
  };  
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    injectInto: 'someContainerId',
    width: 500,
    height: 700
  });
  (end code)
  
  Parameters:
  
  injectInto - *required* (string|element) The id of the DOM container for the visualization. It can also be an Element provided that it has an id.
  type - (string) Context type. Default's 2D but can be 3D for webGL enabled browsers.
  width - (number) Default's to the *container's offsetWidth*. The width of the canvas.
  height - (number) Default's to the *container's offsetHeight*. The height of the canvas.
  useCanvas - (boolean|object) Default's *false*. You can pass another <Canvas> instance to be used by the visualization.
  withLabels - (boolean) Default's *true*. Whether to use a label container for the visualization.
  background - (boolean|object) Default's *false*. An object containing information about the rendering of a background canvas.
*/

Options.Canvas = {
    $extend: true,
    
    injectInto: 'id',
    type: '2D',
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false,
    
    Scene: {
      Lighting: {
        enable: false,
        ambient: [1, 1, 1],
        directional: {
          direction: { x: -100, y: -100, z: -100 },
          color: [0.5, 0.3, 0.1]
        }
      }
    }
};

/*
 * File: Options.Tree.js
 *
*/

/*
  Object: Options.Tree
  
  Options related to (strict) Tree layout algorithms. These options are used by the <ST> visualization.
  
  Syntax:
  
  (start code js)
  Options.Tree = {
    orientation: "left",
    subtreeOffset: 8,
    siblingOffset: 5,
    indent:10,
    multitree: false,
    align:"center"
  };
  (end code)
  
  Example:
  
  (start code js)
  var st = new $jit.ST({
    orientation: 'left',
    subtreeOffset: 1,
    siblingOFfset: 5,
    multitree: true
  });
  (end code)

  Parameters:
    
  subtreeOffset - (number) Default's 8. Separation offset between subtrees.
  siblingOffset - (number) Default's 5. Separation offset between siblings.
  orientation - (string) Default's 'left'. Tree orientation layout. Possible values are 'left', 'top', 'right', 'bottom'.
  align - (string) Default's *center*. Whether the tree alignment is 'left', 'center' or 'right'.
  indent - (number) Default's 10. Used when *align* is left or right and shows an indentation between parent and children.
  multitree - (boolean) Default's *false*. Used with the node $orn data property for creating multitrees.
     
*/
Options.Tree = {
    $extend: true,
    
    orientation: "left",
    subtreeOffset: 8,
    siblingOffset: 5,
    indent:10,
    multitree: false,
    align:"center"
};


/*
 * File: Options.Node.js
 *
*/

/*
  Object: Options.Node

  Provides Node rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Node = {
    overridable: false,
    type: 'circle',
    color: '#ccb',
    alpha: 1,
    dim: 3,
    height: 20,
    width: 90,
    autoHeight: false,
    autoWidth: false,
    lineWidth: 1,
    transform: true,
    align: "center",
    angularWidth:1,
    span:1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Node: {
      overridable: true,
      width: 30,
      autoHeight: true,
      type: 'rectangle'
    }
  });
  (end code)
  
  Parameters:

  overridable - (boolean) Default's *false*. Determine whether or not general node properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *circle*. Node's shape. Node built-in types include 'circle', 'rectangle', 'square', 'ellipse', 'triangle', 'star'. The default Node type might vary in each visualization. You can also implement (non built-in) custom Node types into your visualizations.
  color - (string) Default's *#ccb*. Node color.
  alpha - (number) Default's *1*. The Node's alpha value. *1* is for full opacity.
  dim - (number) Default's *3*. An extra parameter used by 'circle', 'square', 'triangle' and 'star' node types. Depending on each shape, this parameter can set the radius of a circle, half the length of the side of a square, half the base and half the height of a triangle or the length of a side of a star (concave decagon).
  height - (number) Default's *20*. Used by 'rectangle' and 'ellipse' node types. The height of the node shape.
  width - (number) Default's *90*. Used by 'rectangle' and 'ellipse' node types. The width of the node shape.
  autoHeight - (boolean) Default's *false*. Whether to set an auto height for the node depending on the content of the Node's label.
  autoWidth - (boolean) Default's *false*. Whether to set an auto width for the node depending on the content of the Node's label.
  lineWidth - (number) Default's *1*. Used only by some Node shapes. The line width of the strokes of a node.
  transform - (boolean) Default's *true*. Only used by the <Hypertree> visualization. Whether to scale the nodes according to the moebius transformation.
  align - (string) Default's *center*. Possible values are 'center', 'left' or 'right'. Used only by the <ST> visualization, these parameters are used for aligning nodes when some of they dimensions vary.
  angularWidth - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The amount of relative 'space' set for a node.
  span - (number) Default's *1*. Used in radial layouts (like <RGraph> or <Sunburst> visualizations). The angle span amount set for a node.
  CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting a Node.

*/
Options.Node = {
  $extend: false,
  
  overridable: false,
  type: 'circle',
  color: '#ccb',
  alpha: 1,
  dim: 3,
  height: 20,
  width: 90,
  autoHeight: false,
  autoWidth: false,
  lineWidth: 1,
  transform: true,
  align: "center",
  angularWidth:1,
  span:1,
  //Raw canvas styles to be
  //applied to the context instance
  //before plotting a node
  CanvasStyles: {}
};


/*
 * File: Options.Edge.js
 *
*/

/*
  Object: Options.Edge

  Provides Edge rendering options for Tree and Graph based visualizations.

  Syntax:
    
  (start code js)
  Options.Edge = {
    overridable: false,
    type: 'line',
    color: '#ccb',
    lineWidth: 1,
    dim:15,
    alpha: 1,
    CanvasStyles: {}
  };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Edge: {
      overridable: true,
      type: 'line',
      color: '#fff',
      CanvasStyles: {
        shadowColor: '#ccc',
        shadowBlur: 10
      }
    }
  });
  (end code)
  
  Parameters:
    
   overridable - (boolean) Default's *false*. Determine whether or not general edges properties can be overridden by a particular <Graph.Adjacence>.
   type - (string) Default's 'line'. Edge styles include 'line', 'hyperline', 'arrow'. The default Edge type might vary in each visualization. You can also implement custom Edge types.
   color - (string) Default's '#ccb'. Edge color.
   lineWidth - (number) Default's *1*. Line/Edge width.
   alpha - (number) Default's *1*. The Edge's alpha value. *1* is for full opacity.
   dim - (number) Default's *15*. An extra parameter used by other complex shapes such as quadratic, bezier or arrow, to determine the shape's diameter.
   epsilon - (number) Default's *7*. Only used when using *enableForEdges* in <Options.Events>. This dimension is used to create an area for the line where the contains method for the edge returns *true*.
   CanvasStyles - (object) Default's an empty object (i.e. {}). Attach any other canvas specific property that you'd set to the canvas context before plotting an Edge.

  See also:
   
   If you want to know more about how to customize Node/Edge data per element, in the JSON or programmatically, take a look at this article.
*/
Options.Edge = {
  $extend: false,
  
  overridable: false,
  type: 'line',
  color: '#ccb',
  lineWidth: 1,
  dim:15,
  alpha: 1,
  epsilon: 7,

  //Raw canvas styles to be
  //applied to the context instance
  //before plotting an edge
  CanvasStyles: {}
};



/*
 * File: Options.Label.js
 *
*/
/*
  Object: Options.Label

  Provides styling for Labels such as font size, family, etc. Also sets Node labels as HTML,r canvas elements.  

  Syntax:
  
  (start code js)
    Options.Label = {
      overridable: false,
      type: 'HTML', 
      style: ' ',
      size: 10,
      family: 'sans-serif',
      textAlign: 'center',
      textBaseline: 'alphabetic',
      color: '#fff'
    };
  (end code)
  
  Example:
  
  (start code js)
  var viz = new $jit.Viz({
    Label: {
      type: 'Native',
      size: 11,
      color: '#ccc'
    }
  });
  (end code)
  
  Parameters:
    
  overridable - (boolean) Default's *false*. Determine whether or not general label properties can be overridden by a particular <Graph.Node>.
  type - (string) Default's *HTML*. The type for the labels. Can be 'HTML', or 'Native' canvas labels.
  style - (string) Default's *empty string*. Can be 'italic' or 'bold'. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  size - (number) Default's *10*. The font's size. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  family - (string) Default's *sans-serif*. The font's family. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
  color - (string) Default's *#fff*. The font's color. This parameter is only taken into account when using 'Native' canvas labels. For DOM based labels the className *node* is added to the DOM element for styling via CSS. You can also use <Options.Controller> methods to style individual labels.
*/
Options.Label = {
  $extend: false,
  
  overridable: false,
  type: 'HTML', 
  style: ' ',
  size: 10,
  family: 'sans-serif',
  textAlign: 'center',
  textBaseline: 'alphabetic',
  color: '#fff'
};


Options.NodeStyles = {};


Options.Events = {};

/*
 * File: Options.Navigation.js
 *
*/

/*
  Object: Options.Navigation
  
  Panning and zooming options for Graph/Tree based visualizations. These options are implemented 
  by all visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Navigation = {
    enable: false,
    type: 'auto',
    panning: false, //true, 'avoid nodes'
    zooming: false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    Navigation: {
      enable: true,
      panning: 'avoid nodes',
      zooming: 20
    }
  });
  (end code)
  
  Parameters:
  
  enable - (boolean) Default's *false*. Whether to enable Navigation capabilities.
  type - (string) Default's 'auto'. Whether to attach the navigation events onto the HTML labels (via event delegation) or to use the custom 'Native' canvas Event System of the library. When 'auto' set when you let the <Options.Label> *type* parameter decide this.
  panning - (boolean|string) Default's *false*. Set this property to *true* if you want to add Drag and Drop panning support to the visualization. You can also set this parameter to 'avoid nodes' to enable DnD panning but disable it if the DnD is taking place over a node. This is useful when some other events like Drag & Drop for nodes are added to <Graph.Nodes>.
  zooming - (boolean|number) Default's *false*. Set this property to a numeric value to turn mouse-scroll zooming on. The number will be proportional to the mouse-scroll sensitivity.
  
*/

Options.Navigation = {
  $extend: false,
  
  enable: false,
  type: 'auto',
  panning: false, //true | 'avoid nodes'
  zooming: false
};

/*
 * File: Options.Controller.js
 *
*/

/*
  Object: Options.Controller
  
  Provides controller methods. Controller methods are callback functions that get called at different stages 
  of the animation, computing or plotting of the visualization.
  
  Implemented by:
    
  All visualizations except charts (<AreaChart>, <BarChart> and <PieChart>).
  
  Syntax:
  
  (start code js)

  Options.Controller = {
    onBeforeCompute: $.empty,
    onAfterCompute:  $.empty,
    onCreateLabel:   $.empty,
    onPlaceLabel:    $.empty,
    onComplete:      $.empty,
    onBeforePlotLine:$.empty,
    onAfterPlotLine: $.empty,
    onBeforePlotNode:$.empty,
    onAfterPlotNode: $.empty,
    request:         false
  };
  
  (end code)
  
  Example:
    
  (start code js)
  var viz = new $jit.Viz({
    onBeforePlotNode: function(node) {
      if(node.selected) {
        node.setData('color', '#ffc');
      } else {
        node.removeData('color');
      }
    },
    onBeforePlotLine: function(adj) {
      if(adj.nodeFrom.selected && adj.nodeTo.selected) {
        adj.setData('color', '#ffc');
      } else {
        adj.removeData('color');
      }
    },
    onAfterCompute: function() {
      alert("computed!");
    }
  });
  (end code)
  
  Parameters:

   onBeforeCompute(node) - This method is called right before performing all computations and animations. The selected <Graph.Node> is passed as parameter.
   onAfterCompute() - This method is triggered after all animations or computations ended.
   onCreateLabel(domElement, node) - This method receives a new label DIV element as first parameter, and the corresponding <Graph.Node> as second parameter. This method will only be called once for each label. This method is useful when adding events or styles to the labels used by the JIT.
   onPlaceLabel(domElement, node) - This method receives a label DIV element as first parameter and the corresponding <Graph.Node> as second parameter. This method is called each time a label has been placed in the visualization, for example at each step of an animation, and thus it allows you to update the labels properties, such as size or position. Note that onPlaceLabel will be triggered after updating the labels positions. That means that, for example, the left and top css properties are already updated to match the nodes positions. Width and height properties are not set however.
   onBeforePlotNode(node) - This method is triggered right before plotting each <Graph.Node>. This method is useful for changing a node style right before plotting it.
   onAfterPlotNode(node) - This method is triggered right after plotting each <Graph.Node>.
   onBeforePlotLine(adj) - This method is triggered right before plotting a <Graph.Adjacence>. This method is useful for adding some styles to a particular edge before being plotted.
   onAfterPlotLine(adj) - This method is triggered right after plotting a <Graph.Adjacence>.

    *Used in <ST>, <TM.Base> and <Icicle> visualizations*
    
    request(nodeId, level, onComplete) - This method is used for buffering information into the visualization. When clicking on an empty node, the visualization will make a request for this node's subtrees, specifying a given level for this subtree (defined by _levelsToShow_). Once the request is completed, the onComplete callback should be called with the given result. This is useful to provide on-demand information into the visualizations withought having to load the entire information from start. The parameters used by this method are _nodeId_, which is the id of the root of the subtree to request, _level_ which is the depth of the subtree to be requested (0 would mean just the root node). _onComplete_ is an object having the callback method _onComplete.onComplete(json)_ that should be called once the json has been retrieved.  
 
 */
Options.Controller = {
  $extend: true,
  
  onBeforeCompute: $.empty,
  onAfterCompute:  $.empty,
  onCreateLabel:   $.empty,
  onPlaceLabel:    $.empty,
  onComplete:      $.empty,
  onBeforePlotLine:$.empty,
  onAfterPlotLine: $.empty,
  onBeforePlotNode:$.empty,
  onAfterPlotNode: $.empty,
  request:         false
};



/*
 * File: Canvas.js
 *
 */

/*
 Class: Canvas
 
 	A canvas widget used by all visualizations. The canvas object can be accessed by doing *viz.canvas*. If you want to 
 	know more about <Canvas> options take a look at <Options.Canvas>.
 
 A canvas widget is a set of DOM elements that wrap the native canvas DOM Element providing a consistent API and behavior 
 across all browsers. It can also include Elements to add DOM ( or HTML) label support to all visualizations.
 
 Example:
 
 Suppose we have this HTML
 
 (start code xml)
 	<div id="infovis"></div>
 (end code)
 
 Now we create a new Visualization
 
 (start code js)
 	var viz = new $jit.Viz({
 		//Where to inject the canvas. Any div container will do.
 		'injectInto':'infovis',
		 //width and height for canvas. 
		 //Default's to the container offsetWidth and Height.
		 'width': 900,
		 'height':500
	 });
 (end code)

 The generated HTML will look like this
 
 (start code xml)
 <div id="infovis">
 	<div id="infovis-canvaswidget" style="position:relative;">
 	<canvas id="infovis-canvas" width=900 height=500
 	style="position:absolute; top:0; left:0; width:900px; height:500px;" />
 	<div id="infovis-label"
 	style="overflow:visible; position:absolute; top:0; left:0; width:900px; height:0px">
 	</div>
 	</div>
 </div>
 (end code)
 
 As you can see, the generated HTML consists of a canvas DOM Element of id *infovis-canvas* and a div label container
 of id *infovis-label*, wrapped in a main div container of id *infovis-canvaswidget*.
 */

var Canvas;
(function() {
  //check for native canvas support
  var canvasType = typeof HTMLCanvasElement,
      supportsCanvas = (canvasType == 'object' || canvasType == 'function');
  //create element function
  function $E(tag, props) {
    var elem = document.createElement(tag);
    for(var p in props) {
      if(typeof props[p] == "object") {
        $.extend(elem[p], props[p]);
      } else {
        elem[p] = props[p];
      }
    }
    if (tag == "canvas" && !supportsCanvas && G_vmlCanvasManager) {
      elem = G_vmlCanvasManager.initElement(document.body.appendChild(elem));
    }
    return elem;
  }
  //canvas widget which we will call just Canvas
  $jit.Canvas = Canvas = new Class({
    canvases: [],
    pos: false,
    element: false,
    labelContainer: false,
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,
    
    initialize: function(viz, opt) {
      this.viz = viz;
      this.opt = this.config = opt;
      var id = $.type(opt.injectInto) == 'string'? 
          opt.injectInto:opt.injectInto.id,
          type = opt.type,
          idLabel = id + "-label", 
          wrapper = $(id),
          width = opt.width || wrapper.offsetWidth,
          height = opt.height || wrapper.offsetHeight;
      this.id = id;
      //canvas options
      var canvasOptions = {
        injectInto: id,
        width: width,
        height: height
      };
      //create main wrapper
      this.element = $E('div', {
        'id': id + '-canvaswidget',
        'style': {
          'position': 'relative',
          'width': width + 'px',
          'height': height + 'px'
        }
      });
      //create label container
      this.labelContainer = this.createLabelContainer(opt.Label.type, 
          idLabel, canvasOptions);
      //create primary canvas
      this.canvases.push(new Canvas.Base[type]({
        config: $.extend({idSuffix: '-canvas'}, canvasOptions),
        plot: function(base) {
          viz.fx.plot();
        },
        resize: function() {
          viz.refresh();
        }
      }));
      //create secondary canvas
      var back = opt.background;
      if(back) {
        var backCanvas = new Canvas.Background[back.type](viz, $.extend(back, canvasOptions));
        this.canvases.push(new Canvas.Base[type](backCanvas));
      }
      //insert canvases
      var len = this.canvases.length;
      while(len--) {
        this.element.appendChild(this.canvases[len].canvas);
        if(len > 0) {
          this.canvases[len].plot();
        }
      }
      this.element.appendChild(this.labelContainer);
      wrapper.appendChild(this.element);
      //Update canvas position when the page is scrolled.
      var timer = null, that = this;
      $.addEvent(window, 'scroll', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          // that.getPos(true); //update canvas position
        }, 500);
      });
    },
    /*
      Method: getCtx
      
      Returns the main canvas context object
      
      Example:
      
      (start code js)
       var ctx = canvas.getCtx();
       //Now I can use the native canvas context
       //and for example change some canvas styles
       ctx.globalAlpha = 1;
      (end code)
    */
    getCtx: function(i) {
      return this.canvases[i || 0].getCtx();
    },
    /*
      Method: getConfig
      
      Returns the current Configuration for this Canvas Widget.
      
      Example:
      
      (start code js)
       var config = canvas.getConfig();
      (end code)
    */
    getConfig: function() {
      return this.opt;
    },
    /*
      Method: getElement

      Returns the main Canvas DOM wrapper
      
      Example:
      
      (start code js)
       var wrapper = canvas.getElement();
       //Returns <div id="infovis-canvaswidget" ... >...</div> as element
      (end code)
    */
    getElement: function() {
      return this.element;
    },
    /*
      Method: getSize
      
      Returns canvas dimensions.
      
      Returns:
      
      An object with *width* and *height* properties.
      
      Example:
      (start code js)
      canvas.getSize(); //returns { width: 900, height: 500 }
      (end code)
    */
    getSize: function(i) {
      return this.canvases[i || 0].getSize();
    },
    /*
      Method: resize
      
      Resizes the canvas.
      
      Parameters:
      
      width - New canvas width.
      height - New canvas height.
      
      Example:
      
      (start code js)
       canvas.resize(width, height);
      (end code)
    
    */
    resize: function(width, height) {
      this.getPos(true);
      this.translateOffsetX = this.translateOffsetY = 0;
      this.scaleOffsetX = this.scaleOffsetY = 1;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].resize(width, height);
      }
      var style = this.element.style;
      style.width = width + 'px';
      style.height = height + 'px';
      if(this.labelContainer)
        this.labelContainer.style.width = width + 'px';
    },
    /*
      Method: translate
      
      Applies a translation to the canvas.
      
      Parameters:
      
      x - (number) x offset.
      y - (number) y offset.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.translate(30, 30);
      (end code)
    
    */
    translate: function(x, y, disablePlot) {
      this.translateOffsetX += x*this.scaleOffsetX;
      this.translateOffsetY += y*this.scaleOffsetY;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].translate(x, y, disablePlot);
      }
    },
    /*
      Method: scale
      
      Scales the canvas.
      
      Parameters:
      
      x - (number) scale value.
      y - (number) scale value.
      disablePlot - (boolean) Default's *false*. Set this to *true* if you don't want to refresh the visualization.
      
      Example:
      
      (start code js)
       canvas.scale(0.5, 0.5);
      (end code)
    
    */
    scale: function(x, y, disablePlot) {
      var px = this.scaleOffsetX * x,
          py = this.scaleOffsetY * y;
      var dx = this.translateOffsetX * (x -1) / px,
          dy = this.translateOffsetY * (y -1) / py;
      this.scaleOffsetX = px;
      this.scaleOffsetY = py;
      for(var i=0, l=this.canvases.length; i<l; i++) {
        this.canvases[i].scale(x, y, true);
      }
      this.translate(dx, dy, false);
    },
    /*
       Method: clear
       
       Clears the canvas.
    */
    clear: function(i){
      this.canvases[i||0].clear();
    },
    
    path: function(type, action){
      var ctx = this.canvases[0].getCtx();
      ctx.beginPath();
      action(ctx);
      ctx[type]();
      ctx.closePath();
    },
    
    createLabelContainer: function(type, idLabel, dim) {
      var NS = 'http://www.w3.org/2000/';
      if(type == 'HTML') {
        return $E('div', {
          'id': idLabel,
          'style': {
            'overflow': 'visible',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': dim.width + 'px',
            'height': 0
          }
        });
      }
    }
  });
  //base canvas wrapper
  Canvas.Base = {};
  Canvas.Base['2D'] = new Class({
    translateOffsetX: 0,
    translateOffsetY: 0,
    scaleOffsetX: 1,
    scaleOffsetY: 1,

    initialize: function(viz) {
      this.viz = viz;
      this.opt = viz.config;
      this.size = false;
      this.createCanvas();
      this.translateToCenter();
    },
    createCanvas: function() {
      var opt = this.opt,
          width = opt.width,
          height = opt.height;
      this.canvas = $E('canvas', {
        'id': opt.injectInto + opt.idSuffix,
        'width': width,
        'height': height,
        'style': {
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'width': width + 'px',
          'height': height + 'px'
        }
      });
    },
    getCtx: function() {
      if(!this.ctx) 
        return this.ctx = this.canvas.getContext('2d');
      return this.ctx;
    },
    getSize: function() {
      if(this.size) return this.size;
      var canvas = this.canvas;
      return this.size = {
        width: canvas.width,
        height: canvas.height
      };
    },
    translateToCenter: function(ps) {
      var size = this.getSize(),
          width = ps? (size.width - ps.width - this.translateOffsetX*2) : size.width;
          height = ps? (size.height - ps.height - this.translateOffsetY*2) : size.height;
      var ctx = this.getCtx();
      ps && ctx.scale(1/this.scaleOffsetX, 1/this.scaleOffsetY);
      ctx.translate(width/2, height/2);
    },
    resize: function(width, height) {
      var size = this.getSize(),
          canvas = this.canvas,
          styles = canvas.style;
      this.size = false;
      canvas.width = width;
      canvas.height = height;
      styles.width = width + "px";
      styles.height = height + "px";
      //small ExCanvas fix
      if(!supportsCanvas) {
        this.translateToCenter(size);
      } else {
        this.translateToCenter();
      }
      this.translateOffsetX =
        this.translateOffsetY = 0;
      this.scaleOffsetX = 
        this.scaleOffsetY = 1;
      this.clear();
      this.viz.resize(width, height, this);
    },
    translate: function(x, y, disablePlot) {
      var sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.translateOffsetX += x*sx;
      this.translateOffsetY += y*sy;
      this.getCtx().translate(x, y);
      !disablePlot && this.plot();
    },
    scale: function(x, y, disablePlot) {
      this.scaleOffsetX *= x;
      this.scaleOffsetY *= y;
      this.getCtx().scale(x, y);
      !disablePlot && this.plot();
    },
    clear: function(){
      var size = this.getSize(),
          ox = this.translateOffsetX,
          oy = this.translateOffsetY,
          sx = this.scaleOffsetX,
          sy = this.scaleOffsetY;
      this.getCtx().clearRect((-size.width / 2 - ox) * 1/sx, 
                              (-size.height / 2 - oy) * 1/sy, 
                              size.width * 1/sx, size.height * 1/sy);
    },
    plot: function() {
      this.clear();
      this.viz.plot(this);
    }
  });
  
})();


/*
   Class: Complex
    
   A multi-purpose Complex Class with common methods.
 
   Description:
 
   The <Complex> class, just like the <Polar> class, is used by the <Hypertree>, <ST> and <RGraph> as a 2D point representation.
 
   See also:
 
   <http://en.wikipedia.org/wiki/Complex_number>

   Parameters:

   x - _optional_ A Complex number real part.
   y - _optional_ A Complex number imaginary part.
 
*/

var Complex = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

$jit.Complex = Complex;

Complex.prototype = {
    /*
       Method: getc
    
       Returns a complex number.
    
       Returns:
    
          A complex number.
    */
    getc: function() {
        return this;
    },

    /*
       Method: getp
    
       Returns a <Polar> representation of this number.
    
       Parameters:

       simple - _optional_ If *true*, this method will return only an object holding theta and rho properties and not a <Polar> instance. Default's *false*.

       Returns:
    
          A variable in <Polar> coordinates.
    */
    getp: function(simple) {
        return this.toPolar(simple);
    },


    /*
       Method: set
    
       Sets a number.

       Parameters:

       c - A <Complex> or <Polar> instance.
    
    */
    set: function(c) {
      c = c.getc(true);
      this.x = c.x; 
      this.y = c.y;
    },

    /*
       Method: setc
    
       Sets a complex number.

       Parameters:

       x - A <Complex> number Real part.
       y - A <Complex> number Imaginary part.
    
    */
    setc: function(x, y) {
        this.x = x; 
        this.y = y;
    },

    /*
       Method: setp
    
       Sets a polar number.

       Parameters:

       theta - A <Polar> number theta property.
       rho - A <Polar> number rho property.
    
    */
    setp: function(theta, rho) {
        this.x = Math.cos(theta) * rho;
        this.y = Math.sin(theta) * rho;
    },

    /*
       Method: clone
    
       Returns a copy of the current object.
    
       Returns:
    
          A copy of the real object.
    */
    clone: function() {
        return new Complex(this.x, this.y);
    },

    /*
       Method: toPolar
    
       Transforms cartesian to polar coordinates.
    
       Parameters:

       simple - _optional_ If *true* this method will only return an object with theta and rho properties (and not the whole <Polar> instance). Default's *false*.
       
       Returns:
    
          A new <Polar> instance.
    */
    
    toPolar: function(simple) {
        var rho = this.norm();
        var atan = Math.atan2(this.y, this.x);
        if(atan < 0) atan += Math.PI * 2;
        if(simple) return { 'theta': atan, 'rho': rho };
        return new Polar(atan, rho);
    },
    /*
       Method: norm
    
       Calculates a <Complex> number norm.
    
       Returns:
    
          A real number representing the complex norm.
    */
    norm: function () {
        return Math.sqrt(this.squaredNorm());
    },
    
    /*
       Method: squaredNorm
    
       Calculates a <Complex> number squared norm.
    
       Returns:
    
          A real number representing the complex squared norm.
    */
    squaredNorm: function () {
        return this.x*this.x + this.y*this.y;
    },

    /*
       Method: add
    
       Returns the result of adding two complex numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    add: function(pos) {
        return new Complex(this.x + pos.x, this.y + pos.y);
    },

    /*
       Method: prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Does not alter the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    prod: function(pos) {
        return new Complex(this.x*pos.x - this.y*pos.y, this.y*pos.x + this.x*pos.y);
    },

    /*
       Method: conjugate
    
       Returns the conjugate of this <Complex> number.

       Does not alter the original object.

       Returns:
    
         The conjugate of this <Complex> number.
    */
    conjugate: function() {
        return new Complex(this.x, -this.y);
    },


    /*
       Method: scale
    
       Returns the result of scaling a <Complex> instance.
       
       Does not alter the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    scale: function(factor) {
        return new Complex(this.x * factor, this.y * factor);
    },

    /*
       Method: equals
    
       Comparison method.

       Returns *true* if both real and imaginary parts are equal.

       Parameters:

       c - A <Complex> instance.

       Returns:

       A boolean instance indicating if both <Complex> numbers are equal.
    */
    equals: function(c) {
        return this.x == c.x && this.y == c.y;
    },

    /*
       Method: $add
    
       Returns the result of adding two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of adding two complex numbers.
    */
    $add: function(pos) {
        this.x += pos.x; this.y += pos.y;
        return this;    
    },
    
    /*
       Method: $prod
    
       Returns the result of multiplying two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> instance.
    
       Returns:
    
         The result of multiplying two complex numbers.
    */
    $prod:function(pos) {
        var x = this.x, y = this.y;
        this.x = x*pos.x - y*pos.y;
        this.y = y*pos.x + x*pos.y;
        return this;
    },
    
    /*
       Method: $conjugate
    
       Returns the conjugate for this <Complex>.
       
       Alters the original object.

       Returns:
    
         The conjugate for this complex.
    */
    $conjugate: function() {
        this.y = -this.y;
        return this;
    },
    
    /*
       Method: $scale
    
       Returns the result of scaling a <Complex> instance.
       
       Alters the original object.

       Parameters:
    
          factor - A scale factor.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $scale: function(factor) {
        this.x *= factor; this.y *= factor;
        return this;
    },
    
    /*
       Method: $div
    
       Returns the division of two <Complex> numbers.
       
       Alters the original object.

       Parameters:
    
          pos - A <Complex> number.
    
       Returns:
    
         The result of scaling this complex to a factor.
    */
    $div: function(pos) {
        var x = this.x, y = this.y;
        var sq = pos.squaredNorm();
        this.x = x * pos.x + y * pos.y; this.y = y * pos.x - x * pos.y;
        return this.$scale(1 / sq);
    },

    /*
      Method: isZero
   
      Returns *true* if the number is zero.
   
   */
    isZero: function () {
      var almostZero = 0.0001, abs = Math.abs;
      return abs(this.x) < almostZero && abs(this.y) < almostZero;
    }
};

var $C = function(a, b) { return new Complex(a, b); };

Complex.KER = $C(0, 0);



/*
 * File: Graph.js
 *
*/

/*
 Class: Graph

 A Graph Class that provides useful manipulation functions. You can find more manipulation methods in the <Graph.Util> object.

 An instance of this class can be accessed by using the *graph* parameter of any tree or graph visualization.
 
 Example:

 (start code js)
   //create new visualization
   var viz = new $jit.Viz(options);
   //load JSON data
   viz.loadJSON(json);
   //access model
   viz.graph; //<Graph> instance
 (end code)
 
 Implements:
 
 The following <Graph.Util> methods are implemented in <Graph>
 
  - <Graph.Util.getNode>
  - <Graph.Util.eachNode>
  - <Graph.Util.computeLevels>
  - <Graph.Util.eachBFS>
  - <Graph.Util.clean>
  - <Graph.Util.getClosestNodeToPos>
  - <Graph.Util.getClosestNodeToOrigin>
 
*/  

$jit.Graph = new Class({

  initialize: function(opt, Node, Edge, Label) {
    var innerOptions = {
    'klass': Complex,
    'Node': {}
    };
    this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
    this.opt = $.merge(innerOptions, opt || {});
    this.nodes = {};
    this.edges = {};
    
    //add nodeList methods
    var that = this;
    this.nodeList = {};
    for(var p in Accessors) {
      that.nodeList[p] = (function(p) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          that.eachNode(function(n) {
            n[p].apply(n, args);
          });
        };
      })(p);
    }

 },

/*
     Method: getNode
    
     Returns a <Graph.Node> by *id*.

     Parameters:

     id - (string) A <Graph.Node> id.

     Example:

     (start code js)
       var node = graph.getNode('nodeId');
     (end code)
*/  
 getNode: function(id) {
    if(this.hasNode(id)) return this.nodes[id];
    return false;
 },

 /*
     Method: get
    
     An alias for <Graph.Util.getNode>. Returns a node by *id*.
    
     Parameters:
    
     id - (string) A <Graph.Node> id.
    
     Example:
    
     (start code js)
       var node = graph.get('nodeId');
     (end code)
*/  
  get: function(id) {
    return this.getNode(id);
  },

 /*
   Method: getByName
  
   Returns a <Graph.Node> by *name*.
  
   Parameters:
  
   name - (string) A <Graph.Node> name.
  
   Example:
  
   (start code js)
     var node = graph.getByName('someName');
   (end code)
  */  
  getByName: function(name) {
    for(var id in this.nodes) {
      var n = this.nodes[id];
      if(n.name == name) return n;
    }
    return false;
  },

/*
   Method: getAdjacence
  
   Returns a <Graph.Adjacence> object connecting nodes with ids *id* and *id2*.

   Parameters:

   id - (string) A <Graph.Node> id.
   id2 - (string) A <Graph.Node> id.
*/  
  getAdjacence: function (id, id2) {
    if(id in this.edges) {
      return this.edges[id][id2];
    }
    return false;
 },

    /*
     Method: addNode
    
     Adds a node.
     
     Parameters:
    
      obj - An object with the properties described below

      id - (string) A node id
      name - (string) A node's name
      data - (object) A node's data hash

    See also:
    <Graph.Node>

  */  
  addNode: function(obj) { 
   if(!this.nodes[obj.id]) {  
     var edges = this.edges[obj.id] = {};
     this.nodes[obj.id] = new Graph.Node($.extend({
        'id': obj.id,
        'name': obj.name,
        'data': $.merge(obj.data || {}, {}),
        'adjacencies': edges 
      }, this.opt.Node), 
      this.opt.klass, 
      this.Node, 
      this.Edge,
      this.Label);
    }
    return this.nodes[obj.id];
  },
  
    /*
     Method: addAdjacence
    
     Connects nodes specified by *obj* and *obj2*. If not found, nodes are created.
     
     Parameters:
    
      obj - (object) A <Graph.Node> object.
      obj2 - (object) Another <Graph.Node> object.
      data - (object) A data object. Used to store some extra information in the <Graph.Adjacence> object created.

    See also:

    <Graph.Node>, <Graph.Adjacence>
    */  
  addAdjacence: function (obj, obj2, data) {
    if(!this.hasNode(obj.id)) { this.addNode(obj); }
    if(!this.hasNode(obj2.id)) { this.addNode(obj2); }
    obj = this.nodes[obj.id]; obj2 = this.nodes[obj2.id];
    if(!obj.adjacentTo(obj2)) {
      var adjsObj = this.edges[obj.id] = this.edges[obj.id] || {};
      var adjsObj2 = this.edges[obj2.id] = this.edges[obj2.id] || {};
      adjsObj[obj2.id] = adjsObj2[obj.id] = new Graph.Adjacence(obj, obj2, data, this.Edge, this.Label);
      return adjsObj[obj2.id];
    }
    return this.edges[obj.id][obj2.id];
 },


   /*
     Method: hasNode
    
     Returns a boolean indicating if the node belongs to the <Graph> or not.
     
     Parameters:
    
        id - (string) Node id.
   */  
  hasNode: function(id) {
    return id in this.nodes;
  },
  
  /*
    Method: empty

    Empties the Graph

  */
  // empty: function() { this.nodes = {}; this.edges = {};}

});

var Graph = $jit.Graph;

/*
 Object: Accessors
 
 Defines a set of methods for data, canvas and label styles manipulation implemented by <Graph.Node> and <Graph.Adjacence> instances.
 
 */
var Accessors;

(function () {
  var getDataInternal = function(prefix, prop, type, force, prefixConfig) {
    var data;
    type = type || 'current';
    prefix = "$" + (prefix ? prefix + "-" : "");

    if(type == 'current') {
      data = this.data;
    } else if(type == 'start') {
      data = this.startData;
    } else if(type == 'end') {
      data = this.endData;
    }

    var dollar = prefix + prop;

    if(force) {
      return data[dollar];
    }

    if(!this.Config.overridable)
      return prefixConfig[prop] || 0;

    return (dollar in data) ?
      data[dollar] : ((dollar in this.data) ? this.data[dollar] : (prefixConfig[prop] || 0));
  }

  Accessors = {
    /*
    Method: getData

    Returns the specified data value property.
    This is useful for querying special/reserved <Graph.Node> data properties
    (i.e dollar prefixed properties).

    Parameters:

      prop  - (string) The name of the property. The dollar sign is not needed. For
              example *getData(width)* will return *data.$width*.
      type  - (string) The type of the data property queried. Default's "current". You can access *start* and *end* 
              data properties also. These properties are used when making animations.
      force - (boolean) Whether to obtain the true value of the property (equivalent to
              *data.$prop*) or to check for *node.overridable = true* first.

    Returns:

      The value of the dollar prefixed property or the global Node/Edge property
      value if *overridable=false*

    Example:
    (start code js)
     node.getData('width'); //will return node.data.$width if Node.overridable=true;
    (end code)
    */
    getData: function(prop, type, force) {
      return getDataInternal.call(this, "", prop, type, force, this.Config);
    },

    /*
    Method: getLabelData

    Returns the specified label data value property. This is useful for
    querying special/reserved <Graph.Node> label options (i.e.
    dollar prefixed properties that match with $label-<name of label style>).

    Parameters:

      prop  - (string) The name of the property. The dollar sign prefix is not needed. For
              example *getLabelData(size)* will return *data[$label-size]*.
      type  - (string) The type of the data property queried. Default's *current*. You can access *start* and *end* 
              data properties also.
              
    See also:
    
    <Accessors.getData>.
    */
    getLabelData: function(prop, type, force) {
      return getDataInternal.call(
          this, 'label', prop, type, force, this.Label);
    },

    /*
    Method: setLabelData

    Sets the current label data with some specific value.
    This method is only useful for reserved (dollar prefixed) properties.

    Parameters:
    
    prop - (string) Name of the property. Can be any canvas property like 'shadowBlur', 'shadowColor', 'strokeStyle', etc.
    value - (mixed) The value to set to the property.
    type - (string) Default's *current*. Whether to set *start*, *current* or *end* type properties.
    
    Example:
    
    (start code js)
     node.setLabelData('size', 30);
    (end code)
    
    If we were to make an animation of a node label size then we could do
    
    (start code js)
      var node = viz.getNode('nodeId');
      set start and end values
      node.setLabelData('size', 10, 'start');
      node.setLabelData('size', 30, 'end');
      will animate nodes label size
      viz.fx.animate({
        modes: ['label-property:size'],
        duration: 1000
      });
    (end code)
    
    See also:
    
    <Accessors.setData>.
    */
    setLabelData: function(prop, value, type) {
      setDataInternal.call(this, 'label', prop, value, type);
    },

  };
})();

/*
     Class: Graph.Node

     A <Graph> node.
     
     Implements:
     
     <Accessors> methods.
     
     The following <Graph.Util> methods are implemented by <Graph.Node>
     
    - <Graph.Util.eachAdjacency>
    - <Graph.Util.eachLevel>
    - <Graph.Util.eachSubgraph>
    - <Graph.Util.eachSubnode>
    - <Graph.Util.anySubnode>
    - <Graph.Util.getSubnodes>
    - <Graph.Util.getParents>
    - <Graph.Util.isDescendantOf>     
*/
Graph.Node = new Class({
    
  initialize: function(opt, klass, Node, Edge, Label) {
    var innerOptions = {
      'id': '',
      'name': '',
      'data': {},
      'startData': {},
      'endData': {},
      'adjacencies': {},

      'selected': false,
      'drawn': false,
      'exist': false,

      'angleSpan': {
        'begin': 0,
        'end' : 0
      },

      'pos': new klass,
      'startPos': new klass,
      'endPos': new klass
    };
    
    $.extend(this, $.extend(innerOptions, opt));
    this.Config = this.Node = Node;
    this.Edge = Edge;
    this.Label = Label;
  },

    /*
       Method: adjacentTo
    
       Indicates if the node is adjacent to the node specified by id

       Parameters:
    
          id - (string) A node id.
    
       Example:
       (start code js)
        node.adjacentTo('nodeId') == true;
       (end code)
    */
    adjacentTo: function(node) {
        return node.id in this.adjacencies;
    },

    /*
       Method: getAdjacency
    
       Returns a <Graph.Adjacence> object connecting the current <Graph.Node> and the node having *id* as id.

       Parameters:
    
          id - (string) A node id.
    */  
    getAdjacency: function(id) {
        return this.adjacencies[id];
    },

    /*
      Method: getPos
   
      Returns the position of the node.
  
      Parameters:
   
         type - (string) Default's *current*. Possible values are "start", "end" or "current".
   
      Returns:
   
        A <Complex> or <Polar> instance.
  
      Example:
      (start code js)
       var pos = node.getPos('end');
      (end code)
   */
   getPos: function(type) {
       type = type || "current";
       if(type == "current") {
         return this.pos;
       } else if(type == "end") {
         return this.endPos;
       } else if(type == "start") {
         return this.startPos;
       }
   }
});

Graph.Node.implement(Accessors);

/*
     Class: Graph.Adjacence

     A <Graph> adjacence (or edge) connecting two <Graph.Nodes>.
     
     Implements:
     
     <Accessors> methods.

     See also:

     <Graph>, <Graph.Node>

     Properties:
     
      nodeFrom - A <Graph.Node> connected by this edge.
      nodeTo - Another  <Graph.Node> connected by this edge.
      data - Node data property containing a hash (i.e {}) with custom options.
*/
Graph.Adjacence = new Class({
  
  initialize: function(nodeFrom, nodeTo, data, Edge, Label) {
    this.nodeFrom = nodeFrom;
    this.nodeTo = nodeTo;
    this.data = data || {};
    this.startData = {};
    this.endData = {};
    this.Config = this.Edge = Edge;
    this.Label = Label;
  }
});

Graph.Adjacence.implement(Accessors);

/*
   Object: Graph.Util

   <Graph> traversal and processing utility object.
   
   Note:
   
   For your convenience some of these methods have also been appended to <Graph> and <Graph.Node> classes.
*/
Graph.Util = {
    /*
       filter
    
       For internal use only. Provides a filtering function based on flags.
    */
    filter: function(param) {
        if(!param || !($.type(param) == 'string')) return function() { return true; };
        var props = param.split(" ");
        return function(elem) {
            for(var i=0; i<props.length; i++) { 
              if(elem[props[i]]) { 
                return false; 
              }
            }
            return true;
        };
    },
    /*
       Method: getNode
    
       Returns a <Graph.Node> by *id*.
       
       Also implemented by:
       
       <Graph>

       Parameters:

       graph - (object) A <Graph> instance.
       id - (string) A <Graph.Node> id.

       Example:

       (start code js)
         $jit.Graph.Util.getNode(graph, 'nodeid');
         //or...
         graph.getNode('nodeid');
       (end code)
    */
    getNode: function(graph, id) {
        return graph.nodes[id];
    },
    
    /*
       Method: eachNode
    
       Iterates over <Graph> nodes performing an *action*.
       
       Also implemented by:
       
       <Graph>.

       Parameters:

       graph - (object) A <Graph> instance.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachNode(graph, function(node) {
          alert(node.name);
         });
         //or...
         graph.eachNode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachNode: function(graph, action, flags) {
        var filter = this.filter(flags);
        for(var i in graph.nodes) {
          if(filter(graph.nodes[i])) action(graph.nodes[i]);
        } 
    },
    
    /*
      Method: each
   
      Iterates over <Graph> nodes performing an *action*. It's an alias for <Graph.Util.eachNode>.
      
      Also implemented by:
      
      <Graph>.
  
      Parameters:
  
      graph - (object) A <Graph> instance.
      action - (function) A callback function having a <Graph.Node> as first formal parameter.
  
      Example:
      (start code js)
        $jit.Graph.Util.each(graph, function(node) {
         alert(node.name);
        });
        //or...
        graph.each(function(node) {
          alert(node.name);
        });
      (end code)
   */
   each: function(graph, action, flags) {
      this.eachNode(graph, action, flags); 
   },

 /*
       Method: eachAdjacency
    
       Iterates over <Graph.Node> adjacencies applying the *action* function.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:

       node - (object) A <Graph.Node>.
       action - (function) A callback function having <Graph.Adjacence> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachAdjacency(node, function(adj) {
          alert(adj.nodeTo.name);
         });
         //or...
         node.eachAdjacency(function(adj) {
           alert(adj.nodeTo.name);
         });
       (end code)
    */
    eachAdjacency: function(node, action, flags) {
        var adj = node.adjacencies, filter = this.filter(flags);
        for(var id in adj) {
          var a = adj[id];
          if(filter(a)) {
            if(a.nodeFrom != node) {
              var tmp = a.nodeFrom;
              a.nodeFrom = a.nodeTo;
              a.nodeTo = tmp;
            }
            action(a, id);
          }
        }
    },

     /*
       Method: computeLevels
    
       Performs a BFS traversal setting the correct depth for each node.
        
       Also implemented by:
       
       <Graph>.
       
       Note:
       
       The depth of each node can then be accessed by 
       >node._depth

       Parameters:

       graph - (object) A <Graph>.
       id - (string) A starting node id for the BFS traversal.
       startDepth - (optional|number) A minimum depth value. Default's 0.

    */
    computeLevels: function(graph, id, startDepth, flags) {
        startDepth = startDepth || 0;
        var filter = this.filter(flags);
        this.eachNode(graph, function(elem) {
            elem._flag = false;
            elem._depth = -1;
        }, flags);
        var root = graph.getNode(id);
        root._depth = startDepth;
        var queue = [root];
        while(queue.length != 0) {
            var node = queue.pop();
            node._flag = true;
            this.eachAdjacency(node, function(adj) {
                var n = adj.nodeTo;
                if(n._flag == false && filter(n)) {
                    if(n._depth < 0) n._depth = node._depth + 1 + startDepth;
                    queue.unshift(n);
                }
            }, flags);
        }
    },
    
    /*
       Method: eachLevel
    
       Iterates over a node's subgraph applying *action* to the nodes of relative depth between *levelBegin* and *levelEnd*.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       levelBegin - (number) A relative level value.
       levelEnd - (number) A relative level value.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

    */
    eachLevel: function(node, levelBegin, levelEnd, action, flags) {
        var d = node._depth, filter = this.filter(flags), that = this;
        levelEnd = levelEnd === false? Number.MAX_VALUE -d : levelEnd;
        (function loopLevel(node, levelBegin, levelEnd) {
            var d = node._depth;
            if(d >= levelBegin && d <= levelEnd && filter(node)) action(node, d);
            if(d < levelEnd) {
                that.eachAdjacency(node, function(adj) {
                    var n = adj.nodeTo;
                    if(n._depth > d) loopLevel(n, levelBegin, levelEnd);
                });
            }
        })(node, levelBegin + d, levelEnd + d);      
    },

    /*
       Method: eachSubgraph
    
       Iterates over a node's children recursively.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubgraph(node, function(node) {
           alert(node.name);
         });
         //or...
         node.eachSubgraph(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubgraph: function(node, action, flags) {
      this.eachLevel(node, 0, false, action, flags);
    },

    /*
       Method: eachSubnode
    
       Iterates over a node's children (without deeper recursion).
       
       Also implemented by:
       
       <Graph.Node>.
       
       Parameters:
       node - (object) A <Graph.Node>.
       action - (function) A callback function having a <Graph.Node> as first formal parameter.

       Example:
       (start code js)
         $jit.Graph.Util.eachSubnode(node, function(node) {
          alert(node.name);
         });
         //or...
         node.eachSubnode(function(node) {
           alert(node.name);
         });
       (end code)
    */
    eachSubnode: function(node, action, flags) {
        this.eachLevel(node, 1, 1, action, flags);
    },

    /*
       Method: anySubnode
    
       Returns *true* if any subnode matches the given condition.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       cond - (function) A callback function returning a Boolean instance. This function has as first formal parameter a <Graph.Node>.

       Example:
       (start code js)
         $jit.Graph.Util.anySubnode(node, function(node) { return node.name == "mynodename"; });
         //or...
         node.anySubnode(function(node) { return node.name == 'mynodename'; });
       (end code)
    */
    anySubnode: function(node, cond, flags) {
      var flag = false;
      cond = cond || $.lambda(true);
      var c = $.type(cond) == 'string'? function(n) { return n[cond]; } : cond;
      this.eachSubnode(node, function(elem) {
        if(c(elem)) flag = true;
      }, flags);
      return flag;
    },
  
    /*
       Method: getSubnodes
    
       Collects all subnodes for a specified node. 
       The *level* parameter filters nodes having relative depth of *level* from the root node. 
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.
       level - (optional|number) Default's *0*. A starting relative depth for collecting nodes.

       Returns:
       An array of nodes.

    */
    getSubnodes: function(node, level, flags) {
        var ans = [], that = this;
        level = level || 0;
        var levelStart, levelEnd;
        if($.type(level) == 'array') {
            levelStart = level[0];
            levelEnd = level[1];
        } else {
            levelStart = level;
            levelEnd = Number.MAX_VALUE - node._depth;
        }
        this.eachLevel(node, levelStart, levelEnd, function(n) {
            ans.push(n);
        }, flags);
        return ans;
    },
  
  
    /*
       Method: getParents
    
       Returns an Array of <Graph.Nodes> which are parents of the given node.
       
       Also implemented by:
       
       <Graph.Node>.

       Parameters:
       node - (object) A <Graph.Node>.

       Returns:
       An Array of <Graph.Nodes>.

       Example:
       (start code js)
         var pars = $jit.Graph.Util.getParents(node);
         //or...
         var pars = node.getParents();
         
         if(pars.length > 0) {
           //do stuff with parents
         }
       (end code)
    */
    getParents: function(node) {
        var ans = [];
        this.eachAdjacency(node, function(adj) {
            var n = adj.nodeTo;
            if(n._depth < node._depth) ans.push(n);
        });
        return ans;
    },
    


 /*
     Method: clean
  
     Cleans flags from nodes.

     Also implemented by:
     
     <Graph>.
     
     Parameters:
     graph - A <Graph> instance.
  */
  clean: function(graph) { this.eachNode(graph, function(elem) { elem._flag = false; }); }
  
  
};
//Append graph methods to <Graph>
$.each(['get', 'getNode', 'each', 'eachNode', 'computeLevels', 'eachBFS', 'clean'], function(m) {
  Graph.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

//Append node methods to <Graph.Node>
$.each(['eachAdjacency', 'eachLevel', 'eachSubgraph', 'eachSubnode', 'anySubnode', 'getSubnodes', 'getParents'], function(m) {
  Graph.Node.prototype[m] = function() {
    return Graph.Util[m].apply(Graph.Util, [this].concat(Array.prototype.slice.call(arguments)));
  };
});

/*
 * File: Graph.Op.js
 *
*/

/*
   Object: Graph.Op

   Perform <Graph> operations like adding/removing <Graph.Nodes> or <Graph.Adjacences>, 
   morphing a <Graph> into another <Graph>, contracting or expanding subtrees, etc.

*/
Graph.Op = {

    options: {
      type: 'nothing',
      duration: 2000,
      hideLabels: true,
      fps:30
    },
    
    initialize: function(viz) {
      this.viz = viz;
    },

    /*
       Method: removeNode
    
       Removes one or more <Graph.Nodes> from the visualization. 
       It can also perform several animations like fading sequentially, fading concurrently, iterating or replotting.

       Parameters:
    
        node - (string|array) The node's id. Can also be an array having many ids.
        opt - (object) Animation options. It's an object with optional properties described below
        type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot",  or "iter".
        duration - Described in <Options.Fx>.
        fps - Described in <Options.Fx>.
        transition - Described in <Options.Fx>.
        hideLabels - (boolean) Default's *true*. Hide labels during the animation.
   
      Example:
      (start code js)
        var viz = new $jit.Viz(options);
        viz.op.removeNode('nodeId', {
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.removeNode(['someId', 'otherId'], {
          duration: 1500
        });
      (end code)
    */
  
    removeNode: function(node, opt) {
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt);
        var n = $.splat(node);
        var i, that, nodeObj;
        switch(options.type) {
            case 'nothing':
                for(i=0; i<n.length; i++) viz.graph.removeNode(n[i]);
                break;
            
            case 'replot':
                this.removeNode(n, { type: 'nothing' });
                viz.labels.clearLabels();
                viz.refresh(true);
                break;
                
            default: this.doError();
        }
    },
    
    /*
       Method: removeEdge
    
       Removes one or more <Graph.Adjacences> from the visualization. 
       It can also perform several animations like fading sequentially, fading concurrently, iterating or replotting.

       Parameters:
    
       vertex - (array) An array having two strings which are the ids of the nodes connected by this edge (i.e ['id1', 'id2']). Can also be a two dimensional array holding many edges (i.e [['id1', 'id2'], ['id3', 'id4'], ...]).
       opt - (object) Animation options. It's an object with optional properties described below
       type - (string) Default's *nothing*. Type of the animation. Can be "nothing", "replot",  or "iter".
       duration - Described in <Options.Fx>.
       fps - Described in <Options.Fx>.
       transition - Described in <Options.Fx>.
       hideLabels - (boolean) Default's *true*. Hide labels during the animation.
   
      Example:
      (start code js)
        var viz = new $jit.Viz(options);
        viz.op.removeEdge(['nodeId', 'otherId'], {
          duration: 1000,
          hideLabels: false,
          transition: $jit.Trans.Quart.easeOut
        });
        //or also
        viz.op.removeEdge([['someId', 'otherId'], ['id3', 'id4']], {\
          duration: 1500
        });
      (end code)
    
    */
    removeEdge: function(vertex, opt) {
        var viz = this.viz;
        var options = $.merge(this.options, viz.controller, opt);
        var v = ($.type(vertex[0]) == 'string')? [vertex] : vertex;
        var i, that, adj;
        switch(options.type) {
            case 'nothing':
                for(i=0; i<v.length; i++)   viz.graph.removeAdjacence(v[i][0], v[i][1]);
                break;
            
            case 'replot':
                this.removeEdge(v, { type: 'nothing' });
                viz.refresh(true);
                break;
            
            
            default: this.doError();
        }
    }
};



/*
   File: Helpers.js
 
   Helpers are objects that contain rendering primitives (like rectangles, ellipses, etc), for plotting nodes and edges.
   Helpers also contain implementations of the *contains* method, a method returning a boolean indicating whether the mouse
   position is over the rendered shape.
   
   Helpers are very useful when implementing new NodeTypes, since you can access them through *this.nodeHelper* and 
   *this.edgeHelper* <Graph.Plot> properties, providing you with simple primitives and mouse-position check functions.
   
   Example:
   (start code js)
   //implement a new node type
   $jit.Viz.Plot.NodeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.nodeHelper.circle.render ...
       },
       'contains': function(node, pos) {
         this.nodeHelper.circle.contains ...
       }
     }
   });
   //implement an edge type
   $jit.Viz.Plot.EdgeTypes.implement({
     'customNodeType': {
       'render': function(node, canvas) {
         this.edgeHelper.circle.render ...
       },
       //optional
       'contains': function(node, pos) {
         this.edgeHelper.circle.contains ...
       }
     }
   });
   (end code)

*/

/*
   Object: NodeHelper
   
   Contains rendering and other type of primitives for simple shapes.
 */
var NodeHelper = {
  'none': {
    'render': $.empty,
    'contains': $.lambda(false)
  },

  /*
  Object: NodeHelper.rectangle
  */
  'rectangle': {
    /*
    Method: render
    
    Renders a rectangle into the canvas.
    
    Parameters:
    
    type - (string) Possible options are 'fill' or 'stroke'.
    pos - (object) An *x*, *y* object with the position of the center of the rectangle.
    width - (number) The width of the rectangle.
    height - (number) The height of the rectangle.
    canvas - (object) A <Canvas> instance.
    
    Example:
    (start code js)
    NodeHelper.rectangle.render('fill', { x: 10, y: 30 }, 30, 40, viz.canvas);
    (end code)
    */
    'render': function(type, pos, width, height, canvas){
      canvas.getCtx()[type + "Rect"](pos.x - width / 2, pos.y - height / 2, 
                                      width, height);
    },
    /*
    Method: contains
    
    Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
    
    Parameters:
    
    npos - (object) An *x*, *y* object with the <Graph.Node> position.
    pos - (object) An *x*, *y* object with the position to check.
    width - (number) The width of the rendered rectangle.
    height - (number) The height of the rendered rectangle.
    
    Example:
    (start code js)
    NodeHelper.rectangle.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, 30, 40);
    (end code)
    */
    'contains': function(npos, pos, width, height){
      return Math.abs(pos.x - npos.x) <= width / 2
          && Math.abs(pos.y - npos.y) <= height / 2;
    }
  }
};

/*
  Object: EdgeHelper
  
  Contains rendering primitives for simple edge shapes.
*/
var EdgeHelper = {
  /*
    Object: EdgeHelper.line
  */
  'line': {
      /*
      Method: render
      
      Renders a line into the canvas.
      
      Parameters:
      
      from - (object) An *x*, *y* object with the starting position of the line.
      to - (object) An *x*, *y* object with the ending position of the line.
      canvas - (object) A <Canvas> instance.
      
      Example:
      (start code js)
      EdgeHelper.line.render({ x: 10, y: 30 }, { x: 10, y: 50 }, viz.canvas);
      (end code)
      */
      'render': function(from, to, canvas){
        var ctx = canvas.getCtx();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      },
      /*
      Method: contains
      
      Returns *true* if *pos* is contained in the area of the shape. Returns *false* otherwise.
      
      Parameters:
      
      posFrom - (object) An *x*, *y* object with a <Graph.Node> position.
      posTo - (object) An *x*, *y* object with a <Graph.Node> position.
      pos - (object) An *x*, *y* object with the position to check.
      epsilon - (number) The dimension of the shape.
      
      Example:
      (start code js)
      EdgeHelper.line.contains({ x: 10, y: 30 }, { x: 15, y: 35 }, { x: 15, y: 35 }, 30);
      (end code)
      */
      'contains': function(posFrom, posTo, pos, epsilon) {
        var min = Math.min, 
            max = Math.max,
            minPosX = min(posFrom.x, posTo.x),
            maxPosX = max(posFrom.x, posTo.x),
            minPosY = min(posFrom.y, posTo.y),
            maxPosY = max(posFrom.y, posTo.y);
        
        if(pos.x >= minPosX && pos.x <= maxPosX 
            && pos.y >= minPosY && pos.y <= maxPosY) {
          if(Math.abs(posTo.x - posFrom.x) <= epsilon) {
            return true;
          }
          var dist = (posTo.y - posFrom.y) / (posTo.x - posFrom.x) * (pos.x - posFrom.x) + posFrom.y;
          return Math.abs(dist - pos.y) <= epsilon;
        }
        return false;
      }
    }
};



/*
   Object: Graph.Plot

   <Graph> rendering and animation methods.
   
   Properties:
   
   nodeHelper - <NodeHelper> object.
   edgeHelper - <EdgeHelper> object.
*/
Graph.Plot = {
    //Default initializer
    initialize: function(viz, klass){
      this.viz = viz;
      this.config = viz.config;
      this.node = viz.config.Node;
      this.edge = viz.config.Edge;
      this.animation = new Animation;
      this.nodeTypes = new klass.Plot.NodeTypes;
      this.edgeTypes = new klass.Plot.EdgeTypes;
      this.labels = viz.labels;
   },

    //Add helpers
    nodeHelper: NodeHelper,
    edgeHelper: EdgeHelper,
    
    Interpolator: {
        //node/edge property parsers
        'map': {
          'border': 'color',
          'color': 'color',
          'width': 'number',
          'height': 'number',
          'dim': 'number',
          'alpha': 'number',
          'lineWidth': 'number',
          'angularWidth':'number',
          'span':'number',
          'valueArray':'array-number',
          'dimArray':'array-number'
          //'colorArray':'array-color'
        },
        
        //canvas specific parsers
        'canvas': {
          'globalAlpha': 'number',
          'fillStyle': 'color',
          'strokeStyle': 'color',
          'lineWidth': 'number',
          'shadowBlur': 'number',
          'shadowColor': 'color',
          'shadowOffsetX': 'number',
          'shadowOffsetY': 'number',
          'miterLimit': 'number'
        },
  
        //label parsers
        'label': {
          'size': 'number',
          'color': 'color'
        },
  
        //Number interpolator
        'compute': function(from, to, delta) {
          return from + (to - from) * delta;
        },
        
        //Position interpolators
        'moebius': function(elem, props, delta, vector) {
          var v = vector.scale(-delta);  
          if(v.norm() < 1) {
              var x = v.x, y = v.y;
              var ans = elem.startPos
                .getc().moebiusTransformation(v);
              elem.pos.setc(ans.x, ans.y);
              v.x = x; v.y = y;
            }           
        },

        'linear': function(elem, props, delta) {
            var from = elem.startPos.getc(true);
            var to = elem.endPos.getc(true);
            elem.pos.setc(this.compute(from.x, to.x, delta), 
                          this.compute(from.y, to.y, delta));
        },

        'polar': function(elem, props, delta) {
          var from = elem.startPos.getp(true);
          var to = elem.endPos.getp();
          var ans = to.interpolate(from, delta);
          elem.pos.setp(ans.theta, ans.rho);
        },
        
        //Graph's Node/Edge interpolators
        'number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start');
          var to = elem[getter](prop, 'end');
          elem[setter](prop, this.compute(from, to, delta));
        },

        'color': function(elem, prop, delta, getter, setter) {
          var from = $.hexToRgb(elem[getter](prop, 'start'));
          var to = $.hexToRgb(elem[getter](prop, 'end'));
          var comp = this.compute;
          var val = $.rgbToHex([parseInt(comp(from[0], to[0], delta)),
                                parseInt(comp(from[1], to[1], delta)),
                                parseInt(comp(from[2], to[2], delta))]);
          
          elem[setter](prop, val);
        },
        
        'array-number': function(elem, prop, delta, getter, setter) {
          var from = elem[getter](prop, 'start'),
              to = elem[getter](prop, 'end'),
              cur = [];
          for(var i=0, l=from.length; i<l; i++) {
            var fromi = from[i], toi = to[i];
            if(fromi.length) {
              for(var j=0, len=fromi.length, curi=[]; j<len; j++) {
                curi.push(this.compute(fromi[j], toi[j], delta));
              }
              cur.push(curi);
            } else {
              cur.push(this.compute(fromi, toi, delta));
            }
          }
          elem[setter](prop, cur);
        },
        
        'node': function(elem, props, delta, map, getter, setter) {
          map = this[map];
          if(props) {
            var len = props.length;
            for(var i=0; i<len; i++) {
              var pi = props[i];
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          } else {
            for(var pi in map) {
              this[map[pi]](elem, pi, delta, getter, setter);
            }
          }
        },
        
        'edge': function(elem, props, delta, mapKey, getter, setter) {
            var adjs = elem.adjacencies;
            for(var id in adjs) this['node'](adjs[id], props, delta, mapKey, getter, setter);
        },
        
        'node-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'map', 'getData', 'setData');
        },
        
        'edge-property': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'map', 'getData', 'setData');  
        },

        'label-property': function(elem, props, delta) {
          this['node'](elem, props, delta, 'label', 'getLabelData', 'setLabelData');
        },
        
        'node-style': function(elem, props, delta) {
          this['node'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');
        },
        
        'edge-style': function(elem, props, delta) {
          this['edge'](elem, props, delta, 'canvas', 'getCanvasStyle', 'setCanvasStyle');  
        }
    },
    
 
    
    /*
      prepare
 
      Prepare graph position and other attribute values before performing an Animation. 
      This method is used internally by the Toolkit.
      
      See also:
       
       <Animation>, <Graph.Plot.animate>

    */
    prepare: function(modes) {
      var graph = this.viz.graph,
          accessors = {
            'node-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'edge-property': {
              'getter': 'getData',
              'setter': 'setData'
            },
            'node-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            },
            'edge-style': {
              'getter': 'getCanvasStyle',
              'setter': 'setCanvasStyle'
            }
          };

      //parse modes
      var m = {};
      if($.type(modes) == 'array') {
        for(var i=0, len=modes.length; i < len; i++) {
          var elems = modes[i].split(':');
          m[elems.shift()] = elems;
        }
      } else {
        for(var p in modes) {
          if(p == 'position') {
            m[modes.position] = [];
          } else {
            m[p] = $.splat(modes[p]);
          }
        }
      }
      
      graph.eachNode(function(node) { 
        node.startPos.set(node.pos);
        $.each(['node-property', 'node-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            for(var i=0, l=prop.length; i < l; i++) {
              node[accessors[p].setter](prop[i], node[accessors[p].getter](prop[i]), 'start');
            }
          }
        });
        $.each(['edge-property', 'edge-style'], function(p) {
          if(p in m) {
            var prop = m[p];
            node.eachAdjacency(function(adj) {
              for(var i=0, l=prop.length; i < l; i++) {
                adj[accessors[p].setter](prop[i], adj[accessors[p].getter](prop[i]), 'start');
              }
            });
          }
        });
      });
      return m;
    },
    
    /*
       Method: animate
    
       Animates a <Graph> by interpolating some <Graph.Node>, <Graph.Adjacence> or <Graph.Label> properties.

       Parameters:

       opt - (object) Animation options. The object properties are described below
       duration - (optional) Described in <Options.Fx>.
       fps - (optional) Described in <Options.Fx>.
       hideLabels - (optional|boolean) Whether to hide labels during the animation.
       modes - (required|object) An object with animation modes (described below).

       Animation modes:
       
       Animation modes are strings representing different node/edge and graph properties that you'd like to animate. 
       They are represented by an object that has as keys main categories of properties to animate and as values a list 
       of these specific properties. The properties are described below
       
       position - Describes the way nodes' positions must be interpolated. Possible values are 'linear', 'polar' or 'moebius'.
       node-property - Describes which Node properties will be interpolated. These properties can be any of the ones defined in <Options.Node>.
       edge-property - Describes which Edge properties will be interpolated. These properties can be any the ones defined in <Options.Edge>.
       label-property - Describes which Label properties will be interpolated. These properties can be any of the ones defined in <Options.Label> like color or size.
       node-style - Describes which Node Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.
       edge-style - Describes which Edge Canvas Styles will be interpolated. These are specific canvas properties like fillStyle, strokeStyle, lineWidth, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, etc.

       Example:
       (start code js)
       var viz = new $jit.Viz(options);
       //...tweak some Data, CanvasStyles or LabelData properties...
       viz.fx.animate({
         modes: {
           'position': 'linear',
           'node-property': ['width', 'height'],
           'node-style': 'shadowColor',
           'label-property': 'size'
         },
         hideLabels: false
       });
       //...can also be written like this...
       viz.fx.animate({
         modes: ['linear',
                 'node-property:width:height',
                 'node-style:shadowColor',
                 'label-property:size'],
         hideLabels: false
       });
       (end code)
    */
    animate: function(opt, versor) {
      opt = $.merge(this.viz.config, opt || {});
      var that = this,
          viz = this.viz,
          graph  = viz.graph,
          interp = this.Interpolator,
          animation =  opt.type === 'nodefx'? this.nodeFxAnimation : this.animation;
      //prepare graph values
      var m = this.prepare(opt.modes);
      
      //animate
      if(opt.hideLabels) this.labels.hideLabels(true);
      animation.setOptions($.extend(opt, {
        $animating: false,
        compute: function(delta) {
          graph.eachNode(function(node) { 
            for(var p in m) {
              interp[p](node, m[p], delta, versor);
            }
          });
          that.plot(opt, this.$animating, delta);
          this.$animating = true;
        },
        complete: function() {
          if(opt.hideLabels) that.labels.hideLabels(false);
          that.plot(opt);
          opt.onComplete();
          //TODO(nico): This shouldn't be here!
          //opt.onAfterCompute();
        }       
      })).start();
    },
    

    /*
       Method: plot
    
       Plots a <Graph>.

       Parameters:

       opt - (optional) Plotting options. Most of them are described in <Options.Fx>.

       Example:

       (start code js)
       var viz = new $jit.Viz(options);
       viz.fx.plot(); 
       (end code)

    */
   plot: function(opt, animating) {
     var viz = this.viz, 
         aGraph = viz.graph, 
         canvas = viz.canvas, 
         id = viz.root, 
         that = this, 
         ctx = canvas.getCtx(), 
         min = Math.min,
         opt = opt || this.viz.controller;
     
     opt.clearCanvas && canvas.clear();
       
     var root = aGraph.getNode(id);
     if(!root) return;
     
     var T = !!root.visited;
     aGraph.eachNode(function(node) {
       var nodeAlpha = node.getData('alpha');
       node.eachAdjacency(function(adj) {
         var nodeTo = adj.nodeTo;
         if(!!nodeTo.visited === T && node.drawn && nodeTo.drawn) {
           !animating && opt.onBeforePlotLine(adj);
           that.plotLine(adj, canvas, animating);
           !animating && opt.onAfterPlotLine(adj);
         }
       });
       if(node.drawn) {
         !animating && opt.onBeforePlotNode(node);
         that.plotNode(node, canvas, animating);
         !animating && opt.onAfterPlotNode(node);
       }
       if(!that.labelsHidden && opt.withLabels) {
         if(node.drawn && nodeAlpha >= 0.95) {
           that.labels.plotLabel(canvas, node, opt);
         }
       }
       node.visited = !T;
     });
    },

  /*
      Plots a Subtree.
   */
   plotTree: function(node, opt, animating) {
       var that = this, 
       viz = this.viz, 
       canvas = viz.canvas,
       config = this.config,
       ctx = canvas.getCtx();
       var nodeAlpha = node.getData('alpha');
       node.eachSubnode(function(elem) {
         if(opt.plotSubtree(node, elem) && elem.exist && elem.drawn) {
             var adj = node.getAdjacency(elem.id);
             !animating && opt.onBeforePlotLine(adj);
             that.plotLine(adj, canvas, animating);
             !animating && opt.onAfterPlotLine(adj);
             that.plotTree(elem, opt, animating);
         }
       });
       if(node.drawn) {
           !animating && opt.onBeforePlotNode(node);
           this.plotNode(node, canvas, animating);
           !animating && opt.onAfterPlotNode(node);
           if(!opt.hideLabels && opt.withLabels && nodeAlpha >= 0.95) 
               this.labels.plotLabel(canvas, node, opt);
       }
   },

  /*
       Method: plotNode
    
       Plots a <Graph.Node>.

       Parameters:
       
       node - (object) A <Graph.Node>.
       canvas - (object) A <Canvas> element.

    */
    plotNode: function(node, canvas, animating) {
        var f = node.getData('type'), 
            ctxObj = this.node.CanvasStyles;
        if(f != 'none') {
          var width = node.getData('lineWidth'),
              color = node.getData('color'),
              alpha = node.getData('alpha'),
              ctx = canvas.getCtx();
          ctx.save();
          ctx.lineWidth = width;
          ctx.fillStyle = ctx.strokeStyle = color;
          ctx.globalAlpha = alpha;
          
          for(var s in ctxObj) {
            ctx[s] = node.getCanvasStyle(s);
          }

          this.nodeTypes[f].render.call(this, node, canvas, animating);
          ctx.restore();
        }
    },
    
    /*
       Method: plotLine
    
       Plots a <Graph.Adjacence>.

       Parameters:

       adj - (object) A <Graph.Adjacence>.
       canvas - (object) A <Canvas> instance.

    */
    plotLine: function(adj, canvas, animating) {
      var f = adj.getData('type'),
          ctxObj = this.edge.CanvasStyles;
      if(f != 'none') {
        var width = adj.getData('lineWidth'),
            color = adj.getData('color'),
            ctx = canvas.getCtx(),
            nodeFrom = adj.nodeFrom,
            nodeTo = adj.nodeTo;
        
        ctx.save();
        ctx.lineWidth = width;
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.globalAlpha = Math.min(nodeFrom.getData('alpha'), 
            nodeTo.getData('alpha'), 
            adj.getData('alpha'));
        
        for(var s in ctxObj) {
          ctx[s] = adj.getCanvasStyle(s);
        }

        this.edgeTypes[f].render.call(this, adj, canvas, animating);
        ctx.restore();
      }
    }    
  
};


/*
   Object: Graph.Label

   An interface for plotting/hiding/showing labels.

   Description:

   This is a generic interface for plotting/hiding/showing labels.
   The <Graph.Label> interface is implemented in multiple ways to provide
   different label types.

   For example, the Graph.Label interface is implemented as <Graph.Label.HTML> to provide
   HTML label elements. 
  
   
   All subclasses (<Graph.Label.HTML>) implement the method plotLabel.
*/

Graph.Label = {};

/*
   Class: Graph.Label.DOM

   Abstract Class implementing some DOM label methods.

   Implemented by:

   <Graph.Label.HTML> 

*/
Graph.Label.DOM = new Class({
    // A flag value indicating if node labels are being displayed or not.
    labelsHidden: false,
    // Label container
    labelContainer: false,
    // Label elements hash.
    labels: {},

    /*
       Method: getLabelContainer

       Lazy fetcher for the label container.

       Returns:

       The label container DOM element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var labelContainer = viz.labels.getLabelContainer();
        alert(labelContainer.innerHTML);
      (end code)
    */
    getLabelContainer: function() {
      return this.labelContainer ?
        this.labelContainer :
        this.labelContainer = document.getElementById(this.viz.config.labelContainer);
    },

    /*
       Method: getLabel

       Lazy fetcher for the label element.

       Parameters:

       id - (string) The label id (which is also a <Graph.Node> id).

       Returns:

       The label element.

       Example:

      (start code js)
        var viz = new $jit.Viz(options);
        var label = viz.labels.getLabel('someid');
        alert(label.innerHTML);
      (end code)

    */
    getLabel: function(id) {
      return (id in this.labels && this.labels[id] != null) ?
        this.labels[id] :
        this.labels[id] = document.getElementById(id);
    },

    /*
       fitsInCanvas

       Returns _true_ or _false_ if the label for the node is contained in the canvas dom element or not.

       Parameters:

       pos - A <Complex> instance (I'm doing duck typing here so any object with _x_ and _y_ parameters will do).
       canvas - A <Canvas> instance.

       Returns:

       A boolean value specifying if the label is contained in the <Canvas> DOM element or not.

    */
    fitsInCanvas: function(pos, canvas) {
      var size = canvas.getSize();
      if(pos.x >= size.width || pos.x < 0
         || pos.y >= size.height || pos.y < 0) return false;
       return true;
    }
});

/*
   Class: Graph.Label.HTML

   Implements HTML labels.

   Extends:

   All <Graph.Label.DOM> methods.

*/
Graph.Label.HTML = new Class({
    Implements: Graph.Label.DOM,

    /*
       Method: plotLabel

       Plots a label for a given node.

       Parameters:

       canvas - (object) A <Canvas> instance.
       node - (object) A <Graph.Node>.
       controller - (object) A configuration object.
       
      Example:
       
       (start code js)
       var viz = new $jit.Viz(options);
       var node = viz.graph.getNode('nodeId');
       viz.labels.plotLabel(viz.canvas, node, viz.config);
       (end code)


    */
    plotLabel: function(canvas, node, controller) {
      var id = node.id, tag = this.getLabel(id);

      if(!tag && !(tag = document.getElementById(id))) {
        tag = document.createElement('div');
        var container = this.getLabelContainer();
        tag.id = id;
        tag.className = 'node';
        tag.style.position = 'absolute';
        controller.onCreateLabel(tag, node);
        container.appendChild(tag);
        this.labels[node.id] = tag;
      }

      this.placeLabel(tag, node, controller);
    }
});




Graph.Geom = new Class({

  initialize: function(viz) {
    this.viz = viz;
    this.config = viz.config;
    this.node = viz.config.Node;
    this.edge = viz.config.Edge;
  },
  /*
    Applies a translation to the tree.
  
    Parameters:
  
    pos - A <Complex> number specifying translation vector.
    prop - A <Graph.Node> position property ('pos', 'start' or 'end').
  
    Example:
  
    (start code js)
      st.geom.translate(new Complex(300, 100), 'end');
    (end code)
  */  
  translate: function(pos, prop) {
     prop = $.splat(prop);
     this.viz.graph.eachNode(function(elem) {
         $.each(prop, function(p) { elem.getPos(p).$add(pos); });
     });
  },
  /*
    Hides levels of the tree until it properly fits in canvas.
  */  
  setRightLevelToShow: function(node, canvas, callback) {
     var level = this.getRightLevelToShow(node, canvas), 
         fx = this.viz.labels,
         opt = $.merge({
           execShow:true,
           execHide:true,
           onHide: $.empty,
           onShow: $.empty
         }, callback || {});
     node.eachLevel(0, this.config.levelsToShow, function(n) {
         var d = n._depth - node._depth;
         if(d > level) {
             opt.onHide(n);
             if(opt.execHide) {
               n.drawn = false; 
               n.exist = false;
               fx.hideLabel(n, false);
             }
         } else {
             opt.onShow(n);
             if(opt.execShow) {
               n.exist = true;
             }
         }
     });
     node.drawn= true;
  },
  /*
    Returns the right level to show for the current tree in order to fit in canvas.
  */  
  getRightLevelToShow: function(node, canvas) {
     var config = this.config;
     var level = config.levelsToShow;
     var constrained = config.constrained;
     if(!constrained) return level;
     while(!this.treeFitsInCanvas(node, canvas, level) && level > 1) { level-- ; }
     return level;
  }
});

/*
 * File: Loader.js
 * 
 */

/*
   Object: Loader

   Provides methods for loading and serving JSON data.
*/
var Loader = {
     construct: function(json) {
        var isGraph = ($.type(json) == 'array');
        var ans = new Graph(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
        if(!isGraph) 
            //make tree
            (function (ans, json) {
                ans.addNode(json);
                if(json.children) {
                  for(var i=0, ch = json.children; i<ch.length; i++) {
                    ans.addAdjacence(json, ch[i]);
                    arguments.callee(ans, ch[i]);
                  }
                }
            })(ans, json);
        else
            //make graph
            (function (ans, json) {
                var getNode = function(id) {
                  for(var i=0, l=json.length; i<l; i++) {
                    if(json[i].id == id) {
                      return json[i];
                    }
                  }
                  // The node was not defined in the JSON
                  // Let's create it
                  var newNode = {
                		"id" : id,
                		"name" : id
                	};
                  return ans.addNode(newNode);
                };

                for(var i=0, l=json.length; i<l; i++) {
                  ans.addNode(json[i]);
                  var adj = json[i].adjacencies;
                  if (adj) {
                    for(var j=0, lj=adj.length; j<lj; j++) {
                      var node = adj[j], data = {};
                      if(typeof adj[j] != 'string') {
                        data = $.merge(node.data, {});
                        node = node.nodeTo;
                      }
                      ans.addAdjacence(json[i], getNode(node), data);
                    }
                  }
                }
            })(ans, json);

        return ans;
    },

    /*
     Method: loadJSON
    
     Loads a JSON structure to the visualization. The JSON structure can be a JSON *tree* or *graph* structure.
     
      A JSON tree or graph structure consists of nodes, each having as properties
       
       id - (string) A unique identifier for the node
       name - (string) A node's name
       data - (object) The data optional property contains a hash (i.e {}) 
       where you can store all the information you want about this node.
        
      For JSON *Tree* structures, there's an extra optional property *children* of type Array which contains the node's children.
      
      Example:

      (start code js)
        var json = {  
          "id": "aUniqueIdentifier",  
          "name": "usually a nodes name",  
          "data": {
            "some key": "some value",
            "some other key": "some other value"
           },  
          "children": [ *other nodes or empty* ]  
        };  
      (end code)
        
        JSON *Graph* structures consist of an array of nodes, each specifying the nodes to which the current node is connected. 
        For JSON *Graph* structures, the *children* property is replaced by the *adjacencies* property.
        
        There are two types of *Graph* structures, *simple* and *extended* graph structures.
        
        For *simple* Graph structures, the adjacencies property contains an array of strings, each specifying the 
        id of the node connected to the main node.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": ["anotherUniqueIdentifier", "yetAnotherUniqueIdentifier", 'etc']  
          },

          'other nodes go here...' 
        ];          
        (end code)
        
        For *extended Graph structures*, the adjacencies property contains an array of Adjacency objects that have as properties
        
        nodeTo - (string) The other node connected by this adjacency.
        data - (object) A data property, where we can store custom key/value information.
        
        Example:
        
        (start code js)
        var json = [  
          {  
            "id": "aUniqueIdentifier",  
            "name": "usually a nodes name",  
            "data": {
              "some key": "some value",
              "some other key": "some other value"
             },  
            "adjacencies": [  
            {  
              nodeTo:"aNodeId",  
              data: {} //put whatever you want here  
            },
            'other adjacencies go here...'  
          },

          'other nodes go here...' 
        ];          
        (end code)
       
       About the data property:
       
       As described before, you can store custom data in the *data* property of JSON *nodes* and *adjacencies*. 
       You can use almost any string as key for the data object. Some keys though are reserved by the toolkit, and 
       have special meanings. This is the case for keys starting with a dollar sign, for example, *$width*.
       
       For JSON *node* objects, adding dollar prefixed properties that match the names of the options defined in 
       <Options.Node> will override the general value for that option with that particular value. For this to work 
       however, you do have to set *overridable = true* in <Options.Node>.
       
       The same thing is true for JSON adjacencies. Dollar prefixed data properties will alter values set in <Options.Edge> 
       if <Options.Edge> has *overridable = true*.
       
       When loading JSON data into TreeMaps, the *data* property must contain a value for the *$area* key, 
       since this is the value which will be taken into account when creating the layout. 
       The same thing goes for the *$color* parameter.
       
       In JSON Nodes you can use also *$label-* prefixed properties to refer to <Options.Label> properties. For example, 
       *$label-size* will refer to <Options.Label> size property. Also, in JSON nodes and adjacencies you can set 
       canvas specific properties individually by using the *$canvas-* prefix. For example, *$canvas-shadowBlur* will refer 
       to the *shadowBlur* property.
       
       These properties can also be accessed after loading the JSON data from <Graph.Nodes> and <Graph.Adjacences> 
       by using <Accessors>. For more information take a look at the <Graph> and <Accessors> documentation.
       
       Finally, these properties can also be used to create advanced animations like with <Options.NodeStyles>. For more 
       information about creating animations please take a look at the <Graph.Plot> and <Graph.Plot.animate> documentation.
       
       loadJSON Parameters:
    
        json - A JSON Tree or Graph structure.
        i - For Graph structures only. Sets the indexed node as root for the visualization.

    */
    loadJSON: function(json, i) {
      this.json = json;
      //if they're canvas labels erase them.
      if(this.labels && this.labels.clearLabels) {
        this.labels.clearLabels(true);
      }
      this.graph = this.construct(json);
      if($.type(json) != 'array'){
        this.root = json.id;
      } else {
        this.root = json[i? i : 0].id;
      }
    }
};


/*
 * Object: Layouts
 * 
 * Parent object for common layouts.
 *
 */
var Layouts = $jit.Layouts = {};


//Some util shared layout functions are defined here.
var NodeDim = {
  label: null,
  
  compute: function(graph, prop, opt) {
    this.initializeLabel(opt);
    var label = this.label, style = label.style;
    graph.eachNode(function(n) {
      var autoWidth  = n.getData('autoWidth'),
          autoHeight = n.getData('autoHeight');
      if(autoWidth || autoHeight) {
        //delete dimensions since these are
        //going to be overridden now.
        delete n.data.$width;
        delete n.data.$height;
        delete n.data.$dim;
        
        var width  = n.getData('width'),
            height = n.getData('height');
        //reset label dimensions
        style.width  = autoWidth? 'auto' : width + 'px';
        style.height = autoHeight? 'auto' : height + 'px';
        
        //TODO(nico) should let the user choose what to insert here.
        label.innerHTML = n.name;
        
        var offsetWidth  = label.offsetWidth,
            offsetHeight = label.offsetHeight;
        var type = n.getData('type');
        if($.indexOf(['circle', 'square', 'triangle', 'star'], type) === -1) {
          n.setData('width', offsetWidth);
          n.setData('height', offsetHeight);
        } else {
          var dim = offsetWidth > offsetHeight? offsetWidth : offsetHeight;
          n.setData('width', dim);
          n.setData('height', dim);
          n.setData('dim', dim); 
        }
      }
    });
  },
  
  initializeLabel: function(opt) {
    if(!this.label) {
      this.label = document.createElement('div');
      document.body.appendChild(this.label);
    }
    this.setLabelStyles(opt);
  },
  
  setLabelStyles: function(opt) {
    $.extend(this.label.style, {
      'visibility': 'hidden',
      'position': 'absolute',
      'width': 'auto',
      'height': 'auto'
    });
    this.label.className = 'jit-autoadjust-label';
  }
};


/*
 * Class: Layouts.Tree
 * 
 * Implements a Tree Layout.
 * 
 * Implemented By:
 * 
 * <ST>
 * 
 * Inspired by:
 * 
 * Drawing Trees (Andrew J. Kennedy) <http://research.microsoft.com/en-us/um/people/akenn/fun/drawingtrees.pdf>
 * 
 */
Layouts.Tree = (function() {
  //Layout functions
  var slice = Array.prototype.slice;

  /*
     Calculates the max width and height nodes for a tree level
  */  
  function getBoundaries(graph, config, level, orn, prop) {
    var dim = config.Node;
    var multitree = config.multitree;
    if (dim.overridable) {
      var w = -1, h = -1;
      graph.eachNode(function(n) {
        if (n._depth == level
            && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {
          var dw = n.getData('width', prop);
          var dh = n.getData('height', prop);
          w = (w < dw) ? dw : w;
          h = (h < dh) ? dh : h;
        }
      });
      return {
        'width' : w < 0 ? dim.width : w,
        'height' : h < 0 ? dim.height : h
      };
    } else {
      return dim;
    }
  }


  function movetree(node, prop, val, orn) {
    var p = (orn == "left" || orn == "right") ? "y" : "x";
    node.getPos(prop)[p] += val;
  }


  function moveextent(extent, val) {
    var ans = [];
    $.each(extent, function(elem) {
      elem = slice.call(elem);
      elem[0] += val;
      elem[1] += val;
      ans.push(elem);
    });
    return ans;
  }


  function merge(ps, qs) {
    if (ps.length == 0)
      return qs;
    if (qs.length == 0)
      return ps;
    var p = ps.shift(), q = qs.shift();
    return [ [ p[0], q[1] ] ].concat(merge(ps, qs));
  }


  function mergelist(ls, def) {
    def = def || [];
    if (ls.length == 0)
      return def;
    var ps = ls.pop();
    return mergelist(ls, merge(ps, def));
  }


  function fit(ext1, ext2, subtreeOffset, siblingOffset, i) {
    if (ext1.length <= i || ext2.length <= i)
      return 0;

    var p = ext1[i][1], q = ext2[i][0];
    return Math.max(fit(ext1, ext2, subtreeOffset, siblingOffset, ++i)
        + subtreeOffset, p - q + siblingOffset);
  }


  function fitlistl(es, subtreeOffset, siblingOffset) {
    function $fitlistl(acc, es, i) {
      if (es.length <= i)
        return [];
      var e = es[i], ans = fit(acc, e, subtreeOffset, siblingOffset, 0);
      return [ ans ].concat($fitlistl(merge(acc, moveextent(e, ans)), es, ++i));
    }
    ;
    return $fitlistl( [], es, 0);
  }


  function fitlistr(es, subtreeOffset, siblingOffset) {
    function $fitlistr(acc, es, i) {
      if (es.length <= i)
        return [];
      var e = es[i], ans = -fit(e, acc, subtreeOffset, siblingOffset, 0);
      return [ ans ].concat($fitlistr(merge(moveextent(e, ans), acc), es, ++i));
    }
    ;
    es = slice.call(es);
    var ans = $fitlistr( [], es.reverse(), 0);
    return ans.reverse();
  }


  function fitlist(es, subtreeOffset, siblingOffset, align) {
    var esl = fitlistl(es, subtreeOffset, siblingOffset), esr = fitlistr(es,
        subtreeOffset, siblingOffset);

    if (align == "left")
      esr = esl;
    else if (align == "right")
      esl = esr;

    for ( var i = 0, ans = []; i < esl.length; i++) {
      ans[i] = (esl[i] + esr[i]) / 2;
    }
    return ans;
  }


  function design(graph, node, prop, config, orn) {
    var multitree = config.multitree;
    var auxp = [ 'x', 'y' ], auxs = [ 'width', 'height' ];
    var ind = +(orn == "left" || orn == "right");
    var p = auxp[ind], notp = auxp[1 - ind];

    var cnode = config.Node;
    var s = auxs[ind], nots = auxs[1 - ind];

    var siblingOffset = config.siblingOffset;
    var subtreeOffset = config.subtreeOffset;
    var align = config.align;

    function $design(node, maxsize, acum) {
      var sval = node.getData(s, prop);
      var notsval = maxsize
          || (node.getData(nots, prop));

      var trees = [], extents = [], chmaxsize = false;
      var chacum = notsval + config.levelDistance;
      node.eachSubnode(function(n) {
            if (n.exist
                && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {

              if (!chmaxsize)
                chmaxsize = getBoundaries(graph, config, n._depth, orn, prop);

              var s = $design(n, chmaxsize[nots], acum + chacum);
              trees.push(s.tree);
              extents.push(s.extent);
            }
          });
      var positions = fitlist(extents, subtreeOffset, siblingOffset, align);
      for ( var i = 0, ptrees = [], pextents = []; i < trees.length; i++) {
        movetree(trees[i], prop, positions[i], orn);
        pextents.push(moveextent(extents[i], positions[i]));
      }
      var resultextent = [ [ -sval / 2, sval / 2 ] ]
          .concat(mergelist(pextents));
      node.getPos(prop)[p] = 0;

      if (orn == "top" || orn == "left") {
        node.getPos(prop)[notp] = acum;
      } else {
        node.getPos(prop)[notp] = -acum;
      }

      return {
        tree : node,
        extent : resultextent
      };
    }

    $design(node, false, 0);
  }


  return new Class({
    /*
    Method: compute
    
    Computes nodes' positions.

     */
    compute : function(property, computeLevels) {
      var prop = property || 'start';
      var node = this.graph.getNode(this.root);
      $.extend(node, {
        'drawn' : true,
        'exist' : true,
        'selected' : true
      });
      NodeDim.compute(this.graph, prop, this.config);
      if (!!computeLevels || !("_depth" in node)) {
        this.graph.computeLevels(this.root, 0, "ignore");
      }
      
      this.computePositions(node, prop);
    },

    computePositions : function(node, prop) {
      var config = this.config;
      var multitree = config.multitree;
      var align = config.align;
      var indent = align !== 'center' && config.indent;
      var orn = config.orientation;
      var orns = multitree ? [ 'top', 'right', 'bottom', 'left' ] : [ orn ];
      var that = this;
      $.each(orns, function(orn) {
        //calculate layout
          design(that.graph, node, prop, that.config, orn, prop);
          var i = [ 'x', 'y' ][+(orn == "left" || orn == "right")];
          //absolutize
          (function red(node) {
            node.eachSubnode(function(n) {
              if (n.exist
                  && (!multitree || ('$orn' in n.data) && n.data.$orn == orn)) {

                n.getPos(prop)[i] += node.getPos(prop)[i];
                if (indent) {
                  n.getPos(prop)[i] += align == 'left' ? indent : -indent;
                }
                red(n);
              }
            });
          })(node);
        });
    }
  });
  
})();

/*
 * File: Spacetree.js
 */

/*
   Class: ST
   
  A Tree layout with advanced contraction and expansion animations.
     
  Inspired by:
 
  SpaceTree: Supporting Exploration in Large Node Link Tree, Design Evolution and Empirical Evaluation (Catherine Plaisant, Jesse Grosjean, Benjamin B. Bederson) 
  <http://hcil.cs.umd.edu/trs/2002-05/2002-05.pdf>
  
  Drawing Trees (Andrew J. Kennedy) <http://research.microsoft.com/en-us/um/people/akenn/fun/drawingtrees.pdf>
  
  Note:
 
  This visualization was built and engineered from scratch, taking only the papers as inspiration, and only shares some features with the visualization described in those papers.
 
  Implements:
  
  All <Loader> methods
  
  Constructor Options:
  
  Inherits options from
  
  - <Options.Canvas>
  - <Options.Controller>
  - <Options.Tree>
  - <Options.Node>
  - <Options.Edge>
  - <Options.Label>
  - <Options.Events>
  - <Options.NodeStyles>
  - <Options.Navigation>
  
  Additionally, there are other parameters and some default values changed
  
  constrained - (boolean) Default's *true*. Whether to show the entire tree when loaded or just the number of levels specified by _levelsToShow_.
  levelsToShow - (number) Default's *2*. The number of levels to show for a subtree. This number is relative to the selected node.
  levelDistance - (number) Default's *30*. The distance between two consecutive levels of the tree.
  Node.type - Described in <Options.Node>. Default's set to *rectangle*.
  offsetX - (number) Default's *0*. The x-offset distance from the selected node to the center of the canvas.
  offsetY - (number) Default's *0*. The y-offset distance from the selected node to the center of the canvas.
  duration - Described in <Options.Fx>. It's default value has been changed to *700*.
  
  Instance Properties:
  
  canvas - Access a <Canvas> instance.
  graph - Access a <Graph> instance.
  op - Access a <ST.Op> instance.
  fx - Access a <ST.Plot> instance.
  labels - Access a <ST.Label> interface implementation.

 */

$jit.ST= (function() {
    // Define some private methods first...
    // Nodes in path
    var nodesInPath = [];
    // Nodes to contract
    function getNodesToHide(node) {
      node = node || this.clickedNode;
      if(!this.config.constrained) {
        return [];
      }
      var Geom = this.geom;
      var graph = this.graph;
      var canvas = this.canvas;
      var level = node._depth, nodeArray = [];
  	  graph.eachNode(function(n) {
          if(n.exist && !n.selected) {
              if(n.isDescendantOf(node.id)) {
                if(n._depth <= level) nodeArray.push(n);
              } else {
                nodeArray.push(n);
              }
          }
  	  });
  	  var leafLevel = Geom.getRightLevelToShow(node, canvas);
  	  node.eachLevel(leafLevel, leafLevel, function(n) {
          if(n.exist && !n.selected) nodeArray.push(n);
  	  });
  	    
  	  for (var i = 0; i < nodesInPath.length; i++) {
  	    var n = this.graph.getNode(nodesInPath[i]);
  	    if(!n.isDescendantOf(node.id)) {
  	      nodeArray.push(n);
  	    }
  	  } 
  	  return nodeArray;       
    };
    // Nodes to expand
     function getNodesToShow(node) {
        var nodeArray = [], config = this.config;
        node = node || this.clickedNode;
        this.clickedNode.eachLevel(0, config.levelsToShow, function(n) {
            if(config.multitree && !('$orn' in n.data) 
            		&& n.anySubnode(function(ch){ return ch.exist && !ch.drawn; })) {
            	nodeArray.push(n);
            } else if(n.drawn && !n.anySubnode("drawn")) {
              nodeArray.push(n);
            }
        });
        return nodeArray;
     };
    // Now define the actual class.
    return new Class({
    
        Implements: [Loader, Layouts.Tree],
        
        initialize: function(controller) {            
          var $ST = $jit.ST;
          
          var config= {
                levelsToShow: 2,
                levelDistance: 30,
                constrained: true,                
                Node: {
                  type: 'rectangle'
                },
                duration: 700,
                offsetX: 0,
                offsetY: 0
            };
            
            this.controller = this.config = $.merge(
                Options("Canvas", "Tree", "Node", "Edge", "Controller", 
                    "NodeStyles", "Events", "Navigation", "Label"), config, controller);

            var canvasConfig = this.config;
            if(canvasConfig.useCanvas) {
              this.canvas = canvasConfig.useCanvas;
              this.config.labelContainer = this.canvas.id + '-label';
            } else {
              if(canvasConfig.background) {
                canvasConfig.background = $.merge({
                  type: 'Circles'
                }, canvasConfig.background);
              }
              this.canvas = new Canvas(this, canvasConfig);
              this.config.labelContainer = (typeof canvasConfig.injectInto == 'string'? canvasConfig.injectInto : canvasConfig.injectInto.id) + '-label';
            }

            this.graphOptions = {
                'klass': Complex
            };
            this.graph = new Graph(this.graphOptions, this.config.Node, this.config.Edge);
            this.labels = new $ST.Label[canvasConfig.Label.type](this);
            this.fx = new $ST.Plot(this, $ST);
            
            this.group = new $ST.Group(this);
            this.geom = new $ST.Geom(this);
            this.clickedNode=  null;
        },
    
        /*
         Method: plot
        
         Plots the <ST>. This is a shortcut to *fx.plot*.

        */  
        plot: function() { this.fx.plot(this.controller); },
    
      
        /*
         Method: switchPosition
        
         Switches the tree orientation.

         Parameters:

        pos - (string) The new tree orientation. Possible values are "top", "left", "right" and "bottom".
        method - (string) Set this to "animate" if you want to animate the tree when switching its position. You can also set this parameter to "replot" to just replot the subtree.
        onComplete - (optional|object) This callback is called once the "switching" animation is complete.

         Example:

         (start code js)
           st.switchPosition("right", "animate", {
            onComplete: function() {
              alert('completed!');
            } 
           });
         (end code)
        */  
        switchPosition: function(pos, method, onComplete) {
          var Geom = this.geom, Plot = this.fx, that = this;
          if(!Plot.busy) {
              Plot.busy = true;
              this.contract({
                  onComplete: function() {
                      Geom.switchOrientation(pos);
                      that.compute('end', false);
                      Plot.busy = false;
                      if(method == 'animate') {
                    	  that.onClick(that.clickedNode.id, onComplete);  
                      } else if(method == 'replot') {
                    	  that.select(that.clickedNode.id, onComplete);
                      }
                  }
              }, pos);
          }
        },

        /*
        Method: switchAlignment
       
        Switches the tree alignment.

        Parameters:

       align - (string) The new tree alignment. Possible values are "left", "center" and "right".
       method - (string) Set this to "animate" if you want to animate the tree after aligning its position. You can also set this parameter to "replot" to just replot the subtree.
       onComplete - (optional|object) This callback is called once the "switching" animation is complete.

        Example:

        (start code js)
          st.switchAlignment("right", "animate", {
           onComplete: function() {
             alert('completed!');
           } 
          });
        (end code)
       */  
       switchAlignment: function(align, method, onComplete) {
        this.config.align = align;
        if(method == 'animate') {
        	this.select(this.clickedNode.id, onComplete);
        } else if(method == 'replot') {
        	this.onClick(this.clickedNode.id, onComplete);	
        }
       },
        
        requestNodes: function(node, onComplete) {
          var handler = $.merge(this.controller, onComplete), 
          lev = this.config.levelsToShow;
          if(handler.request) {
              var leaves = [], d = node._depth;
              node.eachLevel(0, lev, function(n) {
                  if(n.drawn && 
                   !n.anySubnode()) {
                   leaves.push(n);
                   n._level = lev - (n._depth - d);
                  }
              });
              this.group.requestNodes(leaves, handler);
          }
            else
              handler.onComplete();
        },
     
        contract: function(onComplete, switched) {
          var orn  = this.config.orientation;
          var Geom = this.geom, Group = this.group;
          if(switched) Geom.switchOrientation(switched);
          var nodes = getNodesToHide.call(this);
          if(switched) Geom.switchOrientation(orn);
          Group.contract(nodes, $.merge(this.controller, onComplete));
        },
      
         move: function(node, onComplete) {
            this.compute('end', false);
            var move = onComplete.Move, offset = {
                'x': move.offsetX,
                'y': move.offsetY 
            };
            if(move.enable) {
                this.geom.translate(node.endPos.add(offset).$scale(-1), "end");
            }
            this.fx.animate($.merge(this.controller, { modes: ['linear'] }, onComplete));
         },
      
        expand: function (node, onComplete) {
            var nodeArray = getNodesToShow.call(this, node);
            this.group.expand(nodeArray, $.merge(this.controller, onComplete));
        },
    
        selectPath: function(node) {
          var that = this;
          this.graph.eachNode(function(n) { n.selected = false; }); 
          function path(node) {
              if(node == null || node.selected) return;
              node.selected = true;
              $.each(that.group.getSiblings([node])[node.id], 
              function(n) { 
                   n.exist = true; 
                   n.drawn = true; 
              });    
              var parents = node.getParents();
              parents = (parents.length > 0)? parents[0] : null;
              path(parents);
          };
          for(var i=0, ns = [node.id].concat(nodesInPath); i < ns.length; i++) {
              path(this.graph.getNode(ns[i]));
          }
        },
      
        /*
        Method: setRoot
     
         Switches the current root node. Changes the topology of the Tree.
     
        Parameters:
           id - (string) The id of the node to be set as root.
           method - (string) Set this to "animate" if you want to animate the tree after adding the subtree. You can also set this parameter to "replot" to just replot the subtree.
           onComplete - (optional|object) An action to perform after the animation (if any).
 
        Example:

        (start code js)
          st.setRoot('nodeId', 'animate', {
             onComplete: function() {
               alert('complete!');
             }
          });
        (end code)
     */
     setRoot: function(id, method, onComplete) {
        	if(this.busy) return;
        	this.busy = true;
          var that = this, canvas = this.canvas;
        	var rootNode = this.graph.getNode(this.root);
        	var clickedNode = this.graph.getNode(id);
        	function $setRoot() {
            	if(this.config.multitree && clickedNode.data.$orn) {
            		var orn = clickedNode.data.$orn;
            		var opp = {
            				'left': 'right',
            				'right': 'left',
            				'top': 'bottom',
            				'bottom': 'top'
            		}[orn];
            		rootNode.data.$orn = opp;
            		(function tag(rootNode) {
                		rootNode.eachSubnode(function(n) {
                			if(n.id != id) {
                				n.data.$orn = opp;
                				tag(n);
                			}
                		});
            		})(rootNode);
            		delete clickedNode.data.$orn;
            	}
            	this.root = id;
            	this.clickedNode = clickedNode;
            	this.graph.computeLevels(this.root, 0, "ignore");
            	this.geom.setRightLevelToShow(clickedNode, canvas, {
            	  execHide: false,
            	  onShow: function(node) {
            	    if(!node.drawn) {
                    node.drawn = true;
                    node.setData('alpha', 1, 'end');
                    node.setData('alpha', 0);
                    node.pos.setc(clickedNode.pos.x, clickedNode.pos.y);
            	    }
            	  }
            	});
              this.compute('end');
              this.busy = true;
              this.fx.animate({
                modes: ['linear', 'node-property:alpha'],
                onComplete: function() {
                  that.busy = false;
                  that.onClick(id, {
                    onComplete: function() {
                      onComplete && onComplete.onComplete();
                    }
                  });
                }
              });
        	}

        	// delete previous orientations (if any)
        	delete rootNode.data.$orns;

        	if(method == 'animate') {
        	  $setRoot.call(this);
        	  that.selectPath(clickedNode);
        	} else if(method == 'replot') {
        		$setRoot.call(this);
        		this.select(this.root);
        	}
     },

     /*
           Method: addSubtree
        
            Adds a subtree.
        
           Parameters:
              subtree - (object) A JSON Tree object. See also <Loader.loadJSON>.
              method - (string) Set this to "animate" if you want to animate the tree after adding the subtree. You can also set this parameter to "replot" to just replot the subtree.
              onComplete - (optional|object) An action to perform after the animation (if any).
    
           Example:

           (start code js)
             st.addSubtree(json, 'animate', {
                onComplete: function() {
                  alert('complete!');
                }
             });
           (end code)
        */
        addSubtree: function(subtree, method, onComplete) {
            if(method == 'replot') {
                this.op.sum(subtree, $.extend({ type: 'replot' }, onComplete || {}));
            } else if (method == 'animate') {
            }
        },
    
        /*
           Method: removeSubtree
        
            Removes a subtree.
        
           Parameters:
              id - (string) The _id_ of the subtree to be removed.
              removeRoot - (boolean) Default's *false*. Remove the root of the subtree or only its subnodes.
              method - (string) Set this to "animate" if you want to animate the tree after removing the subtree. You can also set this parameter to "replot" to just replot the subtree.
              onComplete - (optional|object) An action to perform after the animation (if any).

          Example:

          (start code js)
            st.removeSubtree('idOfSubtreeToBeRemoved', false, 'animate', {
              onComplete: function() {
                alert('complete!');
              }
            });
          (end code)
    
        */
        removeSubtree: function(id, removeRoot, method, onComplete) {
            var node = this.graph.getNode(id), subids = [];
            node.eachLevel(+!removeRoot, false, function(n) {
                subids.push(n.id);
            });
            if(method == 'replot') {
                this.op.removeNode(subids, $.extend({ type: 'replot' }, onComplete || {}));
            } else if (method == 'animate') {
            }
        },
    
        /*
           Method: select
        
            Selects a node in the <ST> without performing an animation. Useful when selecting 
            nodes which are currently hidden or deep inside the tree.

          Parameters:
            id - (string) The id of the node to select.
            onComplete - (optional|object) an onComplete callback.

          Example:
          (start code js)
            st.select('mynodeid', {
              onComplete: function() {
                alert('complete!');
              }
            });
          (end code)
        */
        select: function(id, onComplete) {
            var group = this.group, geom = this.geom;
            var node=  this.graph.getNode(id), canvas = this.canvas;
            var root  = this.graph.getNode(this.root);
            var complete = $.merge(this.controller, onComplete);
            var that = this;
    
            complete.onBeforeCompute(node);
            this.selectPath(node);
            this.clickedNode= node;
            this.requestNodes(node, {
                onComplete: function(){
                    group.hide(group.prepare(getNodesToHide.call(that)), complete);
                    geom.setRightLevelToShow(node, canvas);
                    that.compute("current");
                    that.graph.eachNode(function(n) { 
                        var pos = n.pos.getc(true);
                        n.startPos.setc(pos.x, pos.y);
                        n.endPos.setc(pos.x, pos.y);
                        n.visited = false; 
                    });
                    var offset = { x: complete.offsetX, y: complete.offsetY };
                    that.geom.translate(node.endPos.add(offset).$scale(-1), ["start", "current", "end"]);
                    group.show(getNodesToShow.call(that));              
                    that.plot();
                    complete.onAfterCompute(that.clickedNode);
                    complete.onComplete();
                }
            });     
        },
    
      /*
         Method: onClick
    
        Animates the <ST> to center the node specified by *id*.
            
        Parameters:
        
        id - (string) A node id.
        options - (optional|object) A group of options and callbacks described below.
        onComplete - (object) An object callback called when the animation finishes.
        Move - (object) An object that has as properties _offsetX_ or _offsetY_ for adding some offset position to the centered node.

        Example:

        (start code js)
          st.onClick('mynodeid', {
	          Move: {
	          	enable: true,
	            offsetX: 30,
	            offsetY: 5
	          },
	          onComplete: function() {
	              alert('yay!');
	          }
          });
        (end code)
    
        */    
      onClick: function (id, options) {
        var canvas = this.canvas, that = this, Geom = this.geom, config = this.config;
        var innerController = {
            Move: {
        	    enable: true,
              offsetX: config.offsetX || 0,
              offsetY: config.offsetY || 0  
            },
            setRightLevelToShowConfig: false,
            onBeforeRequest: $.empty,
            onBeforeContract: $.empty,
            onBeforeMove: $.empty,
            onBeforeExpand: $.empty
        };
        var complete = $.merge(this.controller, innerController, options);
        
        if(!this.busy) {
            this.busy = true;
            var node = this.graph.getNode(id);
            this.selectPath(node, this.clickedNode);
           	this.clickedNode = node;
            complete.onBeforeCompute(node);
            complete.onBeforeRequest(node);
            this.requestNodes(node, {
                onComplete: function() {
                    complete.onBeforeContract(node);
                    that.contract({
                        onComplete: function() {
                            Geom.setRightLevelToShow(node, canvas, complete.setRightLevelToShowConfig);
                            complete.onBeforeMove(node);
                            that.move(node, {
                                Move: complete.Move,
                                onComplete: function() {
                                    complete.onBeforeExpand(node);
                                    that.expand(node, {
                                        onComplete: function() {
                                            that.busy = false;
                                            complete.onAfterCompute(id);
                                            complete.onComplete();
                                        }
                                    }); // expand
                                }
                            }); // move
                        }
                    });// contract
                }
            });// request
        }
      }
    });

})();

$jit.ST.$extend = true;


/*
    
     Performs operations on group of nodes.

*/
$jit.ST.Group = new Class({
    
    initialize: function(viz) {
        this.viz = viz;
        this.canvas = viz.canvas;
        this.config = viz.config;
        this.animation = new Animation;
        this.nodes = null;
    },
    
    /*
    
       Calls the request method on the controller to request a subtree for each node. 
    */
    requestNodes: function(nodes, controller) {
        var counter = 0, len = nodes.length, nodeSelected = {};
        var complete = function() { controller.onComplete(); };
        var viz = this.viz;
        if(len == 0) complete();
        for(var i=0; i<len; i++) {
            nodeSelected[nodes[i].id] = nodes[i];
            controller.request(nodes[i].id, nodes[i]._level, {
                onComplete: function(nodeId, data) {
                    if(data && data.children) {
                        data.id = nodeId;
                        viz.op.sum(data, { type: 'nothing' });
                    }
                    if(++counter == len) {
                        viz.graph.computeLevels(viz.root, 0);
                        complete();
                    }
                }
            });
        }
    },
    
    /*
    
       Collapses group of nodes. 
    */
    contract: function(nodes, controller) {
        var viz = this.viz;
        var that = this;

        nodes = this.prepare(nodes);
        this.animation.setOptions($.merge(controller, {
            $animating: false,
            compute: function(delta) {
              if(delta == 1) delta = 0.99;
              that.plotStep(1 - delta, controller, this.$animating);
              this.$animating = 'contract';
            },
            
            complete: function() {
                that.hide(nodes, controller);
            }       
        })).start();
    },
    
    hide: function(nodes, controller) {
        var viz = this.viz;
        for(var i=0; i<nodes.length; i++) {
            // TODO nodes are requested on demand, but not
            // deleted when hidden. Would that be a good feature?
            // Currently that feature is buggy, so I'll turn it off
            // Actually this feature is buggy because trimming should take
            // place onAfterCompute and not right after collapsing nodes.
            if (true || !controller || !controller.request) {
                nodes[i].eachLevel(1, false, function(elem){
                    if (elem.exist) {
                        $.extend(elem, {
                            'drawn': false,
                            'exist': false
                        });
                    }
                });
            } else {
                var ids = [];
                nodes[i].eachLevel(1, false, function(n) {
                    ids.push(n.id);
                });
                viz.op.removeNode(ids, { 'type': 'nothing' });
                viz.labels.clearLabels();
            }
        }
        controller.onComplete();
    },    
    

    /*
       Expands group of nodes. 
    */
    expand: function(nodes, controller) {
        var that = this;
        this.show(nodes);
        this.animation.setOptions($.merge(controller, {
            $animating: false,
            compute: function(delta) {
                that.plotStep(delta, controller, this.$animating);
                this.$animating = 'expand';
            },
            
            complete: function() {
                that.plotStep(undefined, controller, false);
                controller.onComplete();
            }       
        })).start();
        
    },
    
    show: function(nodes) {
        var config = this.config;
        this.prepare(nodes);
        $.each(nodes, function(n) {
        	// check for root nodes if multitree
        	if(config.multitree && !('$orn' in n.data)) {
        		delete n.data.$orns;
        		var orns = ' ';
        		n.eachSubnode(function(ch) {
        			if(('$orn' in ch.data) 
        					&& orns.indexOf(ch.data.$orn) < 0 
        					&& ch.exist && !ch.drawn) {
        				orns += ch.data.$orn + ' ';
        			}
        		});
        		n.data.$orns = orns;
        	}
            n.eachLevel(0, config.levelsToShow, function(n) {
            	if(n.exist) n.drawn = true;
            });     
        });
    },
    
    prepare: function(nodes) {
        this.nodes = this.getNodesWithChildren(nodes);
        return this.nodes;
    },
    
    /*
       Filters an array of nodes leaving only nodes with children.
    */
    getNodesWithChildren: function(nodes) {
        var ans = [], config = this.config, root = this.viz.root;
        nodes.sort(function(a, b) { return (a._depth <= b._depth) - (a._depth >= b._depth); });
        for(var i=0; i<nodes.length; i++) {
            if(nodes[i].anySubnode("exist")) {
            	for (var j = i+1, desc = false; !desc && j < nodes.length; j++) {
                    if(!config.multitree || '$orn' in nodes[j].data) {
                		desc = desc || nodes[i].isDescendantOf(nodes[j].id);                    	
                    }
                }
                if(!desc) ans.push(nodes[i]);
            }
        }
        return ans;
    },
    
    plotStep: function(delta, controller, animating) {
        var viz = this.viz,
        config = this.config,
        canvas = viz.canvas, 
        ctx = canvas.getCtx(),
        nodes = this.nodes;
        var i, node;
        // hide nodes that are meant to be collapsed/expanded
        var nds = {};
        for(i=0; i<nodes.length; i++) {
          node = nodes[i];
          nds[node.id] = [];
          var root = config.multitree && !('$orn' in node.data);
          var orns = root && node.data.$orns;
          node.eachSubgraph(function(n) { 
            // TODO(nico): Cleanup
        	  // special check for root node subnodes when
        	  // multitree is checked.
        	  if(root && orns && orns.indexOf(n.data.$orn) > 0 
        			  && n.drawn) {
        		  n.drawn = false;
                  nds[node.id].push(n);
              } else if((!root || !orns) && n.drawn) {
                n.drawn = false;
                nds[node.id].push(n);
              }
            });	
            node.drawn = true;
        }
        // plot the whole (non-scaled) tree
        if(nodes.length > 0) viz.fx.plot();
        // show nodes that were previously hidden
        for(i in nds) {
          $.each(nds[i], function(n) { n.drawn = true; });
        }
        // plot each scaled subtree
        for(i=0; i<nodes.length; i++) {
          node = nodes[i];
          ctx.save();
          viz.fx.plotSubtree(node, controller, delta, animating);                
          ctx.restore();
        }
      },

      getSiblings: function(nodes) {
        var siblings = {};
        $.each(nodes, function(n) {
            var par = n.getParents();
            if (par.length == 0) {
                siblings[n.id] = [n];
            } else {
                var ans = [];
                par[0].eachSubnode(function(sn) {
                    ans.push(sn);
                });
                siblings[n.id] = ans;
            }
        });
        return siblings;
    }
});

/*
   ST.Geom

   Performs low level geometrical computations.

   Access:

   This instance can be accessed with the _geom_ parameter of the st instance created.

   Example:

   (start code js)
    var st = new ST(canvas, config);
    st.geom.translate //or can also call any other <ST.Geom> method
   (end code)

*/

$jit.ST.Geom = new Class({
    Implements: Graph.Geom,
    /*
       Changes the tree current orientation to the one specified.

       You should usually use <ST.switchPosition> instead.
    */  
    switchOrientation: function(orn) {
    	this.config.orientation = orn;
    },

    /*
       Makes a value dispatch according to the current layout
       Works like a CSS property, either _top-right-bottom-left_ or _top|bottom - left|right_.
     */
    dispatch: function() {
        var args = Array.prototype.slice.call(arguments);
        var s = args.shift(), len = args.length;
        var val = function(a) { return typeof a == 'function'? a() : a; };
        if(len == 2) {
            return (s == "top" || s == "bottom")? val(args[0]) : val(args[1]);
        } else if(len == 4) {
            switch(s) {
                case "top": return val(args[0]);
                case "right": return val(args[1]);
                case "bottom": return val(args[2]);
                case "left": return val(args[3]);
            }
        }
        return undefined;
    },

    /*
       Returns label height or with, depending on the tree current orientation.
    */  
    getSize: function(n, invert) {
        var data = n.data, config = this.config;
        var siblingOffset = config.siblingOffset;
        var s = (config.multitree 
        		&& ('$orn' in data) 
        		&& data.$orn) || config.orientation;
        var w = n.getData('width') + siblingOffset;
        var h = n.getData('height') + siblingOffset;
        if(!invert)
            return this.dispatch(s, h, w);
        else
            return this.dispatch(s, w, h);
    },
    
    /*
       Calculates a subtree base size. This is an utility function used by _getBaseSize_
    */  
    getTreeBaseSize: function(node, level, leaf) {
        var size = this.getSize(node, true), baseHeight = 0, that = this;
        if(leaf(level, node)) return size;
        if(level === 0) return 0;
        node.eachSubnode(function(elem) {
            baseHeight += that.getTreeBaseSize(elem, level -1, leaf);
        });
        return (size > baseHeight? size : baseHeight) + this.config.subtreeOffset;
    },


    /*
       getEdge
       
       Returns a Complex instance with the begin or end position of the edge to be plotted.

       Parameters:

       node - A <Graph.Node> that is connected to this edge.
       type - Returns the begin or end edge position. Possible values are 'begin' or 'end'.

       Returns:

       A <Complex> number specifying the begin or end position.
    */  
    getEdge: function(node, type, s) {
    	var $C = function(a, b) { 
          return function(){
            return node.pos.add(new Complex(a, b));
          }; 
        };
        var dim = this.node;
        var w = node.getData('width');
        var h = node.getData('height');

        if(type == 'begin') {
            if(dim.align == "center") {
                return this.dispatch(s, $C(0, h/2), $C(-w/2, 0),
                                     $C(0, -h/2),$C(w/2, 0));
            } else if(dim.align == "left") {
                return this.dispatch(s, $C(0, h), $C(0, 0),
                                     $C(0, 0), $C(w, 0));
            } else if(dim.align == "right") {
                return this.dispatch(s, $C(0, 0), $C(-w, 0),
                                     $C(0, -h),$C(0, 0));
            } else throw "align: not implemented";
            
            
        } else if(type == 'end') {
            if(dim.align == "center") {
                return this.dispatch(s, $C(0, -h/2), $C(w/2, 0),
                                     $C(0, h/2),  $C(-w/2, 0));
            } else if(dim.align == "left") {
                return this.dispatch(s, $C(0, 0), $C(w, 0),
                                     $C(0, h), $C(0, 0));
            } else if(dim.align == "right") {
                return this.dispatch(s, $C(0, -h),$C(0, 0),
                                     $C(0, 0), $C(-w, 0));
            } else throw "align: not implemented";
        }
    },

    /*
       Adjusts the tree position due to canvas scaling or translation.
    */  
    getScaledTreePosition: function(node, scale) {
        var dim = this.node;
        var w = node.getData('width');
        var h = node.getData('height');
        var s = (this.config.multitree 
        		&& ('$orn' in node.data) 
        		&& node.data.$orn) || this.config.orientation;

        var $C = function(a, b) { 
          return function(){
            return node.pos.add(new Complex(a, b)).$scale(1 - scale);
          }; 
        };
        if(dim.align == "left") {
            return this.dispatch(s, $C(0, h), $C(0, 0),
                                 $C(0, 0), $C(w, 0));
        } else if(dim.align == "center") {
            return this.dispatch(s, $C(0, h / 2), $C(-w / 2, 0),
                                 $C(0, -h / 2),$C(w / 2, 0));
        } else if(dim.align == "right") {
            return this.dispatch(s, $C(0, 0), $C(-w, 0),
                                 $C(0, -h),$C(0, 0));
        } else throw "align: not implemented";
    },

    /*
       treeFitsInCanvas
       
       Returns a Boolean if the current subtree fits in canvas.

       Parameters:

       node - A <Graph.Node> which is the current root of the subtree.
       canvas - The <Canvas> object.
       level - The depth of the subtree to be considered.
    */  
    treeFitsInCanvas: function(node, canvas, level) {
        var csize = canvas.getSize();
        var s = (this.config.multitree 
        		&& ('$orn' in node.data) 
        		&& node.data.$orn) || this.config.orientation;

        var size = this.dispatch(s, csize.width, csize.height);
        var baseSize = this.getTreeBaseSize(node, level, function(level, node) { 
          return level === 0 || !node.anySubnode();
        });
        return (baseSize < size);
    }
});

/*
  Class: ST.Plot
  
  Custom extension of <Graph.Plot>.

  Extends:

  All <Graph.Plot> methods
  
  See also:
  
  <Graph.Plot>

*/
$jit.ST.Plot = new Class({
    
    Implements: Graph.Plot,
    
    /*
       Plots a subtree from the spacetree.
    */
    plotSubtree: function(node, opt, scale, animating) {
        var viz = this.viz, canvas = viz.canvas, config = viz.config;
        scale = Math.min(Math.max(0.001, scale), 1);
        if(scale >= 0) {
            node.drawn = false;     
            var ctx = canvas.getCtx();
            var diff = viz.geom.getScaledTreePosition(node, scale);
            ctx.translate(diff.x, diff.y);
            ctx.scale(scale, scale);
        }
        this.plotTree(node, $.merge(opt, {
          'withLabels': true,
          'hideLabels': !!scale,
          'plotSubtree': function(n, ch) {
            var root = config.multitree && !('$orn' in node.data);
            var orns = root && node.getData('orns');
            return !root || orns.indexOf(node.getData('orn')) > -1;
          }
        }), animating);
        if(scale >= 0) node.drawn = true;
    },   
   
    /*
        Method: getAlignedPos
        
        Returns a *x, y* object with the position of the top/left corner of a <ST> node.
        
        Parameters:
        
        pos - (object) A <Graph.Node> position.
        width - (number) The width of the node.
        height - (number) The height of the node.
        
     */
    getAlignedPos: function(pos, width, height) {
        var nconfig = this.node;
        var square, orn;
        if(nconfig.align == "center") {
            square = {
                x: pos.x - width / 2,
                y: pos.y - height / 2
            };
        } else if (nconfig.align == "left") {
            orn = this.config.orientation;
            if(orn == "bottom" || orn == "top") {
                square = {
                    x: pos.x - width / 2,
                    y: pos.y
                };
            } else {
                square = {
                    x: pos.x,
                    y: pos.y - height / 2
                };
            }
        } else if(nconfig.align == "right") {
            orn = this.config.orientation;
            if(orn == "bottom" || orn == "top") {
                square = {
                    x: pos.x - width / 2,
                    y: pos.y - height
                };
            } else {
                square = {
                    x: pos.x - width,
                    y: pos.y - height / 2
                };
            }
        } else throw "align: not implemented";
        
        return square;
    },
    
    getOrientation: function(adj) {
    	var config = this.config;
    	var orn = config.orientation;

    	if(config.multitree) {
        	var nodeFrom = adj.nodeFrom;
        	var nodeTo = adj.nodeTo;
    		orn = (('$orn' in nodeFrom.data) 
        		&& nodeFrom.data.$orn) 
        		|| (('$orn' in nodeTo.data) 
        		&& nodeTo.data.$orn);
    	}

    	return orn; 
    }
});

/*
  Class: ST.Label

  Custom extension of <Graph.Label>. 
  Contains custom  <Graph.Label.HTML> extensions

  Extends:

  All <Graph.Label> methods and subclasses.

  See also:

  <Graph.Label>,  <Graph.Label.HTML>
 */ 
$jit.ST.Label = {};

$jit.ST.Label.DOM = new Class({
  Implements: Graph.Label.DOM,

  /* 
      placeLabel

      Overrides abstract method placeLabel in <Graph.Plot>.

      Parameters:

      tag - A DOM label element.
      node - A <Graph.Node>.
      controller - A configuration/controller object passed to the visualization.
     
    */
    placeLabel: function(tag, node, controller) {
        var pos = node.pos.getc(true), 
            config = this.viz.config, 
            dim = config.Node, 
            canvas = this.viz.canvas,
            w = node.getData('width'),
            h = node.getData('height'),
            radius = canvas.getSize(),
            labelPos, orn;
        
        var ox = canvas.translateOffsetX,
            oy = canvas.translateOffsetY,
            sx = canvas.scaleOffsetX,
            sy = canvas.scaleOffsetY,
            posx = pos.x * sx + ox,
            posy = pos.y * sy + oy;

        if(dim.align == "center") {
            labelPos= {
                x: Math.round(posx - w / 2 + radius.width/2),
                y: Math.round(posy - h / 2 + radius.height/2)
            };
        } else if (dim.align == "left") {
            orn = config.orientation;
            if(orn == "bottom" || orn == "top") {
                labelPos= {
                    x: Math.round(posx - w / 2 + radius.width/2),
                    y: Math.round(posy + radius.height/2)
                };
            } else {
                labelPos= {
                    x: Math.round(posx + radius.width/2),
                    y: Math.round(posy - h / 2 + radius.height/2)
                };
            }
        } else if(dim.align == "right") {
            orn = config.orientation;
            if(orn == "bottom" || orn == "top") {
                labelPos= {
                    x: Math.round(posx - w / 2 + radius.width/2),
                    y: Math.round(posy - h + radius.height/2)
                };
            } else {
                labelPos= {
                    x: Math.round(posx - w + radius.width/2),
                    y: Math.round(posy - h / 2 + radius.height/2)
                };
            }
        } else throw "align: not implemented";

        var style = tag.style;
        style.left = labelPos.x + 'px';
        style.top  = labelPos.y + 'px';
        style.display = this.fitsInCanvas(labelPos, canvas)? '' : 'none';
        controller.onPlaceLabel(tag, node);
    }
});


/*
   ST.Label.HTML

   Custom extension of <Graph.Label.HTML>.

   Extends:

   All <Graph.Label.HTML> methods.

   See also:

   <Graph.Label.HTML>

*/
$jit.ST.Label.HTML = new Class({
  Implements: [$jit.ST.Label.DOM, Graph.Label.HTML],

  initialize: function(viz) {
    this.viz = viz;
  }
});


/*
  Class: ST.Plot.NodeTypes

  This class contains a list of <Graph.Node> built-in types. 
  Node types implemented are 'none', 'circle', 'rectangle', 'ellipse' and 'square'.

  You can add your custom node types, customizing your visualization to the extreme.

  Example:

  (start code js)
    ST.Plot.NodeTypes.implement({
      'mySpecialType': {
        'render': function(node, canvas) {
          //print your custom node to canvas
        },
        //optional
        'contains': function(node, pos) {
          //return true if pos is inside the node or false otherwise
        }
      }
    });
  (end code)

*/
$jit.ST.Plot.NodeTypes = new Class({
  'rectangle': {
    'render': function(node, canvas) {
      var width = node.getData('width'),
          height = node.getData('height'),
          pos = this.getAlignedPos(node.pos.getc(true), width, height);
      this.nodeHelper.rectangle.render('fill', {x:pos.x+width/2, y:pos.y+height/2}, width, height, canvas);
    }
  }
});

/*
  Class: ST.Plot.EdgeTypes

  This class contains a list of <Graph.Adjacence> built-in types. 
  Edge types implemented are 'none', 'line', 'arrow', 'quadratic:begin', 'quadratic:end', 'bezier'.

  You can add your custom edge types, customizing your visualization to the extreme.

  Example:

  (start code js)
    ST.Plot.EdgeTypes.implement({
      'mySpecialType': {
        'render': function(adj, canvas) {
          //print your custom edge to canvas
        },
        //optional
        'contains': function(adj, pos) {
          //return true if pos is inside the arc or false otherwise
        }
      }
    });
  (end code)

*/
$jit.ST.Plot.EdgeTypes = new Class({
    'none': $.empty,
    'bezier': {
       'render': function(adj, canvas) {
         var orn = this.getOrientation(adj),
             nodeFrom = adj.nodeFrom, 
             nodeTo = adj.nodeTo,
             rel = nodeFrom._depth < nodeTo._depth,
             begin = this.viz.geom.getEdge(rel? nodeFrom:nodeTo, 'begin', orn),
             end =  this.viz.geom.getEdge(rel? nodeTo:nodeFrom, 'end', orn),
             dim = adj.getData('dim'),
             ctx = canvas.getCtx();
         ctx.beginPath();
         ctx.moveTo(begin.x, begin.y);
         switch(orn) {
           case "left":
             ctx.bezierCurveTo(begin.x + dim, begin.y, end.x - dim, end.y, end.x, end.y);
             break;
           case "right":
             ctx.bezierCurveTo(begin.x - dim, begin.y, end.x + dim, end.y, end.x, end.y);
             break;
           case "top":
             ctx.bezierCurveTo(begin.x, begin.y + dim, end.x, end.y - dim, end.x, end.y);
             break;
           case "bottom":
             ctx.bezierCurveTo(begin.x, begin.y - dim, end.x, end.y + dim, end.x, end.y);
             break;
         }
         ctx.stroke();
       }
    }
});







 })();
