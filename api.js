/* Imports */
require('dotenv').config();
const express = require('express');
const fileupload = require("express-fileupload");
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = process.env.PATHTOFOLDER; 

/* Configuration */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors())

/* HTTP Methods */
app.get('/', (req, res) => {
    let fullPath = path;
    if (req.query.path) fullPath = path + req.query.path + '/';
    fullPath = decodeURI(fullPath);
    fullPath = fullPath.split('%20').join(' ')
    const content = fs.readdirSync(fullPath);
    const folders = [];
    const files = [];

    content.forEach(recurso => {
        const comprobacionDirectorio = fs.lstatSync(fullPath + recurso).isDirectory();
        if (comprobacionDirectorio) folders.push(recurso);
        else files.push(recurso);
    });
    res.json({
        path: req.query.path,
        folders: folders,
        files: files,
    });
});

app.post('/', async (req, res) => {
    let fullPath = path;
    if (req.query.path) fullPath = path + req.query.path + '/';
    fullPath = decodeURI(fullPath);
    fullPath = fullPath.split('%20').join(' ')
    try {
        await req.files.file.mv(fullPath + req.files.file.name)
    } catch (error) {
        return error;
    }
    res.json({
        success: true,
        message: "Uploaded Correctly"
    });
    res.end();
})

app.delete('/', (req, res) => {
    let filePath = path;
    if (req.query.path) filePath = filePath + req.query.path + '/';
    if (req.query.file) filePath = filePath + req.query.file;
    console.log('filePath:', filePath)
    try {
        fs.unlinkSync(filePath)
    } catch(error) {
        res.json({ok: false})
    };
    res.json({
        success: true,
        message: "Deleted succesfully",
    });
    res.end();
})

app.listen(process.env.PORT, () => {
    console.log('API Desplegada:', `http://localhost:3001`);
});