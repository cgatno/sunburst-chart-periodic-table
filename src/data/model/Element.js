/**
 * Element.js
 *
 * A module for representing individual elements and exposing their properties
 *
 */


/**
 * Initalizes a new Element object from the object obtained by parsing
 * assets/data/periodic_table_clean.json with our in-house JsonDataLoader
 *
 * @param {Object} elementJObj the object obtained by parsing assets/data/periodic_table_clean.json
 * with our in-house JsonDataLoader
 */
const Element = function _Element(elementJObj) {
  this.atomicNumber = elementJObj.properties['atomic-number']; // this and atomic-weight must be accessed using bracket notation because they have hyphens
  this.atomicWeight = elementJObj.properties['atomic-weight']; // this and atomic-weight must be accessed using bracket notation because they have hyphens
  this.elementName = elementJObj.properties.element;
  this.eleSymbol = elementJObj.properties.symbol; // rename since symbol is reserved keyword in ES6
  this.type = elementJObj.properties.type;
  this.value = 1; // Uniform value for initializing the chart to get equal arc angles
};

module.exports = Element;
