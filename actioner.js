const fs = require('fs')
module.exports.getFoldersAndFiles = getFoldersAndFiles;
module.exports.pathChanger = pathChanger;
module.exports.reading = reading;
module.exports.error = error;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getFoldersAndFiles(req, res) {
    let fullPath = process.env.PATHTOFOLDER;
    let catchError = false;
    let result;
    if (req.query.path) fullPath = pathChanger(fullPath, req.query.path);
    try {
        result = reading(fullPath);
    } catch(error) {
        catchError = error(error);
    };
    if (catchError) {
        res.status(200).json(failed);
    } else if (!catchError) {
        res.status(200).json({
            success: true,
            path: req.query.path,
            folders: result[0],
            files: result[1]
        });
        res.end();
    };
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
function reading(path) {
    const folders = []; 
    const files = [];
    const content = fs.readdirSync(path);
    content.forEach(recurso => {
        if (fs.lstatSync(path + recurso).isDirectory()) folders.push(recurso);
        else files.push(recurso);
    });
    return [folders, files];
}

/**
 * 
 * @param {*} path 
 * @param {*} query 
 * @returns 
 */
function pathChanger(path, query) {
    return path + query + '/';
}

/**
 * 
 * @param {*} error 
 * @returns 
 */
function error(error) {
    console.log(error);
    return true;
}