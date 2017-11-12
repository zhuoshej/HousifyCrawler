const { scrapeFromEntryPoint } = require('./zillowScraper.js');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);

const type = '';
// const zip = 98124;
const { zips } = require('./seattle-zips.json');

(async () => {
  zips.forEach(async (zip) => {
    let url = `https://www.zillow.com/homes/for_sale/${zip}_rb/`;
    if (type === 'sold') {
      url = `https://www.zillow.com/homes/recently_sold/${zip}_rb/12m_days/`;
    }

    await setTimeoutPromise(Math.floor(Math.random() * zips.length * 30 * 1000)).then(async () => {
      console.log(`Start scraping Zip with Entrypoint ====> ${url}`);
      await scrapeFromEntryPoint(url);
      console.log(`Finish scraping Zip with Entrypoint ====> ${url}`);
    });
  });
})().catch(e => console.log(e));
