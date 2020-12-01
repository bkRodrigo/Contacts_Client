require('dotenv').config();

const path = require('path');

const express = require('express');

const contact = require('./contact');

const address = require('./address');

const company = require('./company');

const phone = require('./phone');

const location = require('./location');

const photo = require('./photo');

const images = require('./images');

const app = express();

// Contact routes
app.use('/api/contact', contact);

// Address routes
app.use('/api/address', address);

// Company routes
app.use('/api/company', company);

// Phone routes
app.use('/api/phone', phone);

// Location routes
app.use('/api/location', location);

// Photo routes
app.use('/api/photo', photo);

// Images getter route
app.use('/images', images);

// Resolve statics here
app.use('/', express.static(path.join(__dirname, '../../dist')));

app.listen(process.env.APP_PORT, () => {
  let msg = `${process.env.APP_NAME} is listening at ${process.env.APP_HOST}`;

  msg += process.env.APP_PORT.toString() !== '80' ? `:${process.env.APP_PORT}` : '/';
  console.log(msg);
});
