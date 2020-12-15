require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || process.env.API_PORT || 3000;

console.log('> Starting API server...');

app.listen(port, () => {
  console.log('Server listening port: ', port);
});
