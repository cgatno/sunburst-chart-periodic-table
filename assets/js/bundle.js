(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var DataSourceAdapter = require('./lib/data/DAL/DataSourceAdapter');
var ViewAdapter = require('./lib/view/ViewAdapter');
var PropertiesTile = require('./lib/view/PropertiesTile');

// Declare the sunburst object in the global scope so we can reference it in
// event handlers, etc.
DataSourceAdapter.getChartDataSource(function (dataArray) {
    // Initialize the property tile by loading it into its module
    let myPropTile = new PropertiesTile(document.getElementById('properties-tile'));
    window.onresize = function () {
        myPropTile.centerInParent();
    };

    let mySunburst = new wijmo.chart.hierarchical.Sunburst('#periodic-sunburst');
    // Let the Sunburst Chart know we're going to start making changes
    mySunburst.beginUpdate();

    // Set some stylistic properties for the chart
    mySunburst.legend.position = 'None';
    mySunburst.innerRadius = 0.3;
    mySunburst.selectionMode = 'Point';
    mySunburst.dataLabel.position = 'Center';
    mySunburst.dataLabel.content = '{name}';

    mySunburst.itemsSource = dataArray;
    mySunburst.binding = 'value';
    mySunburst.bindingName = ['groupName', 'subGroupName', 'eleSymbol'];
    mySunburst.childItemsPath = ['subGroups', 'elements'];

    mySunburst.hostElement.addEventListener('click', function (e) {
        let ht = mySunburst.hitTest(e.pageX, e.pageY);
        myPropTile.showInfoPanel(ViewAdapter.mapChartNameToObject(ht.name, mySunburst.collectionView));
    });

    mySunburst.endUpdate();

    console.log('Sunburst chart initialized:');
    console.log(mySunburst);
});

},{"./lib/data/DAL/DataSourceAdapter":2,"./lib/view/PropertiesTile":7,"./lib/view/ViewAdapter":8}],2:[function(require,module,exports){
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
const metalTypes = 'Alkali Metal|Alkaline Earth Metal|Transition Metal|Lanthanide|Actinide|Metal'.split('|');
const nonmetalTypes = 'Noble Gas|Halogen|Nonmetal'.split('|');
const otherTypes = 'Metalloid|Transactinide'.split('|');

// These are all ordered by the type lists above
// The metal and nonmetal descriptions have one extra item for the "Others" category
const metalTypeDescriptions = 'Shiny,Soft,Highly Reactive,Low Melting Point|Ductile,Malleable,Low Density,High Melting Point|High Melting Point,High Density|Soluble,Highly Reactive|Radioactive,Paramagnetic|Brittle,Poor Metals,Low Melting Point'.split('|');
const nonMetalTypeDescriptions = 'Toxic,Highly Reactive,Poor Conductors|Colorless,Odorless,Low Chemical Reactivity|Volatile,Low Elasticity,Good Insulators'.split('|');
const otherTypeDescriptions = 'Metallic looking solids,Semiconductors|Radioactive,Synthetic Elements'.split('|');

DataSourceAdapter.prototype.getChartDataSource = function (callback) {
    let groupsCollection = []; // declare an empty array to add the finished groups to - this is what we will ultimately send as a payload

    let metals = new Group('Metals');
    // Add all of the metals subGroups
    for (let i = 0; i < metalTypes.length; i++) {
        if (metalTypes[i] === 'Metal') {
            metals.subGroups.push(new SubGroup('Other Metals'));
        } else {
            metals.subGroups.push(new SubGroup(metalTypes[i]));
        }
        metals.subGroups[i].characteristics = metalTypeDescriptions[i];
    }

    let nonmetals = new Group('Nonmetals');
    // Add all of the nonmetal subGroups
    for (let i = 0; i < nonmetalTypes.length; i++) {
        if (nonmetalTypes[i] === 'Nonmetal') {
            nonmetals.subGroups.push(new SubGroup('Other Nonmetals'));
        } else {
            nonmetals.subGroups.push(new SubGroup(nonmetalTypes[i]));
        }
        nonmetals.subGroups[i].characteristics = nonMetalTypeDescriptions[i];
    }

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
            // If the SubGroup wasn't defined above then we need to use the array's find method in conjunction with
            // our custom function to locate the SubGroup that matches the element's type
            if (typeof (currentSubGroup) === 'undefined') currentSubGroup = currentGroup.subGroups.find(subGroupMatchesElementType, currentElement);
            currentSubGroup.elements.push(currentElement);
        }

        groupsCollection.push(metals);
        groupsCollection.push(nonmetals);
        groupsCollection.push(others);

        callback(groupsCollection);
    });
}

