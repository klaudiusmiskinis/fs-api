/* Imports */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = process.env.PATHTOFOLDER; 

/* Configuration */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

/* HTTP Methods */
app.get('/', (req, res) => {
    let fullPath = path;
    if (req.query.path) fullPath = path + req.query.path + '/';
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

app.post('/', (req, res) => {
    console.log(req.body);
})

app.listen(process.env.PORT, () => {
    console.log('API Desplegada:', `http://localhost:3001`);
});