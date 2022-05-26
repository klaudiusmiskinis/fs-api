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
  downloadPDF,
  isAuthenticated,
  getPersons,
  updateTable,
  addPerson,
} = require("./controllers/actioner");
const { auth } = require("./middlewares/auth");

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* GETs */
app.get("/", getAllByPath);
app.get("/download", download);
app.get("/download/pdf", downloadPDF);
app.get("/getAllFiles", auth, getAllFiles);
app.get("/isAuthenticated", isAuthenticated);
app.get("/persons", auth, getPersons);

/* POSTs */
app.post("/", auth, upload);
app.post("/login", login);
app.post("/purge", auth, purge);
app.post("/bulk", auth, bulk);
app.post("/recover", auth, recover);
app.post("/update", auth, updateTable);
app.post("/lastversion", auth, setLastVersion);
app.post("/persons", auth, addPerson);

/* DELETEs */
app.delete("/", auth, remove);

/* LISTEN */
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log("API Desplegada:", `http://localhost:${process.env.PORT}`);
});
