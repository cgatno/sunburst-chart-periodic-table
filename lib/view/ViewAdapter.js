'use strict';
/**
 * ViewAdapter.js
 * 
 * Provides some helper methods for handling Sunburst Chart events and generating the "property tiles"
 * dynamically based on chart selections.
 * 
 */

// Pull in dependencies
var Element = require('../data/model/Element');
var SubGroup = require('../data/model/SubGroup');
var Group = require('../data/model/Group');

var ViewAdapter = function () {};

ViewAdapter.prototype.mapChartNameToObject = function (chartItemName, chartCollectionView) {
    let chartGroups = chartCollectionView.items; // grab the array of Group objects from the chart
    return findObjectWithMatchingName(chartGroups, chartItemName);
};

function findObjectWithMatchingName(haystack, needle) {
    // We should be entering this method with the haystack being an array of Groups, SubGroups, or Elements
    // We have to loop through the array and, depending on the type of object, check to see if it's what
    // we're looking for
    for (let i = 0; i < haystack.length; i++) {
        let currentObject = haystack[i];
        if (currentObject instanceof Group) { // we have a Group
            if (currentObject.groupName === needle) {
                return currentObject;
            } else {
                let subSearch = findObjectWithMatchingName(currentObject.subGroups, needle);
                if (typeof (subSearch) !== 'undefined') {
                    return subSearch;
                }
            }
        } else if (currentObject instanceof SubGroup) { // we have a SubGroup
            if (currentObject.subGroupName === needle) {
                return currentObject;
            } else {
                let subSearch = findObjectWithMatchingName(currentObject.elements, needle);
                if (typeof (subSearch) !== 'undefined') {
                    return subSearch;
                }
            }
        } else { // must be an Element
            if (currentObject.eleSymbol === needle) return currentObject;
        }
    }
}

module.exports = new ViewAdapter();
