'use strict'
const app = require('./app');
const connection = app.db.connectionFactory;

const port = 3000;

connection.connectToServer(function(err, db) {
  console.log("Connected to database");
  app.listen(port, () =>
    console.log(`Server is listening on port ${port}.`)
  );
});