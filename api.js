/* Imports */
require('dotenv').config();
const express = require('express');
const fileupload = require("express-fileupload");
const methodOverride = require('method-override')
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = process.env.PATHTOFOLDER; 

/* Configuration */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.json());
app.use(fileupload());
app.use(cors())

/* HTTP Methods */
app.get('/', (req, res) => {
    let fullPath = path;
    let catchError = false;
    let content, folders, files;
    try {
        if (req.query.path) fullPath = path + req.query.path + '/';
        fullPath = decodeURI(fullPath);
        fullPath = fullPath.split('%20').join(' ')
        content = fs.readdirSync(fullPath);
        folders = [];
        files = [];
    
        content.forEach(recurso => {
            if (fs.lstatSync(fullPath + recurso).isDirectory()) folders.push(recurso);
            else files.push(recurso);
        });
    } catch(error) {
        console.log('Error', error)
        catchError = true;
    };
    if (catchError) {
        res.status(200).json({
            success: false,
        });
    } else if (!catchError){
        res.status(200).json({
            success: true,
            path: req.query.path,
            folders: folders,
            files: files
        });
    };
    res.end();
});

app.post('/', async (req, res) => {
    let fullPath = path;
    let catchError = false;
    if (req.query.path) fullPath = path + req.query.path + '/';
    fullPath = decodeURI(fullPath);
    fullPath = fullPath.split('%20').join(' ')
    try {
        await req.files.file.mv(fullPath + req.files.file.name)
    } catch(error) {
        console.log('Error', error)
        catchError = true;
    }
    if (catchError) {
        res.status(200).json({
            success: false,
        })
    } else if (!catchError){
        res.status(200).json({
            success: true,
        });
    }
    res.end();
})

app.delete('/', (req, res) => {
    let filePath = path;
    let catchError = false;
    if (req.query.path) filePath = filePath + req.query.path + '/';
    if (req.query.file) filePath = filePath + req.query.file;
    try {
        fs.unlinkSync(filePath)
    } catch(error) {
        console.log('Error', error)
        catchError = true;
    }
    if (catchError) {
        res.status(200).json({
            success: false,
        })
    } else if (!catchError){
        res.status(200).json({
            success: true,
        });
    }
    res.end();
})

app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log('API Desplegada:', `http://localhost:3001`);
});