const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;


exports.authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log(" No token found");
    return res
      .status(403)
      .json({ status: false, message: "Access Denied. No token provided." });
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res
      .status(401)
      .json({ status: false, message: "Invalid Token", error: err });
  }
};

