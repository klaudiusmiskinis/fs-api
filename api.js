const express = require('express');
const app = express();
const fs = require('fs');
const path = process.env.PATHTOFOLDER;

app.get('/', (req, res) => {
    let fullPath = path;
    if (req.query.path) fullPath = path + req.query.path + '/';
    console.log(fullPath)
    const content = fs.readdirSync(fullPath);
    const folders = []
    const files = []

    content.forEach(recurso => {
        const comprobacionDirectorio = fs.lstatSync(fullPath + recurso).isDirectory();
        if (comprobacionDirectorio) folders.push(recurso);
        else files.push(recurso);
    })
    res.json({
        path: req.query.path,
        folders: folders,
        files: files,
    });
});

app.listen(process.env.PORT_APP || 3001, () => {
    console.log('APP deployed in PORT :3001');
});