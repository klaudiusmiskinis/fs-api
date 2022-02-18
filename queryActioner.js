class QueryActioner {
    query;
    files;
    action;

    constructor(query, files, action) {
        this.query = query;
        this.files = files;
        this.action = action;
    }

    getQuery(){
        return this.query;
    }

    getFiles() {
        return this.files;
    }

    getAction(){
        return this.action;
    }

    setQuery(query) {
        this.query = query;
    }

    setFiles(files) {
        this.files = files;
    }

    setAction(action) {
        this.action = action;
    }

    async actionAuto(action, body, files = null) {
        switch (action) {
            case 'create':
                if (files) {
                    await files.file.mv(process.env.PATHTOFOLDER + files.file.name);
                } else if (body) {

                }
            case 'delete':
                if (body) {
                    
                }
            case 'edit':
                if (body) {

                }
            default:
                break;
        }
    }
}