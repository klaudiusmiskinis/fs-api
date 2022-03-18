const fs = require("fs");
const Items = require("./class/items");
const { failed } = require("./config");
const {
  insertArchivos,
  purgeTable,
  rename,
  newFile,
  updateDelete,
} = require("./sql");
const {
  isEmpty,
  reading,
  pathChanger,
  getRecursive,
  iso,
} = require("./helpers");

module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.makeRecursive = makeRecursive;
module.exports.deleteItems = deleteItems;
module.exports.insertAll = insertAll;
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
 *
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

async function deleteItems(req, res) {
  console.log(req.query);
  let fullPath = process.env.PATHTOFOLDER;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  try {
    if (req.query.file) {
      fullPath = fullPath + "/" + req.query.file;
      let file = await selectByPathAndName(
        req.query.path | "/",
        req.query.file
      );
      file = file.shift();
      await fs.unlinkSync(fullPath);
      await updateDelete(iso(), file.idArchivo);
    } else if (req.query.folder) {
      fullPath = fullPath + "/" + req.query.folder;
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
  console.log("Upload", req.query, req.files);
  let fullPath = process.env.PATHTOFOLDER;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  try {
    if (req.files) {
      fullPath = decodeURI(fullPath);
      fullPath = fullPath.split("%20").join(" ");
      if (req.query.updateName) {
        req.files.file.name =
          req.query.updateName +
          "." +
          req.files.file.name.split(".")[
            req.files.file.name.split(".").length - 1
          ];
      }
      if (req.query.fileRelated) {
        let file = await selectByPathAndName(
          req.query.path || "/",
          req.query.fileRelated
        );
        file = file.shift();
        await ultimaVersionToZero(file.idArchivo);
        await newFileWithFather([req.files.file.name, req.query.path || "/", file.idArchivo, iso(), 1]);
      } else {
        await newFile([req.files.file.name, req.query.path || "/", iso(), 1]);
      }
      await req.files.file.mv(fullPath + req.files.file.name);
    } else if (req.query.folder) {
      fullPath = fullPath + req.query.folder;
      await fs.mkdirSync(fullPath);
    } else if (req.query.edit && req.query.to) {
      let file = await selectByPathAndName(
        req.query.path || "/",
        req.query.edit
      );
      file = file.shift();
      await rename(file.idArchivo, req.query.to);
      await fs.renameSync(fullPath + req.query.edit, fullPath + req.query.to);
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
    bulk.push([filename, file.split(filename)[0] || "/", iso(), 1]);
  });
  await insertArchivos(bulk);
  res.json({
    success: true,
    message: "Bulked insert in table archivos",
  });
}

async function purge(req, res) {
  if (!isEmpty(req.params)) {
    await purgeTable(req.params.table);
    res.status(200).json({
      success: true,
      message: "table cleared " + req.params.table,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Table " + req.params.table + " not found",
    });
  }
}

async function login(req, res) {
  console.log(req.body);
  res.status(200).json({
    success: true,
  });
  res.end();
}
