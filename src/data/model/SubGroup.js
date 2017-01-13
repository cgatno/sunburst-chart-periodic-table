'use strict';

/**
 * SubGroup.js
 * 
 * A module for representing the subgroups that further specify element categories and properties
 * 
 */


/**
 * Instantiate a new SubGroup object with the given subGroupname and some empty properties.
 * 
 * @param {string} subGroupName
 */
var SubGroup = function (subGroupName) {
    this.subGroupName = subGroupName;
    this.elements = [];
    this.characteristics = '';
};

module.exports = SubGroup;
