const express = require('express');
const consing = require('consign');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  consing({ cwd: 'app', verbose: false })
    .include('routes')
    .then('db')
    .then('controllers')
    .into(app);

  return app;
};
