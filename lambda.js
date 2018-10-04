'use strict'
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const connection = app.db.connectionFactory;

const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
];

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
exports.handler = (event, context) => {
	connection.getMongoDb().then(dbs => {
		app.locals.dbs = dbs;
		awsServerlessExpress.proxy(server, event, context);
	  })
}