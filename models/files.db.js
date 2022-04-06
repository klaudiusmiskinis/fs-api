const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: DataTypes.SMALLINT(6),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING(80), allowNull: false },
    path: { type: DataTypes.STRING(1024), allowNull: true, defaultValue: "/" },
    idParent: { type: DataTypes.INTEGER(6), allowNull: true },
    isLastVersion: { type: DataTypes.TINYINT(4), allowNull: true },
    createdDate: { type: DataTypes.DATE, allowNull: true },
    isRemoved: { type: DataTypes.TINYINT(4), allowNull: true },
    removedDate: { type: DataTypes.DATE, allowNull: true },
    reason: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "Sin motivos.",
    },
  };

  const options = {
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      withHash: { attributes: {} },
    },
  };

  return sequelize.define("file", attributes, options);
}
