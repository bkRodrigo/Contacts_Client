const express = require('express');

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

const router = express.Router();

const { apiClient } = require('./services/ApiClient');

// define the photos routes
router.post('/', upload.single('photo'), (req, res) => {
  apiClient.postMedia('/photo', req).then((apiRes) => res.json(apiRes));
});

module.exports = router;
