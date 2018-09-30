var express = require('express');
var load = require('express-load');
const bodyParser = require('body-parser');

module.exports = function(){
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    load('domain', {cwd: 'app'})
        .then('db')
        .into(app);

    return app;
};