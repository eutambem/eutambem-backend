'use strict'
const app = require('./app');
const connection = app.db.connectionFactory;
const port = 3000;

connection.getMongoDb().then(dbs => {
  app.locals.dbs = dbs;
  app.listen(port, () => console.log('Listening on port ' + port))
}).catch(err => {
  console.error('Failed to make all database connections!')
  console.error(err)
  process.exit(1)
})