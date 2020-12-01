const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const { apiClient } = require('./services/ApiClient');

// define the address routes
router.get('/', (req, res) => {
  const path = req.originalUrl.replace('/api', '');

  apiClient.get(path).then((apiRes) => res.json(apiRes));
});

router.post('/', jsonParser, (req, res) => {
  apiClient.post('/contact', req.body).then((apiRes) => res.json(apiRes));
});

router.delete('/:id', jsonParser, (req, res) => {
  const path = req.originalUrl.replace('/api', '');

  apiClient.delete(path).then((apiRes) => res.json(apiRes));
});

module.exports = router;
