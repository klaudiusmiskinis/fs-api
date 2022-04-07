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
  console.log("Select *");
  return await db.File.findAll();
}

async function truncate() {
  console.log("Truncate");
  await db.File.destroy({ truncate: true });
}

async function create(attributes) {
  console.log("Create");
  if (await getFile(attributes)) {
    throw "File already exists";
  }
  console.log(attributes);
  const file = new db.File.create(attributes);
  await file.save();
}

async function bulked(files) {
  console.log("Bulk");

  if (!files) throw "Files empty or without data";
  if (files.length < 1) throw "Files empty";
  await db.File.bulkCreate(files, {
    ignoreDuplicates: true,
  }).then(() => console.log("Files data have been inserted"));
}

async function update(attributes, conditions) {
  console.log("Update");
  const file = await getFile(conditions);
  await file.update(attributes);
  if (!file) throw "File not found";
  return file;
}

async function _delete(conditions) {
  console.log("Delete");
  const file = await getFile(conditions);
  if (!file) throw "File not found";
  await file.destroy();
}

async function getFile(conditions) {
  console.log("Select");
  const file = await db.File.findOne({ where: conditions });
  if (!file) throw "File not found";
  return file;
}
