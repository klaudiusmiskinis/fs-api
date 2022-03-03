const fs = require("fs");
const Items = require("./class/items");
const { failed } = require("./config");
const { generateToken } = require("./jwt");
const { insertArchivos, purgeTable } = require("./sql");
const { reading, pathChanger, isEmpty, getRecursive, getToday } = require("./helpers");

module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.makeRecursive = makeRecursive;
module.exports.deleteItems = deleteItems;
module.exports.insertAll = insertAll;
module.exports.download = download;
module.exports.status = status;
module.exports.upload = upload;
module.exports.check = check;
module.exports.login = login;
module.exports.purge = purge;
/**
 *
 * @param req
 * @param res
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
 * @param req
 * @param res
 */
async function makeRecursive(req, res) {
  const allFiles = [];
  const allFolder = [];
  try {
    const time = new Date();
    items = new Items(allFiles, allFolder);
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
    files: items.files,
    folder: items.folders,
  });
  res.end();
}

/**
 *
 * @param req
 * @param res
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
 *
 * @param req
 * @param res
 */
async function deleteItems(req, res) {
  console.log(req.query);
  let fullPath = process.env.PATHTOFOLDER;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  try {
    if (req.query.file) {
      fullPath = fullPath + "/" + req.query.file;
      await fs.unlinkSync(fullPath);
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

/**
 *
 * @param req
 * @param res
 */
function download(req, res) {
  let fullPath = process.env.PATHTOFOLDER;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  res.download(fullPath + req.query.download);
  res.end();
}

async function upload(req, res) {
  console.log(req.query, req.files);
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
      await req.files.file.mv(fullPath + req.files.file.name);
    } else if (req.query.folder) {
      fullPath = fullPath + req.query.folder;
      await fs.mkdirSync(fullPath);
    } else if (req.query.edit && req.query.to) {
      await fs.renameSync(fullPath + req.query.edit, fullPath + req.query.to);
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

/**
 *
 * @param req
 * @param res
 */
async function status(req, res) {
  const response = [];
  const user = { name: req.body.user || "test" };
  const token = generateToken(user);
  response.push(token);
  try {
    await insertArchivos();
  } catch (e) {
    console.log(e);
    res.status(200).json(failed);
  }
  res.status(200).json({
    success: true,
    path: req.query.path,
    response: response,
  });
  res.end();
}

async function insertAll(req, res) {
  let result = await getRecursive(process.env.PATHTOFOLDER).then();
  const bulk = [];
  result.files.forEach(file => {
    const filename = file.split('/')[file.split('/').length - 1]
    bulk.push([filename, file.split(filename)[0] || '/' , getToday(), 1])
  })
  console.log(bulk)
}

async function purge(req, res) {
  if (!isEmpty(req.params)) {
    await purgeTable(req.params.table);
    res.json({
      done: true,
      message: "table cleared " + req.params.table,
    });
  } else {
    res.json({
      done: false,
      message: "Table " + req.params.table + " not found",
    });
  }
}

/**
 *
 * @param req
 * @param res
 */
async function login(req, res) {
  console.log(req.body);
  res.status(200).json({
    success: true,
  });
  res.end();
}
