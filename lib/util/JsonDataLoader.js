'use strict';
/**
 * json_data_loader.js
 * 
 * Exposes a module, jsonDataLoader, that provides utility methods for loading JSON from a file
 * (either on the local file system or from a remote source) into a JavaScript object.
 * 
 * Note that I'm writing all of the core components of this project myself so that it can be used for
 * educational purposes. If you're looking for a more packaged and possibly more efficient solution to this specific
 * task, I recommend that you check out:
 * 
 *  - https://www.npmjs.com/package/json-loader
 * 
 */

var JsonDataLoader = function () {};

function readFileContents(filePath, callback) {
    let reqClient = new XMLHttpRequest();
    reqClient.onload = callback;
    reqClient.open("get", filePath, true);
    reqClient.send();
}

JsonDataLoader.prototype.getObjectFromJson = function (jsonFilePath, callback) {
    readFileContents(jsonFilePath, function (eventArgs) {
        callback(JSON.parse(this.responseText));
    });
};

module.exports = new JsonDataLoader();
