const express = require('express');
const postsRoute = require('./routes/posts');

const app = express();

app.use(postsRoute);

module.exports = app;
