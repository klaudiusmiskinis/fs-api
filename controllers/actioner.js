const fs = require("fs");
const Items = require("../models/items");
// insertBulkedFiles,
// truncateTable,
// updateName,
// newFile,
// updateDelete,
// insertFileWithParenAndtReason,

const {
  isEmpty,
  reading,
  pathChanger,
  getRecursive,
  iso,
} = require("../helpers");
const { failed } = require("../config/obj");
const {
  bulked,
  truncate,
  getFile,
  update,
  create,
} = require("../services/file.service");

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
  const obj = {
    file: maxDate.getTime() + ".json",
  };
  res.status(200).json(obj);
  res.end();
}

/**
 *
 */
async function makeRecursive(req, res) {
  let result = await getRecursive(process.env.PATHTOFOLDER);
  try {
    const time = new Date();
    const items = new Items(result.files, result.folder);
    await fs.writeFileSync(
      "data/" + time.getTime().toString() + ".json",
      JSON.stringify(items, null, 4)
    );
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
  console.log(query);
  let fullPath = process.env.PATHTOFOLDER;
  if (query.path) fullPath = pathChanger(fullPath, query.path);
  try {
    if (query.file) {
      fullPath = fullPath + "/" + query.file;
      let file = await selectByPathAndName(query.path | "/", query.file);
      console.log(file.dataValues);
      await fs.unlinkSync(fullPath);
      await updateDelete(iso(), file.idArchivo);
    } else if (query.folder) {
      fullPath = fullPath + "/" + query.folder;
      if (fullPath.includes("//")) fullPath = fullPath.split("//").join("/");
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
  const files = files;
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
        const params = {
          path: query.path || "/",
          name: query.fileRelated,
        };
        const file = await getFile(params);
        const attributes = {
          isLastVersion: 0,
        };
        const conditions = {
          id: file.dataValues.id,
        };
        await update(attributes, conditions);
        if (query.reason) {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
            idParent: file.dataValues.id,
            createdDate: iso(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
            idParent: file.dataValues.id,
            createdDate: iso(),
            isLastVersion: 1,
          };
          await create(newFile);
        }
      } else {
        if (query.reason) {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
            createdDate: iso(),
            isLastVersion: 1,
            reason: query.reason,
          };
          await create(newFile);
        } else {
          const newFile = {
            name: files.file.name,
            path: query.path || "/",
            createdDate: iso(),
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
      const params = {
        path: query.path || "/",
        name: query.edit,
      };
      const file = await getFile(params);
      const attributes = {
        name: query.to,
      };
      const conditions = {
        id: file.dataValues.id,
      };
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
  console.log(result.files.length);
  result.files.forEach((file) => {
    const filename = file.split("/")[file.split("/").length - 1];
    const bulkFile = {
      name: filename,
      path: file.split(filename)[0] || "/",
      createdDate: iso(),
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
    res.end();
  } catch (error) {
    console.log(error);
  }
}
