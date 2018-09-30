'use strict';

const MongoClient = require('mongodb').MongoClient;

function createDBConnection() {
    // let uri = `mongodb://admin:H3]G8*LXcH66e&$hrLsA@eutambem-shard-00-00-qrwe2.mongodb.net:27017,eutambem-shard-00-01-qrwe2.mongodb.net:27017,eutambem-shard-00-02-qrwe2.mongodb.net:27017/test?replicaSet=eutambem-shard-0&ssl=true`;
    let uri = "mongodb://127.0.0.1:27017";
    return mongodb.MongoClient.connect(uri);
}

module.exports = function(){
    return createDBConnection;
}