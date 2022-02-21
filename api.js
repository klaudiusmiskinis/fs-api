/* Imports */
require('dotenv').config();
const fileupload = require("express-fileupload");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const crypto = require('crypto');
const wrench = require("wrench");
const { test, selectAllFiles } = require('./sql');
const { generarToken } = require('./jwt');
const { extended, method, failed } = require('./config');
const { query } = require('express');

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* HTTP Methods */
app.get('/', (req, res) => {
    let fullPath = process.env.PATHTOFOLDER;
    let catchError = false;
    let content = ''; 
    let folders = []; 
    let files = [];
    if (req.query.path) fullPath = fullPath + req.query.path + '/';
    try {
        fullPath = decodeURI(fullPath);
        fullPath = fullPath.split('%20').join(' ')
        content = fs.readdirSync(fullPath);
        content.forEach(recurso => {
            if (fs.lstatSync(fullPath + recurso).isDirectory()) folders.push(recurso);
            else files.push(recurso);
        });
    } catch(error) {
        console.log('Error', error)
        catchError = true;
    };
    if (catchError) {
        res.status(200).json(failed);
    } else if (!catchError) {
        res.status(200).json({
            success: true,
            path: req.query.path,
            folders: folders,
            files: files
        });
        res.end();
    };
});

app.get('/all', async (req, res) => {
    try {
        const all = await wrench.readdirSyncRecursive(process.env.PATHTOFOLDER);
        const allFiles = [];
        const allFolder = [];
        all.forEach(item => {
            if (fs.lstatSync(process.env.PATHTOFOLDER + item).isFile()) {
                item = item.split(/\\/g).join('/');
                allFiles.push(item);
            } else if (fs.lstatSync(process.env.PATHTOFOLDER + item).isDirectory()) {
                item = item = item.split(/\\/g).join('/');
                allFolder.push(item);
            }
        })
        const time = new Date();
        const items = {
            files: allFiles,
            folders: allFolder
        }
        fs.writeFileSync('data/' + time.getTime().toString() + '.json', JSON.stringify(items, null, 4));
        res.end();
    } catch (e) {
        console.log(e)
    }

})

app.get('/admin/status', async (req, res) => {
    try {
        const response = []
        const user = { name: req.body.user || 'test' }
        const token = generarToken(user)
        response.push(token)
        await test().then(rows => response.push(rows));
        res.json(response);
    } catch (error) {
        console.log('Error', error)
        catchError = true;
    };

    if (catchError) {
        res.status(200).json(failed);
    } else if (!catchError) {
        res.status(200).json({
            success: true,
            path: req.query.path,
            folders: folders,
            files: files
        });
        res.end();
    };
})

/*
* POST to /login
*/
app.post('/login', (req, res) => {
    console.log('login', req.body);
})

app.get('/download', (req, res) => {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = fullPath + req.query.path + '/';
    res.download(fullPath + req.query.download);
});

/*
* POST to /
* This HTTP method does multiple general like upload, create and rename functions. 
* If there is a file in the request, it save it in the path we sent.
* Queries = path - updateName - folder - edit - to
*/
app.post('/', async (req, res) => {
    console.log(req.query, req.files)
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = fullPath + req.query.path + '/';
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
            fullPath = decodeURI(fullPath);
            fullPath = fullPath.split('%20').join(' ');
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

app.delete('/', async (req, res) => {
    console.log(req.query);
    let fullPath = process.env.PATHTOFOLDER;
    let catchError = false;
    if (req.query.path) fullPath = fullPath + req.query.path;
    try {
        if (req.query.file) {
            fullPath = fullPath + '/' + req.query.file;
            await fs.unlinkSync(fullPath);
        } else if (req.query.folder) {
            fullPath = fullPath + '/' + req.query.folder;
            if (fullPath.includes('//')) fullPath = fullPath.split('//').join('/');
            await fs.rmSync(fullPath, { recursive: true, force: true });
        };
    } catch(error) {
        console.log('Error', error);
        catchError = true;
    };
    if (catchError) {
        res.status(200).json(failed);
    } else if (!catchError){
        res.status(200).json({
            success: true,
        });
    };
    res.end();
});

app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log('API Desplegada:', `http://localhost:${process.env.PORT}`);
});