const { processData } = require('./dataPreprocess.js');
const cheerio = require('cheerio');

exports.processHTML = (html, id) => {
  let result = { id };
  const $ = cheerio.load(html);

  const addressElement = $('.zsg-breadcrumbs').children();
  let address = '';
  for (let i = 0; i < addressElement.length; i += 1) {
    const key = $(addressElement[i]).attr('id');
    const value = $(addressElement[i]).text();
    if (key !== undefined) { result = processData(result, { key, value }); } else { address += address === '' ? value : ` ${value}`; }
  }
  result = processData(result, { key: 'address', value: address });

  const price = $('.main-row').text();
  result = processData(result, { key: 'price', value: price });

  const factsElement = $('.hdp-facts .zsg-g_gutterless');
  factsElement.children().each((index, child) => {
    const key = $(child).find('.hdp-fact-ataglance-heading').text();
    const value = $(child).find('.hdp-fact-ataglance-value').text();
    if (key !== '' && value !== '') {
      result = processData(result, { key, value });
    }
  });

  const bbsElements = $('.hdp-header-description h3').find('.addr_bbs');
  bbsElements.each((index, currentElement) => {
    const pair = $(currentElement).text().split(' ');
    const key = pair[1];
    const value = pair[0];
    if (key !== '' && value !== '') {
      result = processData(result, { key, value });
    }
  });

  const detailFactElements = $('.hdp-fact-moreless-content').find('.hdp-fact-list');
  detailFactElements.each((index, currentElement) => {
    const key = $($(currentElement).find('.hdp-fact-name')).text();
    const value = $($(currentElement).find('.hdp-fact-value')[0]).text();
    if (key !== '' && value !== '') {
      result = processData(result, { key, value });
    }
  });

  result.lastupdatedate = Math.floor(new Date().getTime() / 1000);
  result.ttl = result.lastupdatedate + 60;
  return result;
};
