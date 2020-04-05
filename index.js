const express = require('express');
const bodyParser = require('body-parser');

const { connect, close } = require('./db');
const auth = require('./handlers/auth');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);

process.on('SIGINT', function() {
  close();
  server.close();
});

let server = app.listen(3000, () => {
  console.log("Listening at port 3000");
  connect();
});
