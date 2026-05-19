import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction, // Set to true on production (HTTPS)
    sameSite: isProduction ? "none" : "lax", // Cross-site cookies need "none" on production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  
  return token;
};

export const clearToken = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
