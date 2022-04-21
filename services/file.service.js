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
  getAllWhere,
  delete: _delete,
};

/**
 * Makes a select query to get all the rows.
 */
async function getAll() {
  return await File.findAll();
}

/**
 * Makes a select query to get all the rows by condition given.
 * @param {*} conditions
 * @returns
 */
async function getAllWhere(conditions) {
  return await File.findAll({ where: conditions });
}

/**
 * Makes a truncate query to the table to remove it.
 */
async function truncate() {
  await File.destroy({ truncate: true });
}

/**
 * Makes an insert query to the database.
 * @param {*} attributes
 */
async function create(attributes) {
  const file = new File(attributes);
  await file.save();
}

/**
 * Makes a massive insert of all files and folders to the database.
 * @param {*} files
 */
async function bulked(files) {
  if (!files) throw "Files empty or without data";
  if (files.length < 1) throw "Files empty";
  await File.bulkCreate(files, {
    ignoreDuplicates: true,
  });
}

/**
 * Makes an update query to the database dinamically with given conditions.
 * @param {*} conditions
 */
async function update(attributes, conditions) {
  const file = await getFile(conditions);
  await file.update(attributes);
  if (!file) throw "File not found";
}

/**
 * Makes a delete query to the database dinamically with given conditions.
 * @param {*} conditions
 */
async function _delete(conditions) {
  const file = await getFile(conditions);
  if (!file) throw "File not found";
  await file.destroy();
}

/**
 * Makes a select query to the database dinamically with given conditions.
 * @param {*} conditions
 * @returns Object
 */
async function getFile(conditions) {
  const file = await File.findOne({ where: conditions });
  if (!file) throw "File not found";
  return file;
}

/**
 * Check and returns files from database going downwards which have as id the idParent given in parameter.
 * @param {*} conditions
 * @returns Array
 */
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

/**
 * Returns and array of files from database going upwards which have as idParent the id given in parameter.
 * @param {*} conditions
 * @returns Array
 */
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
