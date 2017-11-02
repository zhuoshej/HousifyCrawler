const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);
const url = 'https://www.zillow.com/homes/for_sale/Seattle-WA_rb/?fromHomePage=true&shouldFireSellPageImplicitClaimGA=false&fromHomePageTab=buy';
const prefix = 'https://www.zillow.com';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';

// TODO: Should be enviroment variable
AWS.config.loadFromPath('./aws-config.json');
const sns = new AWS.SNS({ region: 'us-west-2' });
const TopicArn = 'arn:aws:sns:us-west-2:551838592441:ZillowHouseDetailTask';

const pushToSQS = (taskURL) => {
  const msg = { taskURL };
  const snsParams = {
    Message: JSON.stringify(msg),
    TopicArn
  };

  return setTimeoutPromise(Math.floor(Math.random() * 300 * 1000)).then(async () => {
    await sns.publish(snsParams, (err) => {
      if (err) {
        console.log('ERR', err);
      }
      console.log(taskURL);
    });
    return taskURL;
  });
};

const fetchHouses = async (page) => {
  const pushArray = [];
  const photoCardsElement = await page.$('.photo-cards');
  const houses = await page.evaluate((photoCards) => {
    const children = [];
    for (let i = 0; i < photoCards.childElementCount; i += 1) {
      if (photoCards.children[i].querySelector('a') !== undefined && photoCards.children[i].querySelector('a') != null && photoCards.children[i].querySelector('a').getAttribute('href').includes('zpid')) {
        children.push(photoCards.children[i].querySelector('a').getAttribute('href'));
      }
    }
    return children;
  }, photoCardsElement);
  for (let i = 0; i < houses.length; i += 1) {
    pushArray.push(pushToSQS(`${prefix + houses[i]}`));
  }
  console.log(`Push ${houses.length} to pushArray`);
  return pushArray;
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(userAgent);

  let pushArray = [];
  // TODO: Use search type to go to the first page instead of go direct to url.
  await page.goto(url, { waitUntil: 'networkidle' });

  let nextElement = await page.$('.zsg-pagination-next > a');
  let nextUrl = await page.evaluate(next => next.getAttribute('href'), nextElement);

  while (nextUrl != null) {
    console.log(nextUrl);

    const currentPushArray = await fetchHouses(page);
    pushArray = pushArray.concat(currentPushArray);
    await page.goto(prefix + nextUrl, { waitUntil: 'networkidle' });
    nextElement = await page.$('.zsg-pagination-next > a');
    nextUrl = await page.evaluate(next => (next == null ? null : next.getAttribute('href')), nextElement);
    // nextUrl = null;
  }

  await browser.close();
  await Promise.all(pushArray).then((values) => {
    console.log(values);
    console.log(`Processed for a total number of ${values.length} detail Zillow pages.`);
  });
})().catch(err => console.log(err));
