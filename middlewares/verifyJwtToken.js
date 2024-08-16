const jwt = require("jsonwebtoken");

const verifyJwtToken = (req, res, next) => {
  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    req.userId = _id;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

exports.verifyJwtToken = verifyJwtToken;
