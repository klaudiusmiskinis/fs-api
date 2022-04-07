const fs = require("fs");
const {
  isEmpty,
  reading,
  pathChanger,
  getRecursive,
  dateToday,
} = require("../helpers/helpers");
const { failed } = require("../config/obj");
const {
  bulked,
  truncate,
  getFile,
  update,
  create,
} = require("../services/file.service");
const {
  deleteFile,
  onlyName,
  pathAndName,
  setDateToName,
  splitDoubleSlash,
} = require("../helpers/contructors");
const Items = require("../models/items");

module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.makeRecursive = makeRecursive;
module.exports.deleteItems = deleteItems;
module.exports.insertAll = insertAll;
module.exports.download = download;
module.exports.upload = upload;
module.exports.check = check;
module.exports.login = login;
module.exports.purge = purge;

/**
 * Return the lastest file
 */
function check(req, res) {
  const filesWithoutExtension = [];
  let files = [];
  try {
    files = fs.readdirSync(__dirname + "/data");
  } catch (e) {
    res.status(200).json(failed);
    res.end();
  }
  files.forEach((item) => {
    filesWithoutExtension.push(item.split(".")[0]);
  });
  const maxDate = new Date(Math.max.apply(null, filesWithoutExtension));
  res.status(200).json(latestJsonFile(maxDate.getTime()));
  res.end();
}

async function makeRecursive(req, res) {
  let result = await getRecursive(process.env.PATHTOFOLDER);
  try {
    const time = new Date();
    const items = new Items(result.files, result.folder);
    await fs.writeFileSync(setDateToName(time), JSON.stringify(items, null, 4));
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
    res.end();
  }
  res.status(200).json({
    success: true,
    files: result.files,
    folder: result.folders,
  });
  res.end();
}

/**
 * Returns a JSON with a array of folders and files.
 */
function getFoldersAndFiles(req, res) {
  let fullPath = process.env.PATHTOFOLDER;
  let result;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  try {
    result = reading(fullPath);
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
    res.end();
  }
  res.status(200).json({
    success: true,
    path: req.query.path,
    folders: result.folders,
    files: result.files,
  });
  res.end();
}

/**
 * Removes an item (file or folder) by name and path. Also updates the table where it is registered to set it to removed.
 */
async function deleteItems(req, res) {
  const query = req.query;
  let fullPath = process.env.PATHTOFOLDER;
  if (query.path) fullPath = pathChanger(fullPath, query.path);
  try {
    if (query.file) {
      fullPath = fullPath + "/" + query.file;
      await fs.unlinkSync(fullPath);
      const params = pathAndName(query.path, query.file);
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
}

async function upload(req, res) {
  const query = req.query;
  const files = req.files;
  console.log("Upload", query, files);
  let fullPath = process.env.PATHTOFOLDER;
  if (query.path) fullPath = pathChanger(fullPath, query.path);
  try {
    if (files) {
      if (query.updateName) {
        files.file.name =
          query.updateName +
          "." +
          files.file.name.split(".")[files.file.name.split(".").length - 1];
      }
      if (query.fileRelated && query.fileRelated != "null") {
        const params = pathAndName(query.path, query.fileRelated);
        const file = await getFile(params);
        const attributes = onlyLastVersion(false);
        const conditions = onlyId(file.dataValues.id);
        await update(attributes, conditions);
        if (query.reason) {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
            idParent: file.dataValues.id,
            createdDate: dateToday(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
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
            path: query.path || "/",
            createdDate: dateToday(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
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
      const params = pathAndName(query.path, query.edit);
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
}

async function insertAll(req, res) {
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
}

async function purge(req, res) {
  await truncate();
  res.status(200).json({
    success: true,
    message: "table cleared " + req.params.table,
  });
}

async function login(req, res) {
  console.log(req.body);
  res.status(200).json({
    success: true,
  });
  res.end();
}

function download(req, res) {
  try {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    const file = fullPath + req.query.download;
    res.download(file);
  } catch (error) {
    console.log(error);
  }
}
