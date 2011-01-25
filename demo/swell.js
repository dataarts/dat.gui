/**
 * @author george michael brower / http://georgemichaelbrower.com/
 */

function loadSVG(loc, success, fail) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status == 200) {
				if (xmlhttp.responseXML == null) {
					if (fail != undefined) fail.call(this, loc);
				} else {
					var node = xmlhttp.responseXML.getElementsByTagName("svg").item(0);
					var svg = new SVG(node);
					svg.filename = loc;
					success.call(this, svg, loc);
				}
			} else {
				if (fail != undefined) fail.call(this, loc);
			}
 
 		}	
	}
	xmlhttp.open("GET", loc, true);
	xmlhttp.send(null);
}

function createSVG(svgText) {
	var node = document.createElement("svg");
	node.innerHTML = svgText;
	return new SVG(node);
}

var SVG = function(node) {
	this.filename = "";
	
	this.children = [];
	
	// TODO interpret things other than pixels.
	
	var w = node.getAttribute("width");
	var h = node.getAttribute("height");
	
  	this.width = w == null ? 0 : parseFloat(w.replace("px", ""));
  	this.height = h == null ? 0 : parseFloat(h.replace("px", "")); 
  	
	for (var i = 0; i < node.childNodes.length; i++) {
	
	  if (!node.childNodes.item(i).getAttribute) continue;
	  
	  var toAdd;
	  if (node.childNodes.item(i).nodeName == "g") {
	  	  toAdd = new SVG(node.childNodes.item(i));	
	  } else {
		  toAdd = new Path(node.childNodes.item(i));
	  }
	  
	  this.children.push(toAdd);
	  
	}
	
	// Draws every path in this SVG to the specified context.
	this.draw = function(context) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw(context);
		}
	};
	
	
}

var Path = function(element) {

	this.element = element;
	this.commands = commands(element);
	this.lineWidth = parseLineWidth(element);
  	this.strokeStyle = parseStrokeStyle(element);
  	this.fillStyle = parseFillStyle(element);

// for at
		this.totalLength = 0;
		this.lengths = [];
		this.tlengths = []
		

	var turtle = function() {
		this.x;
		this.y;
		this.x1;
		this.y1;
		this.x2;
		this.y2;
		this.reset = function() {
			this.x = this.y = this.x1 = this.y1 = this.x2 = this.y2 = 0;
		}
		this.reset();
	}
		
	// Draws this entire path to the specified context.
	this.draw = function(context) {
		this.style(context);
		context.beginPath();
		this.shape(context);
		this.end(context);
		
	};

	// Calls canvas shape methods such as moveTo(), lineTo(), bezierCurveTo() based on the commands in this path.
	this.shape = function(context) {
		for (var i = 0; i < this.commands.length; i++) {
			this.commands[i].shape(turtle, context);
		}
	};
	
	this.lerp = function(a,b,c,d,t) {
			var t1 = 1.0 - t;
			return a*t1*t1*t1 + 3*b*t*t1*t1 + 3*c*t*t*t1 + d*t*t*t;
		
	};
	
	this.at = function(t, c) {
		var rx, ry;
		if (this.lengths.length == 0) {
			this.calcLengths(c);
		}
		
		var tt = this.tlengths[0];
		var i = 0;
		
		while (t > tt) {
			i++;
			tt += this.tlengths[i];
		}
		
		pt =  tt - this.tlengths[i];
		

		
		var it = this.map(t, pt, tt, 0, 1);
		
		
		for (var j = 0; j <= i; j++) {
		this.commands[j].shape(turtle, c);
		}
		var px = turtle.x;
		var py = turtle.y;
		
		this.commands[i+1].shape(turtle, c);
		
		
				rx = this.lerp(px, turtle.x1, turtle.x2, turtle.x, it);
				ry = this.lerp(py, turtle.y1, turtle.y2, turtle.y, it);

		return {x:rx, y:ry};	
	};
	
	this.map = function(v, i1, i2, o1, o2) {
		return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}

	
	this.calcLengths = function(c) {
		var rx,ry;
		var prx, pry;
		
		// go through and get the length of the entire path
		// as well as the lengths of each indiv. path
		
		var curLength = 0;
	
		var lengthAccuracy = 0.001;
		
		this.commands[0].shape(turtle, c);

		var px = prx = turtle.x;
		var py = pry = turtle.y;

		for (var i = 1; i < this.commands.length; i++) {
		
			curLength = 0;
	
				px = turtle.x;
				py = turtle.y;
				this.commands[i].shape(turtle, c);			
				
			for (var tt = 0; tt <=1; tt+= lengthAccuracy) {
			
				rx = this.lerp(px, turtle.x1, turtle.x2, turtle.x, tt);
				ry = this.lerp(py, turtle.y1, turtle.y2, turtle.y, tt);


				curLength += this.dist(rx, ry, prx, pry);

				
				prx = rx;
				pry = ry;
				
			}
			
			this.lengths.push(curLength);
			this.totalLength += curLength;
			
			
		}
		
		for (var j = 0; j < this.lengths.length; j++) {
			this.tlengths.push(this.lengths[j]/this.totalLength);
		}
	}
	
	this.dist = function (x, y, xx, yy) {
  	  return Math.sqrt((x - xx) * (x - xx) + (y - yy) * (y - yy));
	};
	
	// Sets the drawing style of the canvas context based on the styles in this Path.
	this.style = function(context) {
		
		if (this.lineWidth != null) {
		  context.lineWidth = this.lineWidth;
		} 
		
		if (this.strokeStyle != null) {
		  context.strokeStyle = this.strokeStyle;
		  if (this.lineWidth == undefined) {
        	context.lineWidth = 1;
		  }
		}
		
		if (this.fillStyle != null) {
		  context.fillStyle = this.fillStyle;
		}
		
	};
	
	// Calls context.fill() and/or context.stroke() depending on the styles in this Path.
	this.end = function(context) {
		if (this.fillStyle != null) context.fill();
		if (this.strokeStyle != null) context.stroke();
	}

}

