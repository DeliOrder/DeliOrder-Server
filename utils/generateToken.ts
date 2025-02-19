import jwt from "jsonwebtoken";

interface TokenPayload {
  _id: string;
  type: string;
}

const generateAccessToken = <T extends Record<string, number>>(
  userId: string,
  loginType: string,
  ...additionalData: T[]
): string => {
  const tokenData: TokenPayload = { _id: userId, type: loginType };

  additionalData.forEach((data) => {
    Object.assign(tokenData, data);
  });

  return jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId: string, loginType: string): string => {
  const tokenData: TokenPayload = { _id: userId, type: loginType };

  return jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "3d",
  });
};

export { generateAccessToken, generateRefreshToken };
