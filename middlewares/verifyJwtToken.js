const jwt = require("jsonwebtoken");

const verifyJWTToken = (req, res, next) => {
  try {
    const JWTToken = req.headers["authorization"]?.split(" ")[1];

    if (!JWTToken) {
      next();
      return;
    }

    const { _id, targetId, type } = jwt.verify(
      JWTToken,
      process.env.JWT_SECRET_KEY,
    );

    req.userId = _id;
    req.targetId = targetId;
    req.loginType = type;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    res.status(401).json({ error });
  }
};

exports.verifyJWTToken = verifyJWTToken;
