import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const verified = jwt.verify(token, "secretkey");

    req.user = verified;

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;