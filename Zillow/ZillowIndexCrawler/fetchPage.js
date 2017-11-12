console.log('Loading function');
// TODO: when puppeteer is avliable on lambda move to puppeteer
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const util = require('util');
const { processHTML } = require('./describePage');
const randomUserAgent = require('./randomUserAgent');

AWS.config.loadFromPath('./aws-config.json');

const sns = new AWS.SNS();
const setTimeoutPromise = util.promisify(setTimeout);
const prefix = 'https://www.zillow.com';
const TopicArn = require('./aws-config.json').snsDetailTopicARN;

const pushToSNS = (house) => {
  if (house.href === undefined) return 'Skip';
  else if (house.href.includes('AuthRequired')) return 'Be Detected';
  const taskURL = prefix + house.href;
  const { longitude, latitude } = house;
  const msg = { taskURL, longitude, latitude };
  const snsParams = {
    Message: JSON.stringify(msg),
    TopicArn
  };
  const millisecs = Math.floor(Math.random() * 500) * 1000;
  console.log(`Wait for ${millisecs / 1000} to push ${house.href}`);
  // return taskURL;
  return setTimeoutPromise(millisecs).then(() => new Promise((resolve) => {
    sns.publish(snsParams, (err) => {
      if (err) {
        console.log('ERR', err);
        resolve(err);
      } else {
        resolve(house.href);
      }
    });
  }));
};

exports.fetchPageDetailsAndReturnNextUrl = (url) => {
  const headers = { 'User-Agent': randomUserAgent() };

  console.log(`Fetching: ${url}`);
  return fetch(url, { headers }).then(res => res.text()).then((html) => {
    const { detailPages, next } = processHTML(html);
    const promises = detailPages.map(current => pushToSNS(current));
    const nextURL = next === undefined ? next : prefix + next;

    return Promise.all(promises).then((values) => {
      console.log(values);
      return nextURL;
    });
  }).catch((err) => {
    console.log(err);
    return undefined;
  });
};
