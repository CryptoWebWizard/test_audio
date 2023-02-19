const jwt = require("jsonwebtoken");

// const config = process.env;

let TOKEN_KEY = "I_am_JWT"
/**
 * 
We can pass token most of in header but currently pass with body
 */
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token  || req.headers["x-access-token"];

  if (!token) {
    return res.json({
      status: 400,
      error: "true",
      message: "token is missing",
      // request: req.body,

  });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.json({
      status: 401,
      error: "true",
      message: "token is not valid",
      // request: req.body,

  });
  }
  return next();
};

module.exports = verifyToken;
