require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = process.env.PATHTOFOLDER;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log(req.files);
    console.log(req.query.path);
})

app.listen(process.env.PORT_APP || 3001, () => {
    console.log('API Desplegada:', `http://localhost:3001`);
});