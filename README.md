# dat.GUI
A lightweight graphical user interface for changing variables in JavaScript. 

Get started with dat.GUI by reading the tutorial at http://workshop.chromeexperiments.com/examples/gui.

[Change Log](CHANGELOG.md)

## Packaged Builds
The easiest way to use dat.GUI in your code is by using the built source at `build/dat.gui.min.js`. These built JavaScript files bundle all the necessary dependencies to run dat.GUI.

In your `head` tag, include the following code:
```
<script type="text/javascript" src="dat.gui.min.js"></script>
```

## Directory Contents

```
├── build - Compiled source code.
├── node_modules - External node dependencies.
├── src - Source files.
├── tests - Tests.
└── webpack - Webpack config files.
```

## Building your own dat.GUI

In the terminal, enter the following:

```
$ npm run build
```

## npm scripts

- npm run build - Build development and production version of scripts.
- npm run dev - Build development version of script and watch for changes.

## Thanks
The following libraries / open-source projects were used in the development of dat.GUI:
 * [webpack](https://webpack.github.io/)
 * [Sass](http://sass-lang.com/)
 * [node.js](http://nodejs.org/)
 * [QUnit](https://github.com/jquery/qunit) / [jquery](http://jquery.com/)