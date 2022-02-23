const fs = require('fs')

module.exports = {
    reading: function(path) {
        const folders = []; 
        const files = [];
        const content = fs.readdirSync(path);
        content.forEach(recurso => {
            if (fs.lstatSync(path + recurso).isDirectory()) folders.push(recurso);
            else files.push(recurso);
        });
        return [folders, files];
    },

    pathChanger: function(path, query) {
        return path + query + '/';
    },

    error: function(error) {
        console.log(error);
        return true;
    }
}