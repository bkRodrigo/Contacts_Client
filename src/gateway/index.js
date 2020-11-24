require('dotenv').config();

const path = require('path');

const express = require('express');

const app = express();
/*
app.get('/', (req, res) => {
  res.send('Hello World!')
});
*/

app.use('/', express.static(path.join(__dirname, '../../dist')));

app.listen(process.env.APP_PORT, () => {
  let msg = `${process.env.APP_NAME} is listening at ${process.env.APP_HOST}`;

  msg += process.env.APP_PORT.toString() !== '80' ? `:${process.env.APP_PORT}` : '/';
  console.log(msg);
});
