const siteMaps = require('sitemap-stream-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const urls = [
    'https://st.kostyumdedamoroza.ru/9/2628/927/sitemap-carriers.xml',
    'https://st.kostyumdedamoroza.ru/9/2628/926/sitemap-states.xml',
    'https://st.kostyumdedamoroza.ru/11/2630/553/sitemap-make-models.xml',
    'https://st.kostyumdedamoroza.ru/11/2630/551/sitemap-insurance-guide.xml',
    'https://st.kostyumdedamoroza.ru/11/2630/552/sitemap-cities.xml',
    'https://st.kostyumdedamoroza.ru/11/2630/554/sitemap-keyword-launcher.xml',
    'https://st.kostyumdedamoroza.ru/11/2630/550/sitemap-carrier-comparisons.xml',

];

const vksUrls = [
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap1.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap10.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap11.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap12.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap13.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap14.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap15.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap16.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap17.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap18.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap19.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap2.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap20.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap21.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap22.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap23.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap24.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap25.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap26.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap27.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap28.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap29.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap3.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap30.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap31.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap32.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap33.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap34.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap35.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap4.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap5.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap6.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap7.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap8.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemap9.xml',
    'https://www.vkostume.ru/Vkostume/uploads/sitemaps/sitemapindex.xml',
];

//smartfinancial.com

const smartfinancialUrls = [
    'https://smartfinancial.com/page-sitemap.xml',
    'https://smartfinancial.com/blog-sitemap.xml',
    'https://smartfinancial.com/insurance-company-sitemap.xml',
    'https://smartfinancial.com/average-rates-sitemap.xml',
    'https://smartfinancial.com/vehicles-sitemap.xml',
];

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

    async parse(urls, prefix = ''){
        try{
            await this.parseMultipleURLs(urls);
            await this.saveToCSV(prefix);
        }catch (e) {
            console.log(e);
        }finally {
            console.log('Скрипт выполнен');
        }

    }
}

const Parser = new SitemapParser();
// Parser.setUrls(urls);
// Parser.parseMultipleURLs(urls);
Parser.parse(smartfinancialUrls, 'smartfinancial');
