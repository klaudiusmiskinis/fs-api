require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { failed } = require("../config/obj");
const {
  reading,
  pathChanger,
  getRecursive,
  dateToday,
  replaceBackslasWithSlash,
  splitDoubleSlash,
  booleanToNumber,
  isPathValid,
} = require("../helpers/helpers");
const {
  bulked,
  truncate,
  getFile,
  update,
  create,
  getAllWhere,
  getAll,
} = require("../services/file.service");
const {
  deleteFile,
  onlyName,
  pathAndName,
  onlyId,
  onlyLastVersion,
} = require("../helpers/contructors");
const req = require("express/lib/request");
const { Admin } = require("../config/account");

module.exports.getAllByPath = getAllByPath;
module.exports.remove = remove;
module.exports.getAllFiles = getAllFiles;
module.exports.recover = recover;
module.exports.setLastVersion = setLastVersion;
module.exports.upload = upload;
module.exports.bulk = bulk;
module.exports.purge = purge;
module.exports.login = login;
module.exports.download = download;

/**
 * Returns a JSON with a array of folders and files.
 */
async function getAllByPath(req, res) {
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
}

/**
 * Removes an item (file or folder) by name and path. Also updates the table where it is registered to set it to removed.
 */
async function remove(req, res) {
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
}

async function getAllFiles(req, res) {
  res.json(await getAll());
}

async function recover(req, res) {
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
}

async function setLastVersion(req, res) {
  const attributes = {
    isLastVersion: booleanToNumber(req.body.isLastVersion),
  };
  const condition = {
    id: req.body.id,
  };
  await update(attributes, condition);
  res.end();
}

async function upload(req, res) {
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
}

async function bulk(req, res) {
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
  const { body } = req;
  const { username, password } = body;
  const secret = process.env.SECRET_JWT;
  const adminPass = process.env.ADMIN_PASS;
  const adminName = process.env.ADMIN_NAME;
  let isCorrect = false;
  let token = "";
  if (adminName === username) {
    isCorrect = bcrypt.compareSync(password, adminPass);
    token = jwt.sign(Admin, secret, { expiresIn: "7d" });
  }
  res.set("Authorization", "Bearer " + token);

  if (!isCorrect) {
    res.status(200).json({
      token: token,
      success: isCorrect,
    });
  }
  res.status(200).json({
    success: isCorrect,
  });
  res.end();
}

function download(req, res) {
  try {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    const file = fullPath + req.query.download;
    res.download(file);
  } catch (e) {
    console.log(e);
  }
}
