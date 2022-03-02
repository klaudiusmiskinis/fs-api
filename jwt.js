require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.generateToken = function (data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "18000s" });
};

module.exports.decodeToken = function (token) {
  return jwt.decode(token);
};
