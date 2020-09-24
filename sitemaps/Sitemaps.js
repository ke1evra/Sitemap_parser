const SiteMapFactory = require("./Sitemap") ;
const thezebra = require('./list/zebra');
const vkostume = require("./list/vkostume");
const smartfinancial = require("./list/smartfinancial");
const compare_com = require("./list/compare_com");
const gabi_com = require("./list/gabi_com");


const SiteMaps = new SiteMapFactory();

SiteMaps.add('thezebra', thezebra);
SiteMaps.add('vkostume', vkostume);
SiteMaps.add('smatrfinantial', smartfinancial);
SiteMaps.add('compare_com',compare_com);
SiteMaps.add('gabi_com',gabi_com);

module.exports = SiteMaps;
