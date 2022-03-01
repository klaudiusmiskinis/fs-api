/* Imports */
require('dotenv').config();
const { extended, method, failed } = require('./config');
const { getFoldersAndFiles, makeRecursive, status, download, check, deleteItems, upload } = require('./actioner');
const fileupload = require("express-fileupload");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* HTTP Methods */
app.get('/', getFoldersAndFiles);

app.get('/recursive', makeRecursive);

app.get('/download', download);

app.get('/status', status);

app.get('/check', check);


/**
 * POST to /login
 */
app.post('/login', (req, res) => {
    console.log('login', req.body);
})

/*
* POST to /
* This HTTP method does multiple general like upload, create and rename functions. 
* If there is a file in the request, it save it in the path we sent.
* Queries = path - updateName - folder - edit - to
*/
app.post('/', upload);

app.delete('/', deleteItems);

app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log('API Desplegada:', `http://localhost:${process.env.PORT}`);
});