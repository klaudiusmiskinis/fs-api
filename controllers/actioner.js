require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const converter = require("docx-pdf");
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
  splitBearer,
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
module.exports.downloadPDF = downloadPDF;
module.exports.isAuthenticated = isAuthenticated;
module.exports.getPersons = getPersons;
module.exports.updateTable = updateTable;
module.exports.addPerson = addPerson;

/**
 * Returns a JSON with a array of folders and files.
 * @param {*} req
 * @param {*} res
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
    res.json(failed);
    res.end();
  }
  res.json({
    success: true,
    path: path,
    folders: result.folders,
    files: tempFiles,
  });
  res.end();
}

/**
 * Removes an item (file or folder) by name and path. Also updates the table where it is registered to set it to removed.
 * @param {*} req
 * @param {*} res
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
    res.json(failed);
    res.end();
  }
  res.json({
    success: true,
  });
  res.end();
}

/**
 * Manages a request with body object and makes differente tweaks in database.
 * @param {*} req
 * @param {*} res
 */
async function updateTable(req, res) {
  const newChanges = req.body.new;
  const oldChanges = req.body.old;
  if (newChanges.isRemoved && !newChanges.removedDate)
    newChanges.removedDate = dateToday();
  if (!newChanges.updateDate) newChanges.updateDate = dateToday();
  await update(newChanges, req.body.where);
  if (newChanges.name) {
    let fullPath = process.env.PATHTOFOLDER;
    if (oldChanges.path) fullPath = pathChanger(fullPath, oldChanges.path);
    fullPath = splitDoubleSlash(fullPath);
    await fs.renameSync(fullPath + oldChanges.name, fullPath + newChanges.name);
  }
  res.json({
    success: true,
  });
}

/**
 * Returns all files for the admin path
 * @param {*} req
 * @param {*} res
 */
async function getAllFiles(req, res) {
  res.json(await getAll());
}

/**
 * Makes a recover from database with the id of the file
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Sets last version to 1 or 0 depends on user input
 * @param {*} req
 * @param {*} res
 */
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

/**
 * General function for update a file/make a directory or rename related to files.
 * @param {*} req
 * @param {*} res
 */
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
        const newFile = {
          name: files.file.name,
          path: isPathValid(query.path),
          idParent: file.dataValues.id,
          createdDate: dateToday(),
          isLastVersion: 1,
          author: query.author,
          updateDate: dateToday(),
        };
        if (query.reason) newFile.reason = query.reason;
        await create(newFile);
      } else {
        const newFile = {
          name: files.file.name,
          path: isPathValid(query.path),
          createdDate: dateToday(),
          isLastVersion: 1,
          author: query.author,
          updateDate: dateToday(),
        };
        if (query.reason) newFile.reason = query.reason;
        await create(newFile);
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
    res.json({
      success: true,
    });
    res.end();
  } catch (e) {
    console.log(e);
    res.json(failed);
    res.end();
  }
}

/**
 * Makes a massive bulk insert into database
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Purges database rows and cleans.
 * @param {*} req
 * @param {*} res
 */
async function purge(req, res) {
  await truncate();
  res.json({
    success: true,
    message: "table cleared " + req.params.table,
  });
}

/**
 * Manages user input to check if has access to Admin Account
 * @param {*} req
 * @param {*} res
 */
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
    res.set("Authorization", "Bearer " + token);
  }
  if (isCorrect) {
    res.json({
      token: token,
      success: isCorrect,
    });
  } else {
    res.json({
      success: isCorrect,
    });
  }
  res.end();
}

/**
 * Makes it possible to user to download files.
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Makes it possible to user to download as PDF
 * @param {*} req
 * @param {*} res
 */
function downloadPDF(req, res) {
  try {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    const file = fullPath + req.query.download;
    const fileDotPDF = req.query.download.split(".")[0] + ".pdf";
    converter(file, "./converted/" + fileDotPDF, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
      res.download(result.filename);
      setTimeout(function () {
        fs.rmSync("./converted/" + fileDotPDF);
      }, 3000);
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 * Adds a new person to the persons.json
 * @param {*} req
 * @param {*} res
 */
function addPerson(req, res) {
  const persons = require("../persons.json");
  const person = {
    name: req.body.name,
    lastname: req.body.lastname,
    dni: req.body.dni,
  };
  persons.push(person);
  fs.writeFile(
    "./persons.json",
    JSON.stringify(persons, null, 4),
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );
  res.json({
    success: true,
    message: "Person added",
  });
}

/**
 * Retrns all people that exist in persons.json
 * @param {*} req
 * @param {*} res
 */
function getPersons(req, res) {
  if (fs.existsSync("./persons.json")) {
    const persons = require("../persons.json");
    res.json(persons);
  } else {
    res.json({ error: true });
  }
}

/**
 * Checks if user has authorization
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function isAuthenticated(req, res) {
  const auth = req.headers["authorization"];
  if (!auth) return res.json({ isAuthenticated: false });
  const secret = process.env.SECRET_JWT;
  const token = splitBearer(auth);
  if (token) {
    jwt.verify(token, secret, (err) => {
      if (err) {
        return res.json({
          success: false,
          isAuthenticated: false,
          reason: err.message,
        });
      } else {
        return res.json({
          success: true,
          isAuthenticated: true,
        });
      }
    });
  } else {
    res.json({
      success: false,
      isAuthenticated: false,
      reason: "Token not found",
    });
  }
}
