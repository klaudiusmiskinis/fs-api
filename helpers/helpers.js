const fs = require("fs");
const wrench = require("wrench");

module.exports.isEmpty = isEmpty;
module.exports.reading = reading;
module.exports.pathChanger = pathChanger;
module.exports.getRecursive = getRecursive;
module.exports.dateToday = dateToday;

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
      item = item.split(/\\/g).join("/");
      files.push(item);
    } else if (fs.lstatSync(process.env.PATHTOFOLDER + item).isDirectory()) {
      item = item = item.split(/\\/g).join("/");
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
