'use strict';
/**
 * PropertiesTile.js
 * 
 * Provides some helper methods for handling Sunburst Chart events and generating the "property tiles"
 * dynamically based on chart selections.
 * 
 */

// Pull in dependencies
var Element = require('../data/model/Element');
var SubGroup = require('../data/model/SubGroup');
var Group = require('../data/model/Group');

var PropertiesTile = function (propertiesTileDomElement) {
    this.domElement = propertiesTileDomElement;

    this.centerInParent();
};

PropertiesTile.prototype.centerInParent = function () {
    let tile = this.domElement;
    let parentElement = tile.parentElement;

    tile.style.top = (parentElement.offsetHeight / 2) - (tile.offsetHeight / 2) + 'px';
    tile.style.left = (parentElement.offsetWidth / 2) - (tile.offsetWidth / 2) + 'px';
};

PropertiesTile.prototype.show = function () {
    let tile = this.domElement;
    tile.style.visibility = 'visible';
};

PropertiesTile.prototype.hide = function () {
    let tile = this.domElement;
    tile.style.visibility = 'hidden';
};

const NEW_LINE_DELIM = '<br>';

PropertiesTile.prototype.showInfoPanel = function (infoObject) {
    if (typeof (infoObject) === 'undefined') { // this will happen when the user clicks "randomly" on the page - hide the tile
        this.hide();
    } else { // the user selected something on the chart, display the appropriate info
        let groupInfoPane = document.getElementById('group-info');
        let elementInfoPane = document.getElementById('element-info');
        let subGroupInfoPane = document.getElementById('subGroup-info');
        // Hide all of the panes initially
        groupInfoPane.style.display = 'none';
        subGroupInfoPane.style.display = 'none';
        elementInfoPane.style.display = 'none';
        if (infoObject instanceof Group) {
            document.getElementById('group-name').innerText = infoObject.groupName;
            document.getElementById('subgroup-listing').innerHTML = '';
            for (let i = 0; i < infoObject.subGroups.length; i++) {
                document.getElementById('subgroup-listing').innerHTML += infoObject.subGroups[i].subGroupName;
                document.getElementById('subgroup-listing').innerHTML += ' ';
                document.getElementById('subgroup-listing').innerHTML += '(' + infoObject.subGroups[i].elements.length + ')';
                document.getElementById('subgroup-listing').innerHTML += NEW_LINE_DELIM;
            }
            groupInfoPane.style.display = 'block';
        } else if (infoObject instanceof SubGroup) {
            document.getElementById('subGroup-name').innerText = infoObject.subGroupName;
            document.getElementById('num-elements').innerText = infoObject.elements.length;
            document.getElementById('characteristic-listing').innerHTML = '';
            let characteristicsArray = infoObject.characteristics.split(',');
            for (let i = 0; i < characteristicsArray.length; i++) {
                document.getElementById('characteristic-listing').innerHTML += characteristicsArray[i];
                document.getElementById('characteristic-listing').innerHTML += NEW_LINE_DELIM;
            }
            subGroupInfoPane.style.display = 'block';
        } else if (infoObject instanceof Element) {
            document.getElementById('element-symbol').innerText = infoObject.eleSymbol;
            document.getElementById('element-name').innerText = infoObject.elementName;
            document.getElementById('atomic-number').innerText = infoObject.atomicNumber;
            document.getElementById('atomic-weight').innerText = Number(infoObject.atomicWeight).toFixed(2);
            elementInfoPane.style.display = 'block';
        }
        this.show();
    }
};

module.exports = PropertiesTile;
