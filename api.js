/* Imports */
require("dotenv").config();
const {
  getFoldersAndFiles,
  makeRecursive,
  insertAll,
  check,
  deleteItems,
  upload,
  login,
  purge,
} = require("./actioner");
const methodOverride = require("method-override");
const { extended, method } = require("./config");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* GETs */
app.get("/", getFoldersAndFiles);
app.get("/recursive", makeRecursive);
app.get("/download", (req, res) => {
  let fullPath = process.env.PATHTOFOLDER;
  if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
  res.download(fullPath, req.query.download);
  res.end();
});
app.get("/check", check);

/* POSTs */
app.post("/", upload);
app.post("/login", login);
app.post("/purge/:table", purge);
app.post("/recursive/all", insertAll);

/* DELETEs */
app.delete("/", deleteItems);

/* LISTEN */
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log("API Desplegada:", `http://localhost:${process.env.PORT}`);
});
