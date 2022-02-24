/* Imports */
require('dotenv').config();
const fileupload = require("express-fileupload");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const wrench = require("wrench");
const { test, selectAllFiles } = require('./sql');
const { extended, method, failed } = require('./config');
const { generateToken } = require('./jwt');
const { reading, getFoldersAndFiles } = require('./actioner');

/* Configuration */
app.use(bodyParser.urlencoded(extended));
app.use(methodOverride(method));
app.use(express.json());
app.use(fileupload());
app.use(cors());

/* HTTP Methods */
app.get('/', getFoldersAndFiles);

app.get('/recursive', async (req, res) => {
    let catchError = false;
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
        await fs.writeFileSync('data/' + time.getTime().toString() + '.json', JSON.stringify(items, null, 4));
        res.end();
    } catch (e) {
        console.log(e)
    }

})

app.get('/status', async (req, res) => {
    let catchError = false;
    const response = []
    try {
        const user = { name: req.body.user || 'test' }
        const token = generateToken(user)
        response.push(token)
        await test().then(rows => response.push(rows));
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
            response: response
        });
        res.end();
    };
})

app.get('/check', (req, res) => {
    let catchError = false;
    const response = []
    try {
        const files = fs.readdirSync(__dirname + '/data');
        const filesWithoutExtension = [];
        files.forEach(item => {
            filesWithoutExtension.push(item.split('.')[0]);
        });
        const maxDate = new Date(Math.max.apply(null, filesWithoutExtension));
        const lastFile = {
            file: maxDate.getTime() + '.json'
        }
        res.json(lastFile)
    } catch (error) {
        console.log('Error', error);
        catchError = true;
    };
});

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