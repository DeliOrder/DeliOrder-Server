const jwt = require("jsonwebtoken");

const verifyJWTToken = (req, res, next) => {
  try {
    const JWTToken = req.headers["authorization"].split(" ")[1];

    if (!JWTToken) {
      return next();
    }

    const { _id } = jwt.verify(JWTToken, process.env.JWT_SECRET_KEY);

    req.userId = _id;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

exports.verifyJWTToken = verifyJWTToken;
