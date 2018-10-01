'use strict';
const MongoClient = require('mongodb').MongoClient;
let _db;
const uri = `mongodb://admin:H3]G8*LXcH66e&$hrLsA@eutambem-shard-00-00-qrwe2.mongodb.net:27017,eutambem-shard-00-01-qrwe2.mongodb.net:27017,eutambem-shard-00-02-qrwe2.mongodb.net:27017/test?replicaSet=eutambem-shard-0&ssl=true&authSource=admin`;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(uri, { useNewUrlParser: true }, function(err, db) {
        _db = db;
        return callback(err, db);
      });
    },
  
    getDb: function() {
      return _db.db("eutambem");
    }
  };