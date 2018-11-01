
const mongoose = require('mongoose');

const uri = process.env.MONGO_CONN;
let mongoDbConnectionPool = null;

function isConnected(pool) {
  const mongoState = pool.connection.readyState;
  return (mongoState === 1);
}

module.exports = {
  getMongoDb() {
    if (mongoDbConnectionPool && isConnected(mongoDbConnectionPool)) {
      console.log('Reusing the connection from pool');
      return Promise.resolve(mongoose.connection);
    }

    console.log('Init the new connection pool');
    return mongoose.connect(uri, { poolSize: 10, useNewUrlParser: true })
      .then((dbConnPool) => {
        mongoDbConnectionPool = dbConnPool;
        return mongoose.connection;
      });
  },
};
