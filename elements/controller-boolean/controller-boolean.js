/* globals Gui, Polymer */
'use strict';

Gui.register('controller-boolean', function(value) {

  return typeof value == 'boolean';

});

Polymer('controller-boolean', {

  ready: function() {

  },

  toggle: function() {

    this.value = !this.value;

  }

});
