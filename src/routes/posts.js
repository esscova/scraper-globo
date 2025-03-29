const express = require('express');
const { scrapPosts } = require('../services/scraper');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await scrapPosts();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({
      message: 'Ocorreu um erro ao buscar os posts',
      error: error.message
    });
  }
});

module.exports = router;
