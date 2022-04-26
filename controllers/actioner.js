const fs = require("fs");
const { failed } = require("../config/obj");
const {
  reading,
  pathChanger,
  getRecursive,
  dateToday,
  replaceBackslasWithSlash,
  splitDoubleSlash,
} = require("../helpers/helpers");
const {
  bulked,
  truncate,
  getFile,
  update,
  create,
  getAllWhere,
} = require("../services/file.service");
const {
  deleteFile,
  onlyName,
  pathAndName,
  onlyId,
  onlyLastVersion,
} = require("../helpers/contructors");

/**
 * Returns a JSON with a array of folders and files.
 */
module.exports.getAllByPath = async function (req, res) {
  let { path } = req.query;
  let fullPath = process.env.PATHTOFOLDER;
  let result, tempFiles;
  if (!path) path = "/";
  if (path.substr(-1) !== "/") path = path + "/";
  if (path) fullPath = pathChanger(fullPath, path);
  try {
    result = reading(fullPath);
    tempFiles = await getAllWhere({ path: path });
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
    res.end();
  }
  res.status(200).json({
    success: true,
    path: path,
    folders: result.folders,
    files: tempFiles,
  });
  res.end();
};

/**
 * Removes an item (file or folder) by name and path. Also updates the table where it is registered to set it to removed.
 */
module.exports.remove = async function (req, res) {
  const query = req.query;
  let fullPath = process.env.PATHTOFOLDER;
  if (query.path) fullPath = pathChanger(fullPath, query.path);
  try {
    if (query.file) {
      fullPath = fullPath + "/" + query.file;
      fullPath = replaceBackslasWithSlash(fullPath);
      fullPath = splitDoubleSlash(fullPath);
      // await fs.unlinkSync(fullPath);
      const params = pathAndName(isPathValid(query.path), query.file);
      let file = await getFile(params);
      const attributes = deleteFile();
      const conditions = onlyId(file.dataValues.id);
      await update(attributes, conditions);
    } else if (query.folder) {
      fullPath = fullPath + "/" + query.folder;
      fullPath = splitDoubleSlash(fullPath);
      await fs.rmSync(fullPath, { recursive: true, force: true });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
    res.end();
  }
  res.status(200).json({
    success: true,
  });
  res.end();
};

module.exports.getAll = async function(req,res) {
  res.json(await getAll());
}

module.exports.recover = async function (req, res) {
  const attributes = {
    isLastVersion: booleanToNumber(req.body.isLastVersion),
    isRemoved: 0,
    removedDate: null,
  };
  const condition = {
    id: req.body.id,
  };
  await update(attributes, condition);
  res.end();
};

module.exports.setLastVersion = async function(req, res) {
  const attributes = {
    isLastVersion: booleanToNumber(req.body.isLastVersion),
  };
  const condition = {
    id: req.body.id,
  };
  await update(attributes, condition);
  res.end();
}

module.exports.upload = async function (req, res) {
  const query = req.query;
  const files = req.files;
  let fullPath = process.env.PATHTOFOLDER;
  if (query.path) fullPath = pathChanger(fullPath, query.path);
  try {
    if (files) {
      if (query.updateName) {
        const fileNameQuery =
          files.file.name.split(".")[files.file.name.split(".").length - 1];
        files.file.name = query.updateName + "." + fileNameQuery;
      }
      if (query.fileRelated && query.fileRelated != "null") {
        const params = pathAndName(isPathValid(query.path), query.fileRelated);
        const file = await getFile(params);
        const attributes = onlyLastVersion(false);
        const conditions = onlyId(file.dataValues.id);
        await update(attributes, conditions);
        if (query.reason) {
          const newFile = {
            name: files.file.name,
            path: isPathValid(query.path),
            idParent: file.dataValues.id,
            createdDate: dateToday(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: isPathValid(query.path),
            idParent: file.dataValues.id,
            createdDate: dateToday(),
            isLastVersion: 1,
          };
          await create(newFile);
        }
      } else {
        if (query.reason) {
          const newFile = {
            name: files.file.name,
            path: isPathValid(query.path),
            createdDate: dateToday(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: isPathValid(query.path),
            createdDate: dateToday(),
            isLastVersion: 1,
          };
          await create(newFile);
        }
      }
      await files.file.mv(fullPath + files.file.name);
    } else if (query.folder) {
      fullPath = fullPath + query.folder;
      await fs.mkdirSync(fullPath);
    } else if (query.edit && query.to) {
      const params = pathAndName(isPathValid(query.path), query.edit);
      const file = await getFile(params);
      const attributes = onlyName(query.to);
      const conditions = onlyId(file.dataValues.id);
      await update(attributes, conditions);
      await fs.renameSync(fullPath + query.edit, fullPath + query.to);
    }
    res.status(200).json({
      success: true,
    });
    res.end();
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
    res.end();
  }
};

module.exports.bulk = async function (req, res) {
  let result = await getRecursive(process.env.PATHTOFOLDER).then();
  const bulk = [];
  result.files.forEach((file) => {
    const filename = file.split("/")[file.split("/").length - 1];
    const bulkFile = {
      name: filename,
      path: file.split(filename)[0] || "/",
      createdDate: dateToday(),
      isLastVersion: 1,
    };
    bulk.push(bulkFile);
  });
  await bulked(bulk);
  res.json({
    success: true,
    message: "Bulked insert in table archivos",
  });
};

module.exports.purge = async function (req, res) {
  await truncate();
  res.status(200).json({
    success: true,
    message: "table cleared " + req.params.table,
  });
};

module.exports.login = async function (req, res) {
  console.log(req.body);
  res.status(200).json({
    success: true,
  });
  res.end();
};



module.exports.download = function (req, res) {
  try {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    const file = fullPath + req.query.download;
    res.download(file);
  } catch (e) {
    console.log(e);
  }
};

function booleanToNumber(boolean) {
  if (boolean) return 1;
  else return 0;
}

function isPathValid(path) {
  if (path) return path + "/";
  else return "/";
}
