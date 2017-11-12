const { fetchAllDetailsByZip } = require('./fetchByZip.js');
const { zips } = require('./seattle-zips.json');
const util = require('util');

const setTimeoutPromise = util.promisify(setTimeout);
const { length } = zips;
const type = process.argv[2];

const next = (index) => {
  const millisecs = Math.floor(Math.random() * 10) * 1000;
  const zip = zips[index];
  console.log(`Wait for ${millisecs} to go to entryPoint zip: ${zip}`);
  return setTimeoutPromise(millisecs).then(() => {
    const promise = fetchAllDetailsByZip(zip, type);
    return promise.then(() => {
      if (index >= length) return `Finished ZIP: ${zip}`;
      return next(index + 1);
    });
  });
};

next(0).then((message) => {
  console.log(message);
}).catch((err) => {
  console.log(err);
});
