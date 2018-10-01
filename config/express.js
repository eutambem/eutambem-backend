var express = require('express');
var consing = require('consign');
const bodyParser = require('body-parser');

module.exports = function() {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    consing({cwd: 'app', verbose: false})
        .include('models')
        .then('routes')
        .then('db')
        .into(app);

    return app;
};