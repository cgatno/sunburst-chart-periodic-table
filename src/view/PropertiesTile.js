/**
 * PropertiesTile.js
 *
 * Provides some helper methods for handling Sunburst Chart events and generating the
 * "property tiles" dynamically based on chart selections.
 *
 */

/**
* Initializes a PropertiesTile Object to handle the DOM functions, events and layouts of an
* element that will display the properties of selected chart objects
*
* @param {Object} propertiesTileDomElement the DOM element to initialize as the properties tile
*/
const PropertiesTile = function _PropertiesTile(element) {
  this.propertiesTileDomElement = element;
  this.NEW_LINE_DELIM = '<br>';

  this.centerInParent();
};

/**
 * Centers the properties tile element in its parent container
 */
PropertiesTile.prototype.centerInParent = function _centerInParent() {
  if (!this.propertiesTileDomElement) { return; }
  const tile = this.propertiesTileDomElement;
  const parentElement = tile.parentElement;

  tile.style.top = `${(parentElement.offsetHeight / 2) - (tile.offsetHeight / 2)}px`;
  tile.style.left = `${(parentElement.offsetWidth / 2) - (tile.offsetWidth / 2)}px`;
};

/**
 * Shows the properties tile element by changing its visibility style
 */
PropertiesTile.prototype.show = function _show() {
  if (!this.propertiesTileDomElement) {
    return;
  }
  const tile = this.propertiesTileDomElement;
  tile.style.visibility = 'visible';
};

/**
 * Hides the properties tile element by changing its visibility style
 */
PropertiesTile.prototype.hide = function _hide() {
  if (!this.propertiesTileDomElement) {
    return;
  }
  const tile = this.propertiesTileDomElement;
  tile.style.visibility = 'hidden';
};

/**
 * Initializes an info panel for the provided chart item (which should be an Object representation
 * of element data)
 *
 * @param {Object} chartItem an Object representation of element data, most likely obtained by
 * calling the Sunburst chart's hitTest method
 */
PropertiesTile.prototype.showInfoPanel = function _showInfoPanel(chartItem) {
  if (!this.propertiesTileDomElement) {
    return;
  }
  if (typeof (chartItem) === 'undefined') { // this will happen when the user clicks "randomly" on the page - hide the tile
    this.hide();
  } else { // the user selected something on the chart, display the appropriate info
    const groupInfoPane = document.getElementById('group-info');
    const elementInfoPane = document.getElementById('element-info');
    const subGroupInfoPane = document.getElementById('subGroup-info');
    // Hide all of the panes initially
    groupInfoPane.style.display = 'none';
    subGroupInfoPane.style.display = 'none';
    elementInfoPane.style.display = 'none';
    if (chartItem.groups && chartItem.groups.length > 0) { // chartItem is a Group
      // Save the subGroup-listing element in a variable since we use it a lot
      const subGroupListing = document.getElementById('subGroup-listing');
      document.getElementById('group-name').innerText = chartItem.name;
      subGroupListing.innerHTML = '';
      // Show all SubGroups and the number of elements in each
      for (let i = 0; i < chartItem.groups.length; i += 1) {
        subGroupListing.innerHTML += chartItem.groups[i].name;
        subGroupListing.innerHTML += ' ';
        subGroupListing.innerHTML += `(${chartItem.groups[i].items.length})`;
        subGroupListing.innerHTML += this.NEW_LINE_DELIM;
      }
      groupInfoPane.style.display = 'block'; // show the group info pane
    } else if (chartItem.items) {
      // chartItem is a SubGroup so show the number of elements and properties
      document.getElementById('subGroup-name').innerText = chartItem.name;
      document.getElementById('num-elements').innerText = chartItem.items.length;
      // Save the characteristic-listing element in a variable since we use it a lot
      const characteristicListing = document.getElementById('characteristic-listing');
      characteristicListing.innerHTML = '';
      // Split the characteristics up so we can display them as a list
      const characteristicsArray = chartItem.elementProperties.split(',');
      for (let i = 0; i < characteristicsArray.length; i += 1) {
        characteristicListing.innerHTML += characteristicsArray[i];
        characteristicListing.innerHTML += this.NEW_LINE_DELIM;
      }
      subGroupInfoPane.style.display = 'block'; // show the subGroup info pane
    } else { // the chartItem is an Element, display its props
      document.getElementById('element-symbol').innerText = chartItem.symbol;
      document.getElementById('element-name').innerText = chartItem.element;
      document.getElementById('atomic-number').innerText = chartItem['atomic-number'];
      document.getElementById('atomic-weight').innerText = Number(chartItem['atomic-weight']).toFixed(2);
      elementInfoPane.style.display = 'block'; // show element info pane
    }

    // Center properties tile in the parent then show it
    this.centerInParent();
    this.show();
  }
};

module.exports = PropertiesTile;
