'use strict'
const express = require('express');
const app = express();
const constants = require('./domain/constants.json');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/report/constants', (req, res) => res.json(constants));

app.get('/health-check', (req, res) => res.send('It\'s alive'));

app.post('/report', function(req, res) {
    const MongoClient = require('mongodb').MongoClient;
    const uri = `mongodb://admin:H3]G8*LXcH66e&$hrLsA@eutambem-shard-00-00-qrwe2.mongodb.net:27017,eutambem-shard-00-01-qrwe2.mongodb.net:27017,eutambem-shard-00-02-qrwe2.mongodb.net:27017/test?replicaSet=eutambem-shard-0&ssl=true&authSource=admin`;
    const reportObj = req.body;
    console.log(reportObj);

    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, db) {
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
    const uri = `mongodb://admin:H3]G8*LXcH66e&$hrLsA@eutambem-shard-00-00-qrwe2.mongodb.net:27017,eutambem-shard-00-01-qrwe2.mongodb.net:27017,eutambem-shard-00-02-qrwe2.mongodb.net:27017/test?replicaSet=eutambem-shard-0&ssl=true&authSource=admin`;

    MongoClient.connect(uri, { useNewUrlParser: true }, function(err, db) {
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