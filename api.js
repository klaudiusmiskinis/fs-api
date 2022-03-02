/* Imports */
require('dotenv').config();
const { getFoldersAndFiles, makeRecursive, status, download, check, deleteItems, upload } = require('./actioner');
const methodOverride = require('method-override');
const { extended, method } = require('./config');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/**
 * GETs
 */
app.get('/', getFoldersAndFiles);
app.get('/recursive', makeRecursive);
app.get('/download', download);
app.get('/status', status);
app.get('/check', check);

/**
 * POSTs
 */
app.post('/', upload);
app.post('/login', (req, res) => {
    console.log('login', req.body);
})

/**
 * DELETEs
 */
app.delete('/', deleteItems);

/**
 * LISTEN
 */
app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log('API Desplegada:', `http://localhost:${process.env.PORT}`);
});