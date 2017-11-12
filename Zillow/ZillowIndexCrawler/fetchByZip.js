const { fetchPageDetailsAndReturnNextUrl } = require('./fetchPage.js');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);

const next = (url) => {
  const millisecs = Math.floor(Math.random() * 100) * 1000;
  console.log(`Wait for ${millisecs} to fetch ${url}`);
  return setTimeoutPromise(millisecs).then(() => {
    const promise = fetchPageDetailsAndReturnNextUrl(url);
    return promise.then((value) => {
      console.log(`Next URL: ${value}`);
      if (value !== undefined) {
        return next(value);
      }
      return value;
    });
  });
};

exports.fetchAllDetailsByZip = (zip, type) => {
  let entryPoint = `https://www.zillow.com/homes/for_sale/${zip}_rb/`;
  if (type === 'sold') {
    entryPoint = `https://www.zillow.com/homes/recently_sold/${zip}_rb/12m_days/`;
  }
  return next(entryPoint);
};
