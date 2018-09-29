'use strict'
const express = require('express');
const app = express();
const constants = require('./domain/constants.json');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/report/constants', (req, res) => res.json(constants));

app.get('/health-check', (req, res) => res.send('It\'s alive'));

app.post('/report/save', function(req, res) {
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://127.0.0.1:27017";
    const reportObj = req.body;
    console.log(reportObj);

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        const dbo = db.db("eutambem");
        dbo.collection("report").insertOne(reportObj, function(err, resdb) {
          if (err) throw err;
          res.send('1 report inserted');
          db.close();
        });
    });
});

app.get('/report/list', function(req, res) {
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://127.0.0.1:27017";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db("eutambem");
      dbo.collection("report").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send({list : result});
        db.close();
      });
    });
});

module.exports = app;