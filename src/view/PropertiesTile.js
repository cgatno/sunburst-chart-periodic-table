/**
 * PropertiesTile.js
 *
 * Provides some helper methods for handling Sunburst Chart events and generating the
 * "property tiles" dynamically based on chart selections.
 *
 */

/**
 * Initializes a PropertiesTile Object to handle the DOM functions, events and layouts of an
 * element that will display the properties
 *
 * @param {Object} propertiesTileDomElement - the DOM element to initialize as the properties tile
 */
const PropertiesTile = function _PropertiesTile() {
  this.propertiesTileDomElement = undefined;
  this.NEW_LINE_DELIM = '<br>';
};

PropertiesTile.prototype.attachToDom = function _attachToDom(element) {
  this.propertiesTileDomElement = element;
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
 * Initializes an info panel for the provided Group, SubGroup or Element object then shows the
 * properties grid and info panel
 *
 * @param {Object} infoObject a Group, SubGroup or Element object
 */
PropertiesTile.prototype.showInfoPanel = function _showInfoPanel(infoObject) {
  if (!this.propertiesTileDomElement) {
    return;
  }
  if (typeof (infoObject) === 'undefined') { // this will happen when the user clicks "randomly" on the page - hide the tile
    this.hide();
  } else { // the user selected something on the chart, display the appropriate info
    const groupInfoPane = document.getElementById('group-info');
    const elementInfoPane = document.getElementById('element-info');
    const subGroupInfoPane = document.getElementById('subGroup-info');
    // Hide all of the panes initially
    groupInfoPane.style.display = 'none';
    subGroupInfoPane.style.display = 'none';
    elementInfoPane.style.display = 'none';
    if (infoObject.groups && infoObject.groups.length > 0) { // infoObject is a Group
      // Save the subGroup-listing element in a variable since we use it a lot
      const subGroupListing = document.getElementById('subGroup-listing');
      document.getElementById('group-name').innerText = infoObject.name;
      subGroupListing.innerHTML = '';
      // Show all SubGroups and the number of elements in each
      for (let i = 0; i < infoObject.groups.length; i += 1) {
        subGroupListing.innerHTML += infoObject.groups[i].name;
        subGroupListing.innerHTML += ' ';
        subGroupListing.innerHTML += `(${infoObject.groups[i].items.length})`;
        subGroupListing.innerHTML += this.NEW_LINE_DELIM;
      }
      groupInfoPane.style.display = 'block'; // show the group info pane
    } else if (infoObject.items) {
      // infoObject is a SubGroup so show the number of elements and properties
      document.getElementById('subGroup-name').innerText = infoObject.name;
      document.getElementById('num-elements').innerText = infoObject.items.length;
      // Save the characteristic-listing element in a variable since we use it a lot
      const characteristicListing = document.getElementById('characteristic-listing');
      characteristicListing.innerHTML = '';
      // Split the characteristics up so we can display them as a list
      const characteristicsArray = infoObject.elementProperties.split(',');
      for (let i = 0; i < characteristicsArray.length; i += 1) {
        characteristicListing.innerHTML += characteristicsArray[i];
        characteristicListing.innerHTML += this.NEW_LINE_DELIM;
      }
      subGroupInfoPane.style.display = 'block'; // show the subGroup info pane
    } else { // the infoObject is an Element, display its props
      document.getElementById('element-symbol').innerText = infoObject.symbol;
      document.getElementById('element-name').innerText = infoObject.element;
      document.getElementById('atomic-number').innerText = infoObject['atomic-number'];
      document.getElementById('atomic-weight').innerText = Number(infoObject['atomic-weight']).toFixed(2);
      elementInfoPane.style.display = 'block'; // show element info pane
    }

    // Center properties tile in the parent then show it
    this.centerInParent();
    this.show();
  }
};

module.exports = PropertiesTile;