/**
 * A function designed to be used with the array.find() method to search for a SubGroup that matches a given element
 * 
 * @param {Object} subGroup - the SubGroup object to compare an element's type to
 * @returns true for a match and false for no match
 */
function subGroupMatchesElementType(subGroup) {
    return subGroup.subGroupName === this.type;
}

module.exports = new DataSourceAdapter();

},{"../../util/JsonDataLoader":6,"../model/Element":3,"../model/Group":4,"../model/SubGroup":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

/**
 * Group.js
 * 
 * A module for representing the major groups that categorize elements
 * 
 */


/**
 * Instantiate a new Group object with the given groupName and an empty subGroups array.
 * 
 * @param {string} groupName
 */
var Group = function (groupName) {
    this.groupName = groupName;
    this.subGroups = [];
};

module.exports = Group;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';
/**
 * JsonDataLoader.js
 * 
 * Exposes a module, JsonDataLoader, that provides utility methods for loading JSON from a file
 * (either on the local file system or from a remote source) into a JavaScript object.
 * 
 * Note that I'm writing all of the core components of this project myself so that it can be used for
 * educational purposes. If you're looking for a more packaged and possibly more efficient solution to this specific
 * task, I recommend that you check out:
 * 
 *  - https://www.npmjs.com/package/json-loader
 * 
 */

/* Define JSDoc callback types */

/**
 * This is a readFileCallback for returning file contents as a string.
 *
 * @callback readFileCallback
 * @param {string} fileContents - the file contents read from the specified file
 */

/**
 * This is a loadObjectCallback for returning an object parsed out from JSON
 *
 * @callback loadObjectCallback
 * @param {Object} jsonObject - the JavaScript object parsed from the specified JSON file
 */

var JsonDataLoader = function () {};

/**
 * This is a privately scoped function to read a local or remote file's text contents and return them as a payload to a 
 * callback function.
 * 
 * @param {string} filePath - a relative or absolute local path or a remote URL to the file to read
 * @param {readFileCallback} callback - a callback function that is passed the file contents as a string upon success
 */
function readFileContents(filePath, callback) {
    let reqClient = new XMLHttpRequest();
    reqClient.onload = callback;
    reqClient.open("get", filePath, true);
    reqClient.send();
}

/**
 * Loads a JSON file and parses its contents into a new JavaScript object
 * 
 * @param {string} jsonFilePath - a relative or absolute local path or a remote URL to the file to read 
 * @param {loadObjectCallback} callback - a function that is passed the parsed JSON as a JavaScript object upon loading
 */
JsonDataLoader.prototype.getObjectFromJson = function (jsonFilePath, callback) {
    readFileContents(jsonFilePath, function (eventArgs) {
        callback(JSON.parse(this.responseText));
    });
};

module.exports = new JsonDataLoader();

},{}],7:[function(require,module,exports){
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
        this.centerInParent();
        this.show();
    }
};

module.exports = PropertiesTile;

},{"../data/model/Element":3,"../data/model/Group":4,"../data/model/SubGroup":5}],8:[function(require,module,exports){
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

},{"../data/model/Element":3,"../data/model/Group":4,"../data/model/SubGroup":5}]},{},[1]);
