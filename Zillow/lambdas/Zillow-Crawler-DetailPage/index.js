console.log('Loading function');
// TODO: when puppeteer is avliable on lambda move to puppeteer
const fetch = require('node-fetch');
const randomUserAgent = require('./randomUserAgent');
const { processHTML } = require('./describePage');
const QueueUrl = require('./aws-config.json').sqsHousingURL;
const AWS = require('aws-sdk');

const PreSoldTableName = 'Houses';
const PostSoldTableName = 'PostSoldHousingTable';

AWS.config.loadFromPath('./aws-config.json');
const ddb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

exports.handler = (event, context, callback) => {
  const { taskURL, longitude, latitude } = JSON.parse(event.Records[0].Sns.Message);
  const urlParts = taskURL.split('/');
  const id = urlParts[urlParts.length - 2];
  console.log(`id is [${id}]`);

  const headers = { 'User-Agent': randomUserAgent() };

  fetch(`${taskURL}?fullpage=true`, { headers }).then(res => res.text()).then((html) => {
    const result = processHTML(html, { id, longitude, latitude });
    const baths = result.baths === undefined ? 0 : result.baths;
    const beds = result.beds === undefined ? 0 : result.beds;
    const price = result.price === undefined ? 0 : result.price;
    if (baths === 0 && beds === 0 && price !== 0) {
      console.log(`No baths & beds for [${id}]`);
      callback(`No baths & beds for [${id}]: ${JSON.stringify(result)}`);
      return;
    }
    console.log(result);


    if (result.zillowdays === undefined && result.saves === undefined) {
      const MessageBody = JSON.stringify(result);
      const params = {
        MessageBody,
        QueueUrl
      };
      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Error', err);
          callback(err);
        } else {
          console.log('Success', data);
          callback(null, `Successfully processed ${taskURL}: Put ${JSON.stringify(result)} to [${id}] to SQS`);
        }
      });
    } else {
      const params = {
        Item: result,
        TableName: PreSoldTableName
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
    }
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
};
