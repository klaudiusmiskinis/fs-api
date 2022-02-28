const fs = require('fs');
const wrench = require("wrench");
const { failed } = require('./config');
const { generateToken } = require('./jwt');
const { reading, pathChanger } = require('./helpers');

module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.makeRecursive = makeRecursive;
module.exports.status = status;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function makeRecursive(req, res) {
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
    const items = new Items(allFiles, allFolder);
    try {
        const time = new Date();
        await fs.writeFileSync('data/' + time.getTime().toString() + '.json', JSON.stringify(items, null, 4));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(200).json(failed);
        res.end();
    }
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
 * @param {*} req 
 * @param {*} res 
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