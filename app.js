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
