const { db } = require("../helpers/initialize");

module.exports = {
  getAll,
  getById,
  create,
  update,
  bulked,
  truncate,
  delete: _delete,
};

async function getAll() {
  return await db.File.findAll();
}

async function getById(id) {
  return await getFile(id);
}

async function truncate() {
  await db.File.destroy({ truncate: true });
}

async function create(params) {
  if (await db.File.findOne({ where: { email: params.id } })) {
    throw 'Id "' + params.id + '" is already registered';
  }
  const file = new db.File(params);
  await file.save();
}

async function bulked(files) {
  db.File.bulkCreate(files, {
    ignoreDuplicates: true,
  }).then(() => console.log("Files data have been inserted"));
}

async function update(id, params) {
  const file = await getFile(id);

  const usernameChanged = params.id && file.id !== params.id;
  if (
    usernameChanged &&
    (await db.File.findOne({ where: { id: params.id, path: params.path } }))
  ) {
    throw 'File "' + params.id + '" is already taken';
  }

  Object.assign(file, params);
  await file.save();
}

async function _delete(id) {
  const file = await getFile(id);
  if (!file) throw "File not found";
  await file.destroy();
}

async function getFile(id) {
  const file = await db.File.findByPk(id);
  if (!file) throw "File not found";
  return file;
}
