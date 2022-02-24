const fs = require('fs');

module.exports.reading = reading;
module.exports.pathChanger = pathChanger;

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