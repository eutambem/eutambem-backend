'use strict'
const app = require('./config/express')();

app.get('/health-check', (req, res) => res.send('It\'s alive'));

module.exports = app;