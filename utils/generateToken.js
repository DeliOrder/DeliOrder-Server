const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, loginType, ...additionalData) => {
  const tokenData = { _id: userId, type: loginType };

  additionalData.forEach((data) => {
    Object.assign(tokenData, data);
  });

  return jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId, loginType) => {
  const tokenData = { _id: userId, type: loginType };
  return jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
