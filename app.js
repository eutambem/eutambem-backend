'use strict'
const express = require('express');
const app = express();
const constants = require('./domain/constants.json');

app.get('/report/constants', (req, res) => res.json(constants));

app.get('/health-check', (req, res) => res.send('It\'s alive'));

app.post('/report/save', function(req, res) {
    const report = req.body;

    res.send('Vai salvar no banco um dia');
});

app.get('/db', function(req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : 'eutambem-cluster-dev.cluster-cta4f3s1nekd.us-east-1.rds.amazonaws.com',
        user : 'admin',
        password : 'zQ4hMn7GX3',
        database : 'eutbm'
    });
     connection.query('select * from livros',function(err, results) {
        if(err) {
            console.log(err);
        }
        res.send({lista : results});
     });
     connection.end();
    });

module.exports = app;