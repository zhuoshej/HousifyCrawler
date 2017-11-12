console.log('Loading function');
const AWS = require('aws-sdk');
const QueueUrl = require('./aws-config.json').sqsHousingDataWithPopularityURL;

AWS.config.loadFromPath('./aws-config.json');
const sqs = new AWS.SQS();

exports.handler = (event, context, callback) => {
  console.log(`length: ${event.Records.length}`);
  const promises = event.Records.map(record => new Promise((resolve) => {
    if (record.eventName === 'REMOVE') {
      console.log(record.dynamodb.OldImage);
      const MessageBody = JSON.stringify(record.dynamodb.OldImage);
      const params = {
        MessageBody,
        QueueUrl
      };
      sqs.sendMessage(params, () => {
        resolve(MessageBody);
      });
    } else {
      resolve(record.eventName);
    }
  }));

  Promise.all(promises).then((values) => {
    callback(null, values);
  }).catch((e) => {
    callback(e);
  });
};
