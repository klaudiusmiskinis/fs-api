/* Imports */
require('dotenv').config();
const { extended, method, failed } = require('./config');
const { getFoldersAndFiles, makeRecursive, status, download, check } = require('./actioner');
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
app.post('/', async (req, res) => {
    console.log(req.query, req.files)
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path)
    let catchError = false;
    try {
        if (req.files) {
            fullPath = decodeURI(fullPath);
            fullPath = fullPath.split('%20').join(' ')
            if (req.query.updateName) {
                req.files.file.name = (req.query.updateName + '.' + req.files.file.name.split('.')[req.files.file.name.split('.').length - 1]);
            }
            await req.files.file.mv(fullPath + req.files.file.name)
        } else if (req.query.folder) {
            fullPath = fullPath + req.query.folder;
            await fs.mkdirSync(fullPath);
        } else if (req.query.edit && req.query.to) {
            await fs.renameSync(fullPath + req.query.edit, fullPath + req.query.to);
        } 
    } catch(error) {
        console.log('Error', error)
        catchError = true;
    };
    if (catchError) {
        res.status(200).json(failed);
    } else if (!catchError) {
        res.status(200).json({
            success: true,
        });
    };
    res.end();
});

app.delete('/', );

app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log('API Desplegada:', `http://localhost:${process.env.PORT}`);
});