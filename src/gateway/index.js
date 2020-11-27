require('dotenv').config();

const path = require('path');

const express = require('express');

const address = require('./address');

const app = express();

// Address routes
app.use('/api/address', address);

// Resolve statics here
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.listen(process.env.APP_PORT, () => {
  let msg = `${process.env.APP_NAME} is listening at ${process.env.APP_HOST}`;

  msg += process.env.APP_PORT.toString() !== '80' ? `:${process.env.APP_PORT}` : '/';
  console.log(msg);
});
