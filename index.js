const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const auth = require('./controllers/auth');
const userRoutes = require('./routes/users')
const bookingRoutes = require('./routes/bookings');


let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth);
app.use(userRoutes);
app.use(bookingRoutes);

let server;

process.on('SIGINT', function() {
  server.close();
});

mongoose.connect(config.dbUrl, { dbName: config.dbName, useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("DB connection established");
    server = app.listen(3000, () => console.log("Listening at port 3000"))
  })
  .catch((err) => {
    console.error("Error in creating connection::", err);
  });
