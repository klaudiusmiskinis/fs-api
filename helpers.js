const fs = require("fs");

module.exports.reading = reading;
module.exports.pathChanger = pathChanger;
module.exports;
/**
 * Reads recursive a folder and returns an array with 2 items containing folders and files
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
  return [folders, files];
}

/**
 * Adds a query to the path and end with a slash
 * @param path
 * @param query
 * @returns
 */
function pathChanger(path, query) {
  return path + query + "/";
}
