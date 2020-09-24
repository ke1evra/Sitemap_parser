const siteMaps = require('sitemap-stream-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const SiteMaps = require('./sitemaps/Sitemaps.js');

class SitemapParser {
    constructor() {
        this.urls = null;
    }

    setUrls(urls){
        this.urls = urls;
        this.getNames();
        console.log('names', this.names);
    }

    getNameFromUrl(url){
        // console.log('url:', url);
        const regExp = /(?<=\/)[a-zA-Z0-9-_]+(?=.xml)/;
        return url.match(regExp)[0];
    }

    getNames(){
        if(!this.urls){
            throw 'URLs are not provided, use setUrls method';
        }
        return this.names = this.urls.reduce((acc, url)=>{
            const siteMapName = this.getNameFromUrl(url);
            acc.push(siteMapName);
            return acc;
        },[]);
    }

    parseURL(siteMapUrl){
        const all_urls = [];
        const name = this.getNameFromUrl(siteMapUrl);
        const formatToCSVWriter = function (url) {
            return {
                url,
            }
        };
        return new Promise((resolve,reject)=>{
            siteMaps.parseSitemaps(siteMapUrl, function(url) { all_urls.push(formatToCSVWriter(url)); }, function(err) {
                if(err)
                    reject(err);
                const result = {
                    name,
                    urls: all_urls,
                };
                resolve(result);
            });
        });
    }

    parseMultipleURLs(urls){
        const result = [];
        const promises = [];
        if(!Array.isArray(urls)){
            promises.push(this.parseURL(urls));
            promises[0]
                .then((data)=>{
                    result.push(data)
                })
                .catch(e => console.log(e));
        }else{
            for(let i = 0; i < urls.length; i++){
                promises[i] = this.parseURL(urls[i]);
                promises[i].then((data)=>{
                    result.push(data);
                }).catch(e => console.log(e));
            }
        }
        return Promise.all(promises).then(()=>{
            // console.log(result);
            this.parsedData = result;
            return this;
        }).catch((e)=>{
            console.log(e);
        })
    }

    saveToCSV(prefix = ''){
        console.log('Сохраняем...');
        const savePromises = [];
        const csvWriters = [];
        for(let i = 0; i <this.parsedData.length; i++){
            csvWriters.push(
                createCsvWriter({
                    path: `./out/${prefix}_${this.parsedData[i].name}.csv`,
                    header: [
                        {id: 'url', title: 'URL'},
                    ]
                })
            );
            savePromises.push(
                csvWriters[i].writeRecords(this.parsedData[i].urls)
                    .then(() => console.log(`${this.parsedData[i].name} - успех!`))
                    .catch(e => console.log(e))
            )
        }
        return Promise.all(savePromises)
            .then(()=> console.log('Все файлы сохранены!'))
            .catch(e => console.log(e));

    }

    async parse(name){
        const urls = SiteMaps.list[name].urls;
        try{
            await this.parseMultipleURLs(urls);
            await this.saveToCSV(name);
        }catch (e) {
            console.log(e);
        }finally {
            console.log('Скрипт выполнен');
        }

    }
}

module.exports = SitemapParser;

