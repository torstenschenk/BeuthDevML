/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: util
 *
 * Loose collection of helper functions
 */

/* requireJS module definition */
define([], function() {

    'use strict';


    // start with an empty object
    var util = {};

    /**
     * Encapsulates throw for convenience.
     */
    util.fatal = function(msg) {
        throw new Error(msg);
    };

    /**
     * Returns the [x,y] position within the HTML canvas element.
     * **Please note** that this will only work if the positioning
     * of the canvas element has been set to "relative"!
     */
    util.canvasPosition = function(event) {
        return [
            event.layerX,
            event.layerY
        ];
    };

    /**
     * Returns an random integer in [0, range) with cutoff borders margin-wide.
     */
    util.randomInt = function(range, margin) {
        range  = range  || 10;
        margin = margin || 0;
        return Math.floor(Math.random() * (range - 2 * margin)) + margin;
    };

    // helper: convert a byte (0...255) to a 2-digit hex string
    var _byte2Hex = function(byte) {
        var string = byte.toString(16); // convert to hex string
        return string.length === 1 ?    // eventually pad with leading 0
            '0' + string : string; 
    };

    /**
     * Generates a random color in hex notation #rrggbb.
     */
    util.randomHexColor = function() {
        return '#' + 
            _byte2Hex(Math.floor(Math.random() * 256)) + // r
            _byte2Hex(Math.floor(Math.random() * 256)) + // g
            _byte2Hex(Math.floor(Math.random() * 256));  // b
    };

    // return the module interface
    return util;
});
