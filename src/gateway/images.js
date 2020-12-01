const express = require('express');

const router = express.Router();

const { apiClient } = require('./services/ApiClient');

// define the company routes
router.get('/:image', (req, res) => {
  apiClient.getFile(req.originalUrl).then((apiRes) => {
    const img = Buffer.from(apiRes.encoded, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  });
});

module.exports = router;
