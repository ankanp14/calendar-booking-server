const jwt = require('jsonwebtoken');

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

  if (!req.get('Authorization')) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.tokenSecret);
    if (decodedToken.userId && decodedToken.email) {
      console.log(decodedToken);
      next();
    }
  } catch(err) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
};

module.exports = auth;