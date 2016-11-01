'use strict';
/**
 * DataSourceAdapter.js
 * 
 * This is an adapter that generates an array of Group objects which ultimately contain all of the Element objects
 * we'll need to hook up the data source for our Sunburst chart. Generally, the data is returned in the following
 * format:
 * 
 * [(Group->subGroups->elements) ..]
 * 
 */

// Pull in dependencies
var Element = require('../model/Element');
var SubGroup = require('../model/SubGroup');
var Group = require('../model/Group');

var JsonDataLoader = require('../../util/JsonDataLoader');

var DataSourceAdapter = function () {};

// Define constants that we need to properly group elements
const metalTypes = 'Alkali Metal|Alkaline Earth Metal|Metal|Transition Metal|Lanthanide|Actinide'.split('|');
const nonmetalTypes = 'Nonmetal|Noble Gas|Halogen'.split('|');
const otherTypes = 'Metalloid|Transactinide'.split('|');

// These are all ordered by the type lists above
// The metal and nonmetal descriptions have one extra item for the "Others" category
const metalTypeDescriptions = 'Shiny, Soft, Highly Reactive, Low Melting Point|Ductile, Malleable, Low Density, High Melting Point|High Melting Point, High Density|Soluble, Highly Reactive|Radioactive, Paramagnetic|Brittle, Poor Metals, Low Melting Point'.split('|');
const nonMetalTypeDescriptions = 'Toxic, Highly Reactive, Poor Conductors|Colorless, Odorless, Low Chemical Reactivity|Volatile, Low Elasticity, Good Insulators'.split('|');
const otherTypeDescriptions = 'Metallic looking solids, SemiConductors|Radioactive, Synthetic Elements'.split('|');

DataSourceAdapter.prototype.getChartDataSource = function (callback) {
    let groupsCollection = []; // declare an empty array to add the finished groups to - this is what we will ultimately send as a payload

    let metals = new Group('Metals');
    // Add all of the metals subGroups
    for (let i = 0; i < metalTypes.length; i++) {
        metals.subGroups.push(new SubGroup(metalTypes[i]));
        metals.subGroups[i].characteristics = metalTypeDescriptions[i];
    }
    metals.subGroups.push(new SubGroup('Others'));
    metals.subGroups[metals.subGroups.length - 1].characteristics = metalTypeDescriptions[metalTypeDescriptions.length - 1];

    let nonmetals = new Group('Non Metals');
    // Add all of the nonmetal subGroups
    for (let i = 0; i < nonmetalTypes.length; i++) {
        nonmetals.subGroups.push(new SubGroup(nonmetalTypes[i]));
        nonmetals.subGroups[i].characteristics = nonMetalTypeDescriptions[i];
    }
    nonmetals.subGroups.push(new SubGroup('Others'));
    nonmetals.subGroups[nonmetals.subGroups.length - 1].characteristics = nonMetalTypeDescriptions[nonMetalTypeDescriptions.length - 1];

    let others = new Group('Others');
    // Add all of the other subGroups
    for (let i = 0; i < otherTypes.length; i++) {
        others.subGroups.push(new SubGroup(otherTypes[i]));
        others.subGroups[i].characteristics = otherTypeDescriptions[i];
    }

    // Retrieve an array listing of all elements
    // TODO: Build in true async functionality so that we can pause execution
    // until the JSON is loaded and parsed
    JsonDataLoader.getObjectFromJson('../../../assets/data/periodic_table_clean.json', function (jsonObj) {
        let jsonElementArray = jsonObj['periodic-table-elements'];
        // Loop through all of the elements from the JSON and turn them into Element objects
        // then sort them into their groups based on type
        for (let i = 0; i < jsonElementArray.length; i++) {
            // Make a new Element object for us to work with
            let currentElement = new Element(jsonElementArray[i]);

            // Declare empty currentGroup and currentSubGroup variables then set them based on
            // the element type
            let currentGroup, currentSubGroup;
            if (metalTypes.indexOf(currentElement.type) !== -1) { // it is a metal!
                currentGroup = metals;
                if (currentElement.type === 'Metal') { // these belong in the "Others" category
                    currentSubGroup = metals.subGroups[metals.subGroups.length - 1]; // Others will always be the last SubGroup in the array
                }
            } else if (nonmetalTypes.indexOf(currentElement.type) !== -1) { // it is a nonmetal!
                currentGroup = nonmetals;
                if (currentElement.type === 'Nonmetal') { // these belong in the "Others" category
                    currentSubGroup = nonmetals.subGroups[nonmetals.subGroups.length - 1]; // Others will always be the last SubGroup in the array
                }
            } else { // it is...something else
                currentGroup = others;
            }
            if (typeof (currentSubGroup) === 'undefined') currentSubGroup = currentGroup.subGroups.find(subGroupMatchesElementType, currentElement);
            currentSubGroup.elements.push(currentElement);
        }

        groupsCollection.push(metals);
        groupsCollection.push(nonmetals);
        groupsCollection.push(others);

        callback(groupsCollection);
    });
}

function subGroupMatchesElementType(subGroup) {
    return subGroup.subGroupName === this.type;
}

module.exports = new DataSourceAdapter();
