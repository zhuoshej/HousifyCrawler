const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');
const ddb = new AWS.DynamoDB();
const params = {
  TableName: 'Houses'
};

ddb.describeTable(params, (err, data) => {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
});
