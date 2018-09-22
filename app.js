'use strict'
const express = require('express');
const app = express();
const constants = require('./domain/constants.json');

var constantsRouter = express.Router();
constantsRouter.get('/', (req, res) => res.json(constants));
app.use('/constants', constantsRouter);

module.exports = app;