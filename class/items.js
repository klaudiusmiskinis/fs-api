class Items {
    constructor(files, folders) {
        this.files = files;
        this.folders = folders;
    }

    removeFile(fileToRemove) {
        return this.files.filter(file !== fileToRemove);
    }

    removeFolder(folderToRemove) {
        return this.folders.filter(folder !== folderToRemove);
    }

    onlyFiles() {
        return this.files;
    }

    onlyFolders() {
        return this.folders;
    }

    avoid(filesToAvoid, folderToAvoid) {
        this.files = this.files.filter();
        const avoidedFiles = this.files.filter(file => !filesToAvoid.includes(file));
    }
}