var parseLineWidth = function(element) {
  var a = element.attributes.getNamedItem("stroke-width");
  return a == null ? null : parseFloat(a.nodeValue);
}

var parseStrokeStyle = function(element) {
   var a = element.attributes.getNamedItem("stroke");
   return a == null ? null : a.nodeValue;
}

var parseFillStyle = function(element) {
  var a = element.attributes.getNamedItem("fill");
  if (a == null) { 
	   var s = element.attributes.getNamedItem("stroke");
	   if (s != null) {
	   	return null;
	   	} else { 
	   	return "#000000";
	   	}
	} else { 
		if (a.nodeValue == "none") return null;
		return a.nodeValue;
	}
}

var Command = function(type, data) {
	this.type = type;
	this.data = data;
	this.debug = false;
	
	// Calls context shape methods such as moveTo(), lineTo(), bezierCurveTo(), etc.
	this.shape = function(turtle, c) {
	
		var px = turtle.x;
		var py = turtle.y;
		
		if (this.type == "M") {
		
			turtle.x = this.data[0];
			turtle.y = this.data[1];
			if (c) c.moveTo(turtle.x, turtle.y);

		
		} else if (this.type == "C") {
		
			turtle.x = this.data[4];
			turtle.y = this.data[5];
			if (c) c.bezierCurveTo(turtle.x1 = this.data[0],
							turtle.y1 = this.data[1], 
							turtle.x2 = this.data[2], 
							turtle.y2 = this.data[3], 
							turtle.x, 
							turtle.y);
		
		} else if (this.type == "c") {
		
			if (c) c.bezierCurveTo(turtle.x1 = turtle.x+this.data[0], 
							turtle.y1 = turtle.y+this.data[1], 
							turtle.x2 = turtle.x+this.data[2], 
							turtle.y2 = turtle.y+this.data[3], 
							turtle.x += this.data[4], 
							turtle.y += this.data[5]);
		
		} else if (this.type == "S") {
			
			turtle.x = this.data[2];
			turtle.y = this.data[3];
			var dx = turtle.x - turtle.x2;
			var dy = turtle.y - turtle.y2;
			if (c) c.bezierCurveTo(turtle.x1 = turtle.x+dx, 
							turtle.y1 = turtle.y+dy, 
							turtle.x2 = this.data[0], 
							turtle.y2 = this.data[1], 
							turtle.x, 
							turtle.y);
		
		} else if (this.type == "s") {
		
			var dx = turtle.x - turtle.x2;
			var dy = turtle.y - turtle.y2;
			if (c) c.bezierCurveTo(turtle.x1 = turtle.x+dx, 
							turtle.y1 = turtle.y+dy, 
							turtle.x2 = turtle.x+this.data[0], 
							turtle.y2 = turtle.y+this.data[1], 
							turtle.x += this.data[2], 
							turtle.y += this.data[3]);
		
		} else if (this.type == "L") {
		
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x = this.data[0], 
					 turtle.y = this.data[1]);
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
		
		} else if (this.type == "l") {
	
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x+=this.data[0], turtle.y+=this.data[1]);
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
			
		} else if (this.type == "H") {
		
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x = this.data[0], turtle.y)
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
			
		} else if (this.type == "h") {
		
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x += this.data[0], turtle.y)     
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
			
		} else if (this.type == "V") {
		
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x, turtle.y = this.data[0]);
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
		
		} else if (this.type == "v") {
		
			turtle.x1 = turtle.x;
			turtle.y1 = turtle.y;
			if (c) c.lineTo(turtle.x, turtle.y += this.data[0]); 
			turtle.x2 = turtle.x;
			turtle.y2 = turtle.y;
		
		} else if (this.type == "z") {
			
			c.closePath();
			
		} else {
		
			alert("unrecognized command " + this.type);
			
		}
		
		if (c){ 
		c.strokeStyle = "#000000";
		c.lineWidth = 1;
		if (this.debug) {
			c.strokeRect(turtle.x-1.5, turtle.y-1.5, 3, 3);
			c.beginPath();
			c.moveTo(turtle.px, turtle.py);
			c.lineTo(turtle.x1, turtle.y1);
			c.closePath();
			c.stroke();
		}
		}
	
	}
	
}

