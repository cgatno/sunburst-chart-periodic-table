'use strict';

/**
 * Element.js
 * 
 * A module for representing individual elements and exposing their properties
 * 
 */


/**
 * Instantiates a new Element object from the object obtained by parsing assets/data/periodic_table_clean.json
 * with our in-house JsonDataLoader
 * 
 * @param {Object} elementJObj - the object obtained by parsing assets/data/periodic_table_clean.json
 * with our in-house JsonDataLoader
 */
var Element = function (elementJObj) {
    this.atomicNumber = elementJObj.properties['atomic-number']; // this and atomic-weight must be accessed using bracket notation because they have hyphens
    this.atomicWeight = elementJObj.properties['atomic-weight']; // this and atomic-weight must be accessed using bracket notation because they have hyphens
    this.elementName = elementJObj.properties.element;
    this.eleSymbol = elementJObj.properties.symbol; // rename this to eleSymbol since symbol is a reserved keyword in ES6
    this.type = elementJObj.properties.type;
    this.value = 1; // Set a uniform value that can be bound when initializing the chart to get equal arc angles
};

module.exports = Element;
