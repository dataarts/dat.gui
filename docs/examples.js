var examples = {};

examples[ 'default' ] = function() {

    var gui = new Gui();
    //gui.anon( 'hi', 'todo' );
    return gui;

}

// "basic-usage", "limiting-input", "color-controllers", "events", "folders-comments", "saving-values", "presets", "save-to-disk", "custom-placement", "defining-custom-controllers", "publishing-custom-controllers"
examples[ 'basic-usage' ] = function() {

    var gui = new Gui();

    var object = {
        numberProperty: 0,
        stringProperty: 'hey',
        booleanProperty: false,
        functionProperty: function() {

        }
    }

    gui.add( object, 'numberProperty', 0, 1 ); // Slider
    gui.add( object, 'stringProperty' ); // Text box
    gui.add( object, 'booleanProperty' ); // Check box
    gui.add( object, 'functionProperty' ); // Button

    return gui;

};
