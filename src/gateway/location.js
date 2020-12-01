const express = require('express');

const router = express.Router();

const { apiClient } = require('./services/ApiClient');

// define the location routes
router.get('/', (req, res) => {
  const path = req.originalUrl.replace('/api', '');

  apiClient.get(path).then((apiRes) => res.json(apiRes));
});

module.exports = router;
