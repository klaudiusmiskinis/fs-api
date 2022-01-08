class QueryActioner {
    query;

    constructor(query) {
        this.query = query;
    }

    getQuery(){
        return this.query;
    }

    setQuery(query) {
        this.query = query;
    }
}

let url = new QueryActioner(
    [
        {data: 'file', datainfo: 'datainfo'},
        {data: 'folder', pacoinfo: 'pacoinfo'}
    ]
)

console.log(url.getQuery())