const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if(authHeader && authHeader.startsWith('Bearer')){
    token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        res.status(401)
        throw new Error('User authorization failed');
      }

      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401)
    throw new Error('Require login');
  }
});

module.exports = validateToken;