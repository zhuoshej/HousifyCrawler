const cheerio = require('cheerio');

exports.processHTML = (html) => {
  const $ = cheerio.load(html);
  const photoCardsElements = $('.photo-cards').children();
  const detailPages = [];

  for (let i = 0; i < photoCardsElements.length; i += 1) {
    const current = $(photoCardsElements[i]);
    const article = $(current).find('article');

    const href = $(current).find('a').attr('href');
    const latitude = article.attr('data-latitude');
    const longitude = article.attr('data-longitude');
    detailPages.push({ href, latitude, longitude });
  }
  const next = detailPages.length === 0 ? undefined : $('.zsg-pagination-next > a').attr('href');
  return { detailPages, next };
};
