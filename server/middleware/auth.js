const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is verified
    const user = await User.findById(verified.id);
    if (!user || !user.isVerified) {
      return res.status(401).json({
        message: user ? "Please verify your email first" : "User not found"
      });
    }

    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = verifyToken;
