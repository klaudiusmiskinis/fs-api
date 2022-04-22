/* Imports */
require("dotenv").config();

const methodOverride = require("method-override");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const { extended, method } = require("./config");
const { getRecursiveUp, getAll } = require("./services/file.service");
const {
  download,
  upload,
  login,
  purge,
  bulkAll,
  getAllByPath,
  remove,
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
app.get("/getAllFiles", async (req, res) => {
  res.json(await getAll());
});
app.get("/test", async (req, res) => {
  const conditions = {
    idParent: 10,
  };
  const files = await getRecursiveUp(conditions);
  console.log(files);
});

/* POSTs */
app.post("/", upload);
app.post("/login", login);
app.post("/purge", purge);
app.post("/bulk", bulkAll);

/* DELETEs */
app.delete("/", remove);

/* LISTEN */
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log("API Desplegada:", `http://localhost:${process.env.PORT}`);
});
