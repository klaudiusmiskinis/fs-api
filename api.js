/* Imports */
require("dotenv").config();

const methodOverride = require("method-override");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const { extended, method } = require("./config");
const {
  download,
  upload,
  login,
  purge,
  bulk,
  getAllByPath,
  getAllFiles,
  setLastVersion,
  remove,
  recover,
} = require("./controllers/actioner");

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* GETs */
app.get("/", getAllByPath);
app.get("/download", download);
app.get("/getAllFiles", getAllFiles);

/* POSTs */
app.post("/", upload);
app.post("/login", login);
app.post("/purge", purge);
app.post("/bulk", bulk);
app.post("/recover", recover);
app.post("/lastversion", setLastVersion);

/* DELETEs */
app.delete("/", remove);

/* LISTEN */
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log("API Desplegada:", `http://localhost:${process.env.PORT}`);
});
