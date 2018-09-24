'use strict'
const express = require('express');
const app = express();
const constants = require('./domain/constants.json');

var constantsRouter = express.Router();
constantsRouter.get('/', (req, res) => res.json(constants));
app.use('/constants', constantsRouter);


app.get('/db', function(req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : 'eutambem-db-cluster.cluster-cta4f3s1nekd.us-east-1.rds.amazonaws.com',
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