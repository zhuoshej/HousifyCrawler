// TODO: when puppeteer is avliable on lambda move to puppeteer
const fetch = require('node-fetch');
const randomUserAgent = require('./randomUserAgent');
const { processHTML } = require('./describePage');
const AWS = require('aws-sdk');

const TableName = 'Houses';

AWS.config.loadFromPath('./aws-config.json');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handler = (event, context, callback) => {
  console.log('Loading function');
  const { taskURL } = JSON.parse(event.Records[0].Sns.Message);
  const urlParts = taskURL.split('/');
  const id = urlParts[urlParts.length - 2];
  console.log(`id is [${id}]`);

  const headers = { 'User-Agent': randomUserAgent() };

  fetch(`${taskURL}?fullpage=true`, { headers }).then(res => res.text()).then((html) => {
    const result = processHTML(html, id);
    if (result.baths === 0 && result.beds === 0) {
      console.log(`No baths & beds for [${id}]`);
      callback(`No baths & beds for [${id}]: ${JSON.stringify(result)}`);
      return;
    }
    console.log(result);
    const params = {
      TableName,
      Item: result
    };

    ddb.put(params, (err, data) => {
      if (err) {
        console.log('Error', err);
        callback(err);
      } else {
        console.log('Success', data);
        callback(null, `Successfully processed ${taskURL}: Put ${JSON.stringify(result)} to [${id}]`);
      }
    });
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};
