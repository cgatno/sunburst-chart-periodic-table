/**
 * Group.js
 *
 * A module for representing the major groups that categorize elements
 *
 */


/**
 * Initialize a new Group object with the given groupName and an empty subGroups array.
 *
 * @param {string} groupName
 */
const Group = function _Group(groupName) {
  this.groupName = groupName;
  this.subGroups = [];
};

module.exports = Group;
