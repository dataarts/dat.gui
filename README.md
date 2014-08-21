# dat.gui

Quickly configurable controllers for the web. 

## Usage

Include 

```html
<script src="gui.js"></script>
```

With very little code, dat gui creates an interface that you can use to modify variables.

```javascript
var gui = new dat.gui();
gui.add( object, 'someNumber', 0, 1 );
```

