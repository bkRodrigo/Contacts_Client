const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const { apiClient } = require('./services/ApiClient');

// define the home page route
router.get('/', (req, res) => {
  const path = req.originalUrl.replace('/api', '');

  apiClient.get(path).then((apiRes) => res.json(apiRes));
});

router.post('/', jsonParser, (req, res) => {
  apiClient.post('/address', req.body).then((apiRes) => res.json(apiRes));
});

module.exports = router;
