const { File } = require("../helpers/initialize");

module.exports = {
  getAll,
  getFile,
  create,
  update,
  bulked,
  truncate,
  getRecursiveDown,
  getRecursiveUp,
  delete: _delete,
};

async function getAll() {
  return await File.findAll();
}

async function truncate() {
  await File.destroy({ truncate: true });
}

async function create(attributes) {
  const file = new File(attributes);
  await file.save();
}

async function bulked(files) {
  if (!files) throw "Files empty or without data";
  if (files.length < 1) throw "Files empty";
  await File.bulkCreate(files, {
    ignoreDuplicates: true,
  }).then(() => console.log("Files data have been inserted"));
}

async function update(attributes, conditions) {
  const file = await getFile(conditions);
  await file.update(attributes);
  if (!file) throw "File not found";
}

async function _delete(conditions) {
  const file = await getFile(conditions);
  if (!file) throw "File not found";
  await file.destroy();
}

async function getFile(conditions) {
  const file = await File.findOne({ where: conditions });
  if (!file) throw "File not found";
  return file;
}

async function getRecursiveDown(conditions) {
  let file;
  const files = [];
  do {
    if (!conditions) throw "You must provide an id condition";
    file = await getFile(conditions);
    if (!file) throw "File not found";
    files.push(file.dataValues);
    conditions.id = file.dataValues.idParent;
  } while (file.dataValues.idParent);
  return files;
}

async function getRecursiveUp(conditions) {
  let file;
  const files = [];
  do {
    if (!conditions) throw "You must provide an idParent condition";
    try {
      file = await getFile(conditions);
      if (!file) throw "File not found";
      files.push(file.dataValues);
      conditions.idParent = file.dataValues.id;
    } catch {
      file.dataValues.id = null;
    }
  } while (file.dataValues.id);
  return files;
}
