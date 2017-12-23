# dat.GUI
A lightweight graphical user interface for changing variables in JavaScript. 

Get started with dat.GUI by reading the [tutorial](http://workshop.chromeexperiments.com/examples/gui)
or the [API documentation](API.md).



## Packaged Builds
The easiest way to use dat.GUI in your code is by using the built source at `build/dat.gui.min.js`. These built JavaScript files bundle all the necessary dependencies to run dat.GUI.

In your `head` tag, include the following code:
```
<script type="text/javascript" src="dat.gui.min.js"></script>
```

## Directory Contents

```
├── build - Compiled source code.
├── src - Source files.
├── tests - Tests.
└── webpack - Webpack config files.
```

## Building your own dat.GUI

In the terminal, enter the following:

```
$ npm install
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.
- npm run dev - Build development version of script and watch for changes.


## Working with Content Security Policy
If you're using a server with a Content Security Policy in place that blocks 'unsafe-inline', you will have problems when dat.gui.js tries to inject style information. To get around this, load 'build/dat.gui.css' as an external style sheet.

## Changes
View the [Change Log](CHANGELOG.md)

## Thanks
The following libraries / open-source projects were used in the development of dat.GUI:
 * [webpack](https://webpack.github.io/)
 * [Sass](http://sass-lang.com/)
 * [node.js](http://nodejs.org/)
 * [QUnit](https://github.com/jquery/qunit) / [jquery](http://jquery.com/)