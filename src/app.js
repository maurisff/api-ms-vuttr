const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { readdirSync } = require('fs');

// import Model Schemas Mongoose
readdirSync(path.join(__dirname, './models')).forEach((fileName) => {
  const fullPath = path.join(__dirname, './models', fileName);
  // eslint-disable-next-line import/no-dynamic-require
  require(fullPath);
});

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// mongoose instance connection url connection
if (process.env.MONGO_DB) {
  mongoose.Promise = global.Promise;
  mongoose.set('debug', (process.env.NODE_ENV !== 'production'));

  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('Database connected!');
    await require('./helper/defaultDataBase').createDefaultUser();
  }).catch((err) => {
    console.log(`Error connection DB: ${err}`);
  });
} else {
  console.warn('### Database is not defined! ###');
}

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// use morgan to log requests to the console
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// routes
const api = require('./routes');

app.use('/', api);

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  console.error('Internal server error: ', error);
  return response.status(500).json({
    status: 'error',
    message: `Internal server error: ${error.message}`,
  });
});

module.exports = app;
