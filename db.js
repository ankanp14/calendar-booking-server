let MongoClient = require('mongodb').MongoClient;
const config = require('./config');

let db;

const connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.dbUrl, {useNewUrlParser: true}, function(err, connectedDb) {
      if (err) {
        console.log("Error in connecting to serve", err);
        reject(err);
      }

      console.log("Connected successfully to server");
      db = connectedDb;
      resolve();
    });
  });
};

const close = () => {
  console.log("Disconnected from server");
  db.close();
};

const getInstance = () => {
  if (db) {
    return db.db(config.dbName)
  }
  return null;
};

module.exports = {
  getInstance,
  connect,
  close
};
