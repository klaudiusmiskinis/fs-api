const fs = require('fs');
const wrench = require("wrench");
const Items = require('./class/items');
const { failed } = require('./config');
const { generateToken } = require('./jwt');
const { insertArchivos } = require('./sql');
const { reading, pathChanger } = require('./helpers');

module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.makeRecursive = makeRecursive;
module.exports.deleteItems = deleteItems;
module.exports.download = download;
module.exports.status = status;
module.exports.upload = upload;
module.exports.check = check;

/**
 * 
 * @param req 
 * @param res 
 */
function check(req, res)  {
    const filesWithoutExtension = [];
    let files = [];
    try {
        files = fs.readdirSync(__dirname + '/data');
    } catch(e) {
        res.status(200).json(failed);
        res.end();
    }
    files.forEach(item => {
        filesWithoutExtension.push(item.split('.')[0]);
    });
    const maxDate = new Date(Math.max.apply(null, filesWithoutExtension));
    res.status(200).json(maxDate.getTime() + '.json');
    res.end();
}

/**
 * 
 * @param req 
 * @param res 
 */
async function makeRecursive(req, res) {
    let items = await wrench.readdirSyncRecursive(process.env.PATHTOFOLDER);
    const allFiles = [];
    const allFolder = [];
    items.forEach(item => {
        if (fs.lstatSync(process.env.PATHTOFOLDER + item).isFile()) {
            item = item.split(/\\/g).join('/');
            allFiles.push(item);
        } else if (fs.lstatSync(process.env.PATHTOFOLDER + item).isDirectory()) {
            item = item = item.split(/\\/g).join('/');
            allFolder.push(item);
        }
    })
    try {
        items = new Items(allFiles, allFolder);
        const time = new Date();
        await fs.writeFileSync('data/' + time.getTime().toString() + '.json', JSON.stringify(items, null, 4));
    } catch (e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    }
    res.status(200).json({
        success: true,
        files: items.files,
        folder: items.folders
    });
    res.end();
}

/**
 * 
 * @param req 
 * @param res 
 */
function getFoldersAndFiles(req, res) {
    let fullPath = process.env.PATHTOFOLDER;
    let result;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    try {
        result = reading(fullPath);
    } catch(e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    };
    res.status(200).json({
        success: true,
        path: req.query.path,
        folders: result[0],
        files: result[1]
    });
    res.end();
}

/**
 * 
 * @param req 
 * @param res 
 */
async function deleteItems(req, res) {
    console.log(req.query);
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    try {
        if (req.query.file) {
            fullPath = fullPath + '/' + req.query.file;
            await fs.unlinkSync(fullPath);
        } else if (req.query.folder) {
            fullPath = fullPath + '/' + req.query.folder;
            if (fullPath.includes('//')) fullPath = fullPath.split('//').join('/');
            await fs.rmSync(fullPath, { recursive: true, force: true });
        };
    } catch(e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    };
    res.status(200).json({
        success: true,
    });
    res.end();
}

/**
 * 
 * @param req 
 * @param res 
 */
function download(req, res) {
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    res.download(fullPath + req.query.download);
    res.end();
}


async function upload(req, res) {
    console.log(req.query, req.files)
    let fullPath = process.env.PATHTOFOLDER;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path)
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
    } catch(e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    };
    res.status(200).json({
        success: true,
    });
    res.end();
}

/**
 * 
 * @param req 
 * @param res 
 */
async function status(req, res) {
    const response = []
    const user = { name: req.body.user || 'test' };
    const token = generateToken(user);
    response.push(token);
    try {
        await insertArchivos();
    } catch(e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    };
    res.status(200).json({
        success: true,
        path: req.query.path,
        response: response
    });
    res.end();
}