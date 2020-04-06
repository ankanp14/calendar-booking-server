const config = require('../config');

let bypassList = ['registration', 'login'];

let auth = (req, res, next) => {
  let bypass = false;
  for (let i = 0; i < bypassList.length; i++) {
    if (req.originalUrl.endsWith(bypassList[i])) {
      bypass = true;
    }
  }
  if (bypass) {
    return next();
  }
  if (!req.headers || !req.headers["x-api-key"]) {
    return res.status(403).json({ error: 'Unauthorized access' });
  } else if (req.headers["x-api-key"] !== config["x-api-key"]) {
    console.log(req.headers);
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

module.exports = auth;