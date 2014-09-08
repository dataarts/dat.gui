/* globals Polymer, Path, Gui */
'use strict';

// [ ] scrolling when docked
// [ ] scrolling when window short and not docked

Polymer('gui-panel', {

  docked: false,
  open: true,
  touch: ('ontouchstart' in window) ||
         (!!window.DocumentTouch && document instanceof window.DocumentTouch),

  ready: function() {

    this.defined = {};

  },

    define: function() {

        if ( arguments.length == 1 ) {
            var name = arguments[ 0 ];
            return this.defined[ name ];
        }

        var initialValue = arguments[ 1 ];
        var name = arguments[ 0 ];

        var args = [ this.defined, name ];
        args = args.concat( Array.prototype.slice.call( arguments, 2 ) );

        this.defined[ name ] = initialValue;

    return this.add.apply(this, args);

  },

  add: function(object, path) {

    // Make controller

    var value = Path.get(path).getValueFrom(object);

    if (value === null || value === undefined) {
      return Gui.error(object +
                       ' doesn\'t have a value for path "' + path + '".');
    }

    var args = Array.prototype.slice.call( arguments, 2 );
    var controller;

    if ( args[ 0 ] instanceof Array || typeof args[ 0 ] == 'object' ) {
        controller = document.createElement( 'controller-option' );
    } else { 
        controller = Gui.getController( value );
    }
    
    if ( !controller ) {
        return Gui.error( 'Unrecognized type:', value );
    }

    controller.watch(object, path);
    controller.init.apply(controller, args);

    // Make row

    var row = document.createElement('gui-row');
    row.name = path;

    controller.row = row;

    controller.name = function(name) {
      row.name = name;
    };

    controller.comment = function(comment) {
      row.comment = comment;
    };

    row.appendChild(controller);
    this.appendChild(row);

    return controller;

  },

  // Observers
  // -------------------------------

  openChanged: function() {

    if (this.open || this.docked) {

      // let the style sheet take care of things

      this.$.container.style.transform = '';
      this.$.panel.style.transform = '';

    } else {

      // todo: need the rest of the vendor prefixes ...
      // wish i could pipe javascript variables into styl.

      var y = -this.$.controllers.offsetHeight + 'px';
      this.$.container.style.transform = 'translate3d(0, ' + y + ', 0)';

    }

  },

  dockedChanged: function() {

    this.openChanged();

  },

  // Events
  // -------------------------------

  tapClose: function() {
    this.open = !this.open;
  },

    toggleOpen: function() {
        this.open = !this.open;
    },
    
    // checkHeight: function() {
          
    //     if ( window.innerHeight < this.$.controllers.offsetHeight ) {
    //         this.docked = true;
    //     } else { 
    //         this.docked = false;
    //     }
  //   if ( window.innerHeight < this.$.controllers.offsetHeight) {
  //     this.docked = true;
  //   } else {
  //     this.docked = false;
  //   }

  // },

  // Legacy
  // -------------------------------

  listenAll: function() {

    Gui.warn('controller.listenAll() is deprecated. ' +
             'All controllers are listened for free.');

  }

  // todo: domElement

});
