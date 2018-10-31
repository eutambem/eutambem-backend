var express = require('express');
var consing = require('consign');
const bodyParser = require('body-parser');

module.exports = function() {
    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    consing({cwd: 'app', verbose: false})
        .include('routes')
        .then('db')
        .then('controllers')
        .into(app);

    return app;
};