const app = require('./src/app');

const port = 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}/posts`);
});
