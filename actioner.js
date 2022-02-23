module.exports = {
    reading: async function(path) {
        const folders = []; 
        const files = [];
        const content = await fs.readdirSync(fullPath);
        content.forEach(recurso => {
            if (fs.lstatSync(fullPath + recurso).isDirectory()) folders.push(recurso);
            else files.push(recurso);
        });
        return folders, files
    }
}