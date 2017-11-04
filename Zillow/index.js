const { scrapeFromEntryPoint } = require('./zillowScraper.js');

const type = 'sold';
const zip = 98121;

(async () => {
  let url = `https://www.zillow.com/homes/for_sale/${zip}_rb/`;
  if (type === 'sold') {
    url = `https://www.zillow.com/homes/recently_sold/${zip}_rb/12m_days/?fromHomePage=true&shouldFireSellPageImplicitClaimGA=false&fromHomePageTab=buy`;
  }
  await scrapeFromEntryPoint(url);
})().catch(e => console.log(e));
