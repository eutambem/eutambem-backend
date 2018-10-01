'use strict';
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_CONN;

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