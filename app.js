'use strict';
var DataSourceAdapter = require('./lib/data/DAL/DataSourceAdapter');

// Hook up plain old DOM event handlers
let domSunburst = document.getElementById('periodic-sunburst');
if (domSunburst.addEventListener) { // all browsers except IE before version 9
    domSunburst.addEventListener("click", sunburstClicked, false);
} else {
    if (domSunburst.attachEvent) { // IE before version 9
        domSunburst.attachEvent("click", sunburstClicked);
    }
}

// Declare the sunburst object in the global scope so we can reference it in
// event handlers, etc.
let mySunburst;
DataSourceAdapter.getChartDataSource(function (dataArray) {
    mySunburst = new wijmo.chart.hierarchical.Sunburst('#periodic-sunburst');
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

    mySunburst.endUpdate();

    console.log('Sunburst chart initialized:');
    console.log(mySunburst);
});

function sunburstClicked(event) {
    let mouseX = event.clientX, mouseY = event.clientY;
    let hitTestInfo = mySunburst.hitTest(mouseX, mouseY);
    console.log('Gathered HitTestInfo for click:');
    console.log(hitTestInfo);
}
