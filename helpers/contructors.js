const { dateToday } = require("./helpers");

module.exports = {
  deleteFile,
  onlyLastVersion,
  pathAndName,
  onlyName,
  onlyId,
};

function onlyName(name) {
  return {
    name: name,
  };
}

function onlyId(id) {
  return {
    id: id,
  };
}

function pathAndName(path, name) {
  if (!path) path = '/'
  return {
    path: path,
    name: name,
  };
}

function deleteFile() {
  return {
    isLastVersion: 0,
    isRemoved: 1,
    removedDate: dateToday(),
  };
}

function onlyLastVersion(isLastVersion) {
  if (typeof(isLastVersion) === "undefined") throw "You must provide a parameter";
  if (typeof(isLastVersion) !== "boolean") throw "You must provide a boolean parameter";
  if (isLastVersion) {
    return {
      isLastVersion: 1,
    };
  } else {
    return {
      isLastVersion: 0,
    };
  }
}