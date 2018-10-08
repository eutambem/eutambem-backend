'use strict';
const mongoose = require('mongoose');
const uri = process.env.MONGO_CONN;
let mongoDbConnectionPool = null;

module.exports = {
  getMongoDb: function() {
      if (mongoDbConnectionPool && isConnected(mongoDbConnectionPool)) {
        console.log('Reusing the connection from pool');
        return Promise.resolve(mongoose.connection);
    }

    console.log('Init the new connection pool');
    return mongoose.connect(uri, { poolSize: 10, useNewUrlParser: true })
        .then(dbConnPool => {
                            mongoDbConnectionPool = dbConnPool;
                            return mongoose.connection;
                          });
    }
};

function isConnected(mongoDbConnectionPool) {
  const mongoState = mongoDbConnectionPool.connection.readyState;
  return (mongoState == 1) ? true : false;
}
