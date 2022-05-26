require("dotenv").config();
const jwt = require("jsonwebtoken");
const { splitBearer } = require("../helpers/helpers");

/**
 * Checks authorization and returns errors or lets it pass
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.auth = function auth(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.json({
      success: false,
      reason: "Authorization from client doesn't exist",
    });
  }
  const token = splitBearer(auth);
  if (token) {
    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
      if (err) {
        return res.json({ success: false, reason: err.message });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
      reason: "Token not found",
    });
  }
};
