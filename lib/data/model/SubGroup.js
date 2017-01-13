/**
 * SubGroup.js
 *
 * A module for representing the subgroups that further specify element categories and properties
 *
 */


/**
 * Initialize a new SubGroup object with the given subGroupname and some empty properties.
 *
 * @param {string} subGroupName
 */
const SubGroup = function _subGroup(subGroupName) {
  this.subGroupName = subGroupName;
  this.elements = [];
  this.characteristics = '';
};

module.exports = SubGroup;
