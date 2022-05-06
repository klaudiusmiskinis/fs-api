const fs = require("fs");
const wrench = require("wrench");

module.exports.replaceBackslasWithSlash = replaceBackslasWithSlash;
module.exports.booleanToNumber = booleanToNumber;
module.exports.isPathValid = isPathValid;
module.exports.reading = reading;
module.exports.pathChanger = pathChanger;
module.exports.isEmpty = isEmpty;
module.exports.getRecursive = getRecursive;
module.exports.dateToday = dateToday;
module.exports.setDateToName = setDateToName;
module.exports.splitDoubleSlash = splitDoubleSlash;
module.exports.latestJsonFile = latestJsonFile;
module.exports.replaceBackslasWithSlash = replaceBackslasWithSlash;
module.exports.splitBearer = splitBearer;

function booleanToNumber(boolean) {
  if (boolean) return 1;
  else return 0;
}

function isPathValid(path) {
  if (path) return path + "/";
  else return "/";
}

/**
 * Reads recursive a folder and returns an array with 2 items containing folders and files.
 * @param path
 * @returns
 */
function reading(path) {
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
}

/**
 * Adds a query to the path and end with a slash.
 * @param path
 * @param query
 * @returns
 */
function pathChanger(path, query) {
  return path + query + "/";
}

/**
 * Checks if the object is empty {}.
 * @param obj
 * @returns
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Reads recursive folder and object with folders and files.
 * @param path
 * @returns
 */
async function getRecursive(path) {
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
}

/**
 * Returns todays date.
 * @returns date
 */
function dateToday() {
  const today = new Date();
  return today.toISOString();
}

/**
 * Transforms a date into a string with .json appended.
 * @param {*} date
 * @returns string
 */
function setDateToName(date) {
  return "data/" + date.getTime().toString() + ".json";
}

/**
 * Replaces double slashes for a single one.
 * @param {*} string
 * @returns string
 */
function splitDoubleSlash(string) {
  return string.split("//").join("/");
}

/**
 * Returns an object with file attribute with the file name.
 * @param {*} date
 * @returns object
 */
function latestJsonFile(date) {
  return {
    file: date + ".json",
  };
}

function replaceBackslasWithSlash(string) {
  return string.split(/\\/g).join("/");
}

function splitBearer(auth) {
  return auth.split("Bearer ")[auth.split("Bearer ").length - 1];
}
