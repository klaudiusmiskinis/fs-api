module.exports = class Items {
    /**
     * Constructor
     * @param files 
     * @param folders 
     */
    constructor(files, folders) {
        this.files = files;
        this.folders = folders;
    }

    /**
     * Removes a specific file.
     * @param fileToRemove 
     * @returns array
     */
    removeFile(fileToRemove) {
        return this.files.filter(file !== fileToRemove);
    }

    /**
     * Removes a specific folder.
     * @param folderToRemove 
     * @returns array
     */
    removeFolder(folderToRemove) {
        return this.folders.filter(folder !== folderToRemove);
    }

    /**
     * Returns the files.
     * @returns array
     */
    getFiles() {
        return this.files;
    }

    /**
     * Only return the folders.
     * @returns array
     */
    getFolders() {
        return this.folders;
    }

    /**
     * Filters all the files and folders given and then returns the items which are not equal
     * @param filesToAvoid 
     * @param folderToAvoid 
     * @returns object
     */
    avoid(filesToAvoid, folderToAvoid) {
        const avoidedFiles = this.files.filter(file => !filesToAvoid.includes(file));
        const avoidedFolders = this.folders.filter(folder => !folderToAvoid.includes(folder));
        return {
            files: avoidedFiles,
            folders: avoidedFolders
        }
    }
}

