const { db } = require("../helpers/initialize");

module.exports = {
  getAll,
  getFile,
  create,
  update,
  bulked,
  truncate,
  delete: _delete,
};

async function getAll() {
  return await db.File.findAll();
}

async function truncate() {
  await db.File.destroy({ truncate: true });
}

async function create(attributes) {
  if (await getFile(attributes)) {
    throw "File already exists";
  }
  console.log(attributes)
  const file = new db.File(attributes);
  await file.save();
}

async function bulked(files) {
  if (!files) throw "Files empty or without data";
  if (files.length < 1) throw "Files empty";
  await db.File.bulkCreate(files, {
    ignoreDuplicates: true,
  }).then(() => console.log("Files data have been inserted"));
}

async function update(attributes, conditions) {
  const file = await db.File.update(attributes, { where: conditions });
  if (!file) throw "File not found";
}

async function _delete(conditions) {
  const file = await getFile(conditions);
  if (!file) throw "File not found";
  await file.destroy();
}

async function getFile(conditions) {
  const file = db.File.findOne({ where: conditions });
  if (!file) throw "File not found";
  return file;
}
