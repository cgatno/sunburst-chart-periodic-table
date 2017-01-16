/**
 * ViewAdapter.js
 *
 * Provides some helper methods for handling Sunburst Chart events and generating the
 * "property tiles" dynamically based on chart selections.
 *
 */

// Pull in dependencies
const SubGroup = require('../data/model/SubGroup');
const Group = require('../data/model/Group');

const ViewAdapter = function _ViewAdapter() {};

/**
 * An internal function that recursively searches through the chart's object collection for an
 * object with a name that matches the search term
 *
 * @param {Array} haystack an array of Objects to search through. In this case, this should be the
 * root items array from a the Sunburst chart's collectionView
 * @param {string} needle a search term to look for in the object collection. This should be a panel
 * data label/name from the chart
 * @returns {Object} a Group, SubGroup or Element if the lookup succeeds
 */
function findObjectWithMatchingName(haystack, needle) {
  // We should be entering this method with the haystack being an array of Groups, SubGroups, or
  // Elements. We have to loop through the array and, depending on the type of object, check to see
  // if it's what we're looking for
  for (let i = 0; i < haystack.length; i += 1) {
    const currentObject = haystack[i];
    if (currentObject instanceof Group) { // we have a Group
      if (currentObject.groupName === needle) {
        return currentObject;
      }
      const subSearch = findObjectWithMatchingName(currentObject.subGroups, needle);
      if (typeof (subSearch) !== 'undefined') {
        return subSearch;
      }
    } else if (currentObject instanceof SubGroup) { // we have a SubGroup
      if (currentObject.subGroupName === needle) {
        return currentObject;
      }
      const subSearch = findObjectWithMatchingName(currentObject.elements, needle);
      if (typeof (subSearch) !== 'undefined') {
        return subSearch;
      }
    } else if (currentObject.eleSymbol === needle) { // must be an Element
      return currentObject;
    } else {
      return null;
    }
  }
  return false;
}

/**
 * Gets an object associated with a panel on the Sunburst chart by looking up the data label/name
 * for that panel
 *
 * @param {string} chartItemName the data label/name of a chart panel
 * @param {Object} chartCollectionView the chart's collectionView object
 * @returns {Object} a Group, SubGroup or Element object found by looking up the chartItemName
 */
ViewAdapter.prototype.getObjectFromChartName = function _getObjectFromChartName(chartItemName,
  chartCollectionView) {
  const chartGroups = chartCollectionView.items; // grab the array of Group objects from the chart
  return findObjectWithMatchingName(chartGroups, chartItemName);
};


module.exports = new ViewAdapter();
