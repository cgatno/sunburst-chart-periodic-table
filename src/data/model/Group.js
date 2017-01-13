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
