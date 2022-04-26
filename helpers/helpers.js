const fs = require("fs");
const wrench = require("wrench");

module.exports.booleanToNumber = function (boolean) {
  if (boolean) return 1;
  else return 0;
};

module.exports.isPathValid = function (path) {
  if (path) return path + "/";
  else return "/";
};

/**
 * Reads recursive a folder and returns an array with 2 items containing folders and files.
 * @param path
 * @returns
 */
module.exports.reading = function (path) {
  const folders = [];
  const files = [];
  const content = fs.readdirSync(path);
  content.forEach((recurso) => {
    if (fs.lstatSync(path + recurso).isDirectory()) folders.push(recurso);
    else files.push(recurso);
  });
  return {
    folders: folders,
    files: files,
  };
};

/**
 * Adds a query to the path and end with a slash.
 * @param path
 * @param query
 * @returns
 */
module.exports.pathChanger = function (path, query) {
  return path + query + "/";
};

/**
 * Checks if the object is empty {}.
 * @param obj
 * @returns
 */
module.exports.isEmpty = function (obj) {
  return Object.keys(obj).length === 0;
};

/**
 * Reads recursive folder and object with folders and files.
 * @param path
 * @returns
 */
module.exports.getRecursive = async function (path) {
  const folders = [];
  const files = [];
  let items = await wrench.readdirSyncRecursive(path);
  items.forEach((item) => {
    if (fs.lstatSync(process.env.PATHTOFOLDER + item).isFile()) {
      item = replaceBackslasWithSlash(item);
      files.push(item);
    } else if (fs.lstatSync(process.env.PATHTOFOLDER + item).isDirectory()) {
      item = replaceBackslasWithSlash(item);
      folders.push(item);
    }
  });
  return {
    folders: folders,
    files: files,
  };
};

/**
 * Returns todays date.
 * @returns date
 */
module.exports.dateToday = function () {
  const today = new Date();
  return today.toISOString();
};

/**
 * Transforms a date into a string with .json appended.
 * @param {*} date
 * @returns string
 */
module.exports.setDateToName = function (date) {
  return "data/" + date.getTime().toString() + ".json";
};

/**
 * Replaces double slashes for a single one.
 * @param {*} string
 * @returns string
 */
module.exports.splitDoubleSlash = function (string) {
  return string.split("//").join("/");
};

/**
 * Returns an object with file attribute with the file name.
 * @param {*} date
 * @returns object
 */
module.exports.latestJsonFile = function (date) {
  return {
    file: date + ".json",
  };
};

module.exports.replaceBackslasWithSlash = function (string) {
  return string.split(/\\/g).join("/");
};
