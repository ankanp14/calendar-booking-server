const config = require('../config');

let auth = (req, res, next) => {
  if (!req.headers || !req.headers["x-api-key"]) {
    return res.status(403).json({ error: 'Unauthorized access' });
  } else if (req.headers["x-api-key"] !== config["x-api-key"]) {
    console.log(req.headers);
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

module.exports = auth;