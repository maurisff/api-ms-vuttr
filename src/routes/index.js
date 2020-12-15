const express = require('express');
const moment = require('moment-timezone');
const path = require('path');
const filterFiles = require('filter-files');
const isDir = require('is-directory');
const authProvider = require('../middleware/authProvider');

const router = express.Router();
// Validações de token e acesso as rotas
router.use(authProvider.verifySecurity);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ status: 'OK', dateTime: moment.format() });
});

const isRouteFile = (fileName) => /((router)|(route))\.js$/.test(fileName);

// eslint-disable-next-line no-unused-vars
const getRoutesFilesFromDirname = (dirname) => filterFiles.sync(dirname, (fp, dir, files, recurse) => {
  if (isRouteFile(fp)) {
    return true;
  }
  return isDir.sync(path.join(dir, fp));
}, true);
getRoutesFilesFromDirname(path.join(__dirname, './')).forEach((fileName) => {
  // eslint-disable-next-line import/no-dynamic-require
  require(fileName)(router);
});
router.get('*', (req, res) => {
  res.status(400).json({
    message: 'Method Not Found',
    method: req.originalMethod,
    endpoint: req.originalUrl,
  });
});

module.exports = router;
