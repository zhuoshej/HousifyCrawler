const { processHTML } = require('./describePage.js');
const fetch = require('node-fetch');

const url = process.argv[2];
const urlParts = url.split('/');
const id = urlParts[urlParts.length - 2];

console.log(`Describing: ${url}`);

fetch(`${url}?fullpage=true`).then(res => res.text()).then((html) => {
  const result = processHTML(html, id);
  console.log(result);
});
