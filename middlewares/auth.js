require("dotenv").config();
const jwt = require("jsonwebtoken");
const { splitBearer } = require("../helpers/helpers");

module.exports.auth = function auth(req, res, next) {
  const auth = req.headers["authorization"];
  const token = splitBearer(auth)
  if (token) {
    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
      if (err) {
        return res.json({ success: false });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
    });
  }
};
