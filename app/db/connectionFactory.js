'use strict';
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_CONN;
let mongoDbConnectionPool = null;
const mongoDbName = "eutambem";

module.exports = {
  getMongoDb: function() {
      if (mongoDbConnectionPool && mongoDbConnectionPool.isConnected(mongoDbName)) {
        console.log('Reusing the connection from pool');
        return Promise.resolve(mongoDbConnectionPool.db(mongoDbName));
    }

    console.log('Init the new connection pool');
    return MongoClient.connect(uri, { poolSize: 10, useNewUrlParser: true })
        .then(dbConnPool => {
                            mongoDbConnectionPool = dbConnPool;
                            return mongoDbConnectionPool.db(mongoDbName);
                          });
    }
  };