// Utility functions

var commands = function(element) {
	
	if (element.nodeName.toLowerCase() == "path") {
		return commandsFromD(element.getAttribute("d"));
	}
		
	if (element.nodeName.toLowerCase() == "polygon") {
		return commandsFromPoints(element.getAttribute("points"));
	}
	
	if (element.nodeName.toLowerCase() == "line") {
		return commandsFromLine(element);
	}
	
	if (element.nodeName.toLowerCase() == "rect") {
		return commandsFromRect(element);
	}
	
	return [];
	
}

// Returns an array of commands as interpreted by the "d" attribute of a path.
var commandsFromD = function(d) {
	
	var toReturn = [];
	var commands = d.match(/[a-zA-Z][0-9\.\-\,]+/g);
	
	for (var i = 0; i < commands.length; i++) {
	
	var type = commands[i].charAt(0);
	
	// Dirty time.
	var commandData = commands[i].substr(1);
	commandData = commandData.replace(/\-/g, ",-")
	
	if (commandData.charAt(0) == ",") {
	commandData = commandData.substr(1);
	}
	commandData = commandData.split(",");
	for (var j = 0; j < commandData.length; j++) {
	 commandData[j] = parseFloat(commandData[j]);
	}
	
	toReturn.push(new Command(type, commandData));
	
	}
	
	return toReturn;
}

var commandsFromLine = function(element) {
	var toReturn = [];
	var x1 = parseFloat(element.getAttribute("x1"));
	var x2 = parseFloat(element.getAttribute("x2"));
	var y1 = parseFloat(element.getAttribute("y1"));
	var y2 = parseFloat(element.getAttribute("y2"));
	toReturn.push(new Command("M", [x1,y1]));
	toReturn.push(new Command("L", [x2,y2]));
	return toReturn;
}

// Returns an array of commands as interpreted by the "points" attribute of a polygon.
var commandsFromPoints = function(pointAttribute) {
	//pointAttribute = pointAttribute.replace(/\,\-/g, "-");
	
	
	var shouldBeComma = true;
	if (pointAttribute.indexOf(",") == -1) {
		for (var i = 0; i < pointAttribute.length; i++) {
			var c = pointAttribute.charAt(i);
			if (c == " ") {
				if (shouldBeComma) {
					pointAttribute = pointAttribute.setCharAt(i, ",");
				}
				shouldBeComma = !shouldBeComma;
			}
		}
	}
	
	pointAttribute = "M"+pointAttribute;
	pointAttribute = pointAttribute.replace(/ /g, "L") + "z";
	var toReturn = commandsFromD(pointAttribute);
	return toReturn;
}

String.prototype.setCharAt = function(index,chr) {
	if(index > this.length-1) return str;
	return this.substr(0,index) + chr + this.substr(index+1);
}

var commandsFromRect = function(element) {
	
	var toReturn = [];
	var x = parseFloat(element.getAttribute("x"));
	var y = parseFloat(element.getAttribute("y"));
	var w = parseFloat(element.getAttribute("width"));
	var h = parseFloat(element.getAttribute("height"));
	toReturn.push(new Command("M", [x,y]));
	toReturn.push(new Command("h", [w]));
	toReturn.push(new Command("v", [h]));
	toReturn.push(new Command("h", [-w]));
	toReturn.push(new Command("v", [-h]));
	return toReturn;
}