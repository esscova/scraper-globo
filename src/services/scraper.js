const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.globo.com';

async function scrapPosts() {
  try {
    const response = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const posts = [];

    $(".post-row.with-6-posts .post").each(function () {
      const url = $(this).find(".post__link").attr("href");
      const title = $(this).find(".post__title").text().trim();
      if (url && title) {
        posts.push({ url, title });
      }
    });

    return posts;

  } catch (error) {
    console.error('Error during scraping:', error.message);
    throw new Error('Failed to scrape posts');
  }
}

module.exports = { scrapPosts };
