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
 * @param {string} fileContents the file contents read from the specified file
 */

/**
 * This is a loadObjectCallback for returning an object parsed out from JSON
 *
 * @callback loadObjectCallback
 * @param {Object} jsonObject the JavaScript object parsed from the specified JSON file
 */

var JsonDataLoader = function () {};

/**
 * This is a privately scoped function to read a local or remote file's text contents and return them as a payload to a 
 * callback function.
 * 
 * @param {string} filePath a relative or absolute local path or a remote URL to the file to read
 * @param {readFileCallback} callback a callback function that is passed the file contents as a string upon success
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
 * @param {string} jsonFilePath a relative or absolute local path or a remote URL to the file to read 
 * @param {loadObjectCallback} callback a function that is passed the parsed JSON as a JavaScript object upon loading
 */
JsonDataLoader.prototype.getObjectFromJson = function (jsonFilePath, callback) {
    readFileContents(jsonFilePath, function (eventArgs) {
        callback(JSON.parse(this.responseText));
    });
};

module.exports = new JsonDataLoader();
