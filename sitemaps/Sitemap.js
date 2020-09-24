class SiteMap {
    constructor(urls){
        this.urls = urls;
    }
}

class SiteMapFactory {
    constructor(){
        this.list = {};
    }

    add(name, urls){
        this.list[name] = new SiteMap(urls);
    }
}

module.exports = SiteMapFactory